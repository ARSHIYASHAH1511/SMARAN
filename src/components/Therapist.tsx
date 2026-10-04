import { useState, useEffect, useRef } from 'react';
import { Send, User, HeartHandshake, Sparkles, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { getMemories } from '../lib/db';
import { getActivities } from '../lib/activityStore';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import { imgTherapist } from '../assets/images';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
  attachedImage?: string;
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
}

const LOCAL_CHATS_KEY = 'Smaran_local_chats';
const LOCAL_MESSAGES_PREFIX = 'Smaran_chat_msgs_';

export default function Therapist() {
  const { t } = useLanguage();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat list from local storage on mount
  useEffect(() => {
    try {
      const storedChats = localStorage.getItem(LOCAL_CHATS_KEY);
      if (storedChats) {
        const parsed: ChatSession[] = JSON.parse(storedChats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
          setActiveChatId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Notice loading local chats:', e);
    }

    // Default first conversation
    const initialChatId = 'chat-welcome';
    const initialChat: ChatSession = {
      id: initialChatId,
      title: 'Gentle Reminiscence',
      updatedAt: Date.now(),
    };
    const welcomeMsg: Message = {
      id: 'welcome-msg-1',
      role: 'assistant',
      text: 'Namaskar. I am here to listen. Would you like to share a memory from your childhood, or perhaps talk about your home and family today?',
      createdAt: Date.now(),
    };

    setChats([initialChat]);
    setActiveChatId(initialChatId);
    setMessages([welcomeMsg]);
    try {
      localStorage.setItem(LOCAL_CHATS_KEY, JSON.stringify([initialChat]));
      localStorage.setItem(`${LOCAL_MESSAGES_PREFIX}${initialChatId}`, JSON.stringify([welcomeMsg]));
    } catch {
      // safe fallback
    }
  }, []);

  // When activeChatId changes, load messages for this chat
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    try {
      const stored = localStorage.getItem(`${LOCAL_MESSAGES_PREFIX}${activeChatId}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        const welcomeMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          text: 'Namaskar. How are you feeling right now? Tell me about something peaceful you remember.',
          createdAt: Date.now(),
        };
        setMessages([welcomeMsg]);
        localStorage.setItem(`${LOCAL_MESSAGES_PREFIX}${activeChatId}`, JSON.stringify([welcomeMsg]));
      }
    } catch (e) {
      console.warn('Notice loading chat messages:', e);
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveChatsList = (updated: ChatSession[]) => {
    setChats(updated);
    try {
      localStorage.setItem(LOCAL_CHATS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save chats:', e);
    }
  };

  const saveChatMessages = (chatId: string, updatedMsgs: Message[]) => {
    setMessages(updatedMsgs);
    try {
      localStorage.setItem(`${LOCAL_MESSAGES_PREFIX}${chatId}`, JSON.stringify(updatedMsgs));
    } catch (e) {
      console.warn('Could not save messages:', e);
    }
  };

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const now = Date.now();
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Conversation',
      updatedAt: now,
    };
    const welcomeMsg: Message = {
      id: uuidv4(),
      role: 'assistant',
      text: 'Namaskar. I am ready. What is on your mind today?',
      createdAt: now,
    };

    const updated = [newChat, ...chats];
    saveChatsList(updated);
    setActiveChatId(newChatId);
    saveChatMessages(newChatId, [welcomeMsg]);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const remaining = chats.filter((c) => c.id !== chatId);
    try {
      localStorage.removeItem(`${LOCAL_MESSAGES_PREFIX}${chatId}`);
    } catch {
      // safe
    }
    saveChatsList(remaining);
    if (activeChatId === chatId) {
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const currentChatId = activeChatId || `chat-${Date.now()}`;
    const now = Date.now();
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      text: text.trim(),
      createdAt: now,
    };

    const newMessages = [...messages, userMsg];
    saveChatMessages(currentChatId, newMessages);

    // Update chat title if it's a new conversation
    const currentChat = chats.find((c) => c.id === currentChatId);
    if (currentChat && (currentChat.title === 'New Conversation' || currentChat.title === 'Gentle Reminiscence')) {
      const summaryTitle = text.trim().substring(0, 26) + (text.length > 26 ? '...' : '');
      const updatedChats = chats.map((c) =>
        c.id === currentChatId ? { ...c, title: summaryTitle, updatedAt: now } : c
      );
      saveChatsList(updatedChats);
    }

    setInput('');
    setIsLoading(true);

    try {
      const localMemories = await getMemories();
      const allMemories = localMemories.filter((m) => m.image);
      const activities = getActivities().slice(0, 10);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          persona: 'therapist',
          memories: allMemories,
          activities: activities,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        text: data.text || 'I hear you. Tell me more about that memory.',
        createdAt: Date.now(),
        attachedImage: data.attachedMemory?.image,
      };

      const finalMessages = [...newMessages, assistantMsg];
      saveChatMessages(currentChatId, finalMessages);
    } catch (error) {
      console.error('Therapist reply error:', error);
      const fallbackMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        text: 'I am here with you. Let us take a gentle breath and share a peaceful memory of home.',
        createdAt: Date.now(),
      };
      saveChatMessages(currentChatId, [...newMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#faf8f5] pb-24 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar for chat history */}
      <div className="md:w-72 bg-white border-r border-stone-200 flex flex-col h-1/4 md:h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-white">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-stone-600" />
            <span>Past Conversations</span>
          </h2>
          <button
            onClick={createNewChat}
            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl flex items-center justify-between gap-2 transition-colors border text-xs sm:text-sm cursor-pointer ${
                activeChatId === chat.id
                  ? 'bg-stone-100 border-stone-400 font-semibold text-stone-900 shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </div>
              {chats.length > 1 && (
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {chats.length === 0 && (
            <div className="p-4 text-center text-stone-500 text-xs italic">
              No conversations yet. Start a new one!
            </div>
          )}
        </div>

        <div className="p-3 border-t border-stone-100 bg-stone-50 text-center">
          <p className="text-[11px] text-stone-500 font-medium">
            Offline-first & secure • No login required
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-3/4 md:h-full bg-[#faf8f5]">
        <header className="bg-white border-b border-stone-200 p-3.5 sm:p-4 flex items-center gap-3">
          <div className="relative">
            <img
              src={imgTherapist}
              alt="Companion"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-stone-200 shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              {t.therapist.title}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {t.therapist.subtitle}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 opacity-80 text-xs font-semibold">
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <img
                      src={imgTherapist}
                      alt="Therapist"
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  )}
                  <span>{msg.role === 'user' ? 'You' : 'Companion'}</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.attachedImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-stone-200 shadow-2xs">
                    <img
                      src={msg.attachedImage}
                      alt="Memory"
                      className="w-full h-auto max-h-56 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3.5 bg-white border-t border-stone-200">
          <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSend('I used to visit Majuli island as a child. It was beautiful.')}
                  className="text-left bg-stone-50 hover:bg-stone-100 text-stone-800 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>"I used to visit Majuli island as a child..."</span>
                </button>
                <button
                  onClick={() => handleSend('Tell me about traditional Bihu celebrations in Assam.')}
                  className="text-left bg-stone-50 hover:bg-stone-100 text-stone-800 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2 transition-colors text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>"Tell me about traditional Bihu celebrations..."</span>
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder={t.therapist.typePlaceholder}
                className="flex-1 text-sm p-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 rounded-xl outline-none text-stone-900 transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="px-4 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl transition-colors flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
