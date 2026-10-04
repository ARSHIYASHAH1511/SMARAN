import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox, Sphere, Cylinder, Html } from '@react-three/drei';
import { fileToBase64, getMemories, saveMemory, Memory } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { X, Camera, Save, ArrowLeft, MessageSquare, Send, Bot, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface PalaceObject {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  color: string;
  tag?: string;
  icon?: string;
  defaultDesc?: string;
}

const INITIAL_PALACE_OBJECTS: PalaceObject[] = [
  {
    id: 'obj-keys',
    name: "Grandmother's Brass Keys on Gamosa",
    type: 'box',
    position: [-2.5, 0.4, -2.5],
    color: '#eab308',
    tag: 'House & Almirah Keys',
    icon: '🗝️',
    defaultDesc: 'Front gate and wardrobe brass keys kept safely on the corner table on the red-bordered Assamese Gamosa.'
  },
  {
    id: 'obj-meds',
    name: 'Morning BP & Diabetes Medicine Box',
    type: 'box',
    position: [2.5, 0.4, -2.5],
    color: '#059669',
    tag: 'Morning Tablets',
    icon: '💊',
    defaultDesc: 'Daily Blood Pressure and Sugar tablets. Take after breakfast with warm water and fresh Tulsi tea.'
  },
  {
    id: 'obj-tea',
    name: 'Assam CTC Ginger Tea Thermos',
    type: 'cylinder',
    position: [0, 0.5, -2],
    color: '#b45309',
    tag: 'Upper Assam Tea',
    icon: '☕',
    defaultDesc: 'Warm aromatic CTC ginger tea brewed fresh from Upper Assam tea gardens in a traditional brass cup.'
  },
  {
    id: 'obj-bell',
    name: 'Puja Room Brass Bell (Ghanti)',
    type: 'cylinder',
    position: [-2.8, 0.5, 1.5],
    color: '#facc15',
    tag: 'Prayer Ghanti',
    icon: '🔔',
    defaultDesc: 'Sacred brass bell for morning and evening prayer offerings and meditation.'
  },
  {
    id: 'obj-jaapi',
    name: 'Traditional Bamboo Jaapi Hat',
    type: 'sphere',
    position: [2.8, 0.6, 1.5],
    color: '#d97706',
    tag: 'Majuli Bamboo Jaapi',
    icon: '🎋',
    defaultDesc: 'Handcrafted conical bamboo Jaapi hat of honour from Majuli hanging in the room.'
  },
];

interface HouseLayout {
  wallColor: string;
  floorColor: string;
  windowFrameColor: string;
}

function HouseRoom({ config }: { config: HouseLayout }) {
  const w = 14;
  const h = 7;
  const d = 14;
  const wallThickness = 0.5;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[w + 1, 0.5, d + 1]} />
        <meshStandardMaterial color={config.floorColor} roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, h, 0]} receiveShadow castShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>
      
      {/* Pitched Roof */}
      <mesh position={[0, h + 2.5, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow castShadow>
        <coneGeometry args={[11, 5, 4]} />
        <meshStandardMaterial color="#92400e" roughness={0.9} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, h/2, -d/2]} receiveShadow castShadow>
        <boxGeometry args={[w, h, wallThickness]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-w/2, h/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, h, d]} />
        <meshStandardMaterial color={config.wallColor} />
      </mesh>

      {/* Front Wall (with doorway) */}
      <group position={[0, 0, d/2]}>
        <mesh position={[-w/2 + 2, h/2, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, h, wallThickness]} />
          <meshStandardMaterial color={config.wallColor} />
        </mesh>
        <mesh position={[w/2 - 2, h/2, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, h, wallThickness]} />
          <meshStandardMaterial color={config.wallColor} />
        </mesh>
        <mesh position={[0, h - 1, 0]} receiveShadow castShadow>
          <boxGeometry args={[w - 8, 2, wallThickness]} />
          <meshStandardMaterial color={config.wallColor} />
        </mesh>
      </group>

      {/* Right Wall with Window */}
      <group position={[w/2, 0, 0]}>
         <mesh position={[0, 1.25, 0]} receiveShadow castShadow>
           <boxGeometry args={[wallThickness, 2.5, d]} />
           <meshStandardMaterial color={config.wallColor} />
         </mesh>
         <mesh position={[0, h - 1, 0]} receiveShadow castShadow>
           <boxGeometry args={[wallThickness, 2, d]} />
           <meshStandardMaterial color={config.wallColor} />
         </mesh>
         <mesh position={[0, h/2, 4]} receiveShadow castShadow>
           <boxGeometry args={[wallThickness, h, 6]} />
           <meshStandardMaterial color={config.wallColor} />
         </mesh>
         <mesh position={[0, h/2, -4]} receiveShadow castShadow>
           <boxGeometry args={[wallThickness, h, 6]} />
           <meshStandardMaterial color={config.wallColor} />
         </mesh>
         
         <mesh position={[-0.1, 3.75, 0]}>
           <boxGeometry args={[0.1, 3, 2]} />
           <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} roughness={0.1} />
         </mesh>
         <mesh position={[-0.15, 3.75, 0]}>
           <boxGeometry args={[0.15, 3.2, 2.2]} />
           <meshStandardMaterial color={config.windowFrameColor} />
         </mesh>
      </group>
    </group>
  );
}

function GardenSurroundings() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#86efac" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 12]} receiveShadow>
        <planeGeometry args={[3, 10]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
      </mesh>
      <group position={[2.5, 0, 16]}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.2]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.3, 0.6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.6]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
      <group position={[-5, 0, 7.5]}>
        <Sphere args={[0.8, 16, 16]} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </Sphere>
        <Sphere args={[0.6, 16, 16]} position={[1, 0.3, 0.5]} castShadow receiveShadow>
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </Sphere>
      </group>
      <group position={[5, 0, 7.5]}>
        <Sphere args={[0.9, 16, 16]} position={[0, 0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </Sphere>
      </group>
      <mesh position={[0, 0.75, -19.5]} castShadow receiveShadow>
        <boxGeometry args={[40, 1.5, 0.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh position={[-19.5, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1.5, 40]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh position={[19.5, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 1.5, 40]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh position={[-10.5, 0.75, 19.5]} castShadow receiveShadow>
        <boxGeometry args={[18, 1.5, 0.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh position={[10.5, 0.75, 19.5]} castShadow receiveShadow>
        <boxGeometry args={[18, 1.5, 0.2]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function MemoryPalace() {
  const { t } = useLanguage();

  const getLocalizedObjectName = (obj: { id: string; name: string; tag?: string }) => {
    if (obj.id === 'obj-keys') return t.palace.keys;
    if (obj.id === 'obj-meds') return t.palace.medicine;
    if (obj.id === 'obj-tea') return t.palace.teaFlask;
    if (obj.id === 'obj-bell') return t.palace.pujaBell;
    if (obj.id === 'obj-jaapi') return t.palace.jaapi;
    return obj.tag || obj.name;
  };

  const getLocalizedObjectDesc = (obj: { id: string; defaultDesc?: string }) => {
    if (obj.id === 'obj-keys') return t.palace.keysDesc;
    if (obj.id === 'obj-meds') return t.palace.medicineDesc;
    if (obj.id === 'obj-tea') return t.palace.teaFlaskDesc;
    if (obj.id === 'obj-bell') return t.palace.pujaBellDesc;
    if (obj.id === 'obj-jaapi') return t.palace.jaapiDesc;
    return obj.defaultDesc || '';
  };

  const [memories, setMemories] = useState<Memory[]>([]);
  const [palaceObjects, setPalaceObjects] = useState(INITIAL_PALACE_OBJECTS);
  const [history, setHistory] = useState<typeof INITIAL_PALACE_OBJECTS[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [houseConfig, setHouseConfig] = useState<HouseLayout | null>(null);
  const [showHousePrompt, setShowHousePrompt] = useState(false);
  const [housePromptInput, setHousePromptInput] = useState('');

  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'bot', text: string, image?: string}[]>([
    { role: 'bot', text: 'Namaskar! Need help imagining this palace? Describe what you want here.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    loadPalaceData();
  }, []);

  const loadPalaceData = async () => {
    setIsLoading(true);
    try {
      // 1. Load memories from localforage
      const localMems = await getMemories();
      let allMemories = [...localMems];

      // 2. Load palace layout config from localStorage
      const cachedConfig = localStorage.getItem('Smaran_palace_config');
      if (cachedConfig) {
        try {
          const parsed = JSON.parse(cachedConfig);
          if (parsed.houseConfig) setHouseConfig(parsed.houseConfig);
          if (parsed.objects) setPalaceObjects(parsed.objects);
        } catch {
          setShowHousePrompt(true);
        }
      } else {
        setShowHousePrompt(true);
      }

      setMemories(allMemories);
    } catch (error) {
      console.warn("Notice loading palace data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePalaceState = async (newConfig: any, newObjects: any) => {
    try {
      localStorage.setItem('Smaran_palace_config', JSON.stringify({
        houseConfig: newConfig,
        objects: newObjects
      }));
    } catch (e) {
      console.warn("Notice saving to localStorage:", e);
    }
  };

  const handleBuildHouse = async () => {
    if (!housePromptInput.trim()) return;
    setIsChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: housePromptInput, persona: 'house_builder' })
      });
      const data = await res.json();
      
      const config: HouseLayout = {
        wallColor: data.wallColor || '#fef3c7',
        floorColor: data.floorColor || '#d97706',
        windowFrameColor: data.windowFrameColor || '#92400e'
      };
      
      setHouseConfig(config);
      await savePalaceState(config, palaceObjects);
      
      setShowHousePrompt(false);
      setChatMessages([{ role: 'bot', text: data.description || "Your house has been built. How can I help you add memories to it?" }]);
    } catch (e) {
      console.error(e);
      const fallbackConfig: HouseLayout = {
        wallColor: '#fef3c7',
        floorColor: '#d97706',
        windowFrameColor: '#92400e'
      };
      setHouseConfig(fallbackConfig);
      setShowHousePrompt(false);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleObjectClick = (objectId: string) => {
    setSelectedObjectId(objectId);
    const existingMemory = memories.find((m) => m.objectId === objectId);
    const targetObj = palaceObjects.find((o) => o.id === objectId);
    
    if (existingMemory) {
      setDescription(existingMemory.description);
      setImage(existingMemory.image);
      setIsEditing(false);
    } else {
      setDescription(targetObj?.defaultDesc || '');
      setImage(null);
      setIsEditing(!targetObj?.defaultDesc);
    }
  };

  const closeModal = () => {
    setSelectedObjectId(null);
    setDescription('');
    setImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImage(base64);
    }
  };

  const handleSaveMemory = async () => {
    if (!selectedObjectId) return;
    
    const existingMemory = memories.find((m) => m.objectId === selectedObjectId);
    const memoryId = existingMemory?.id || uuidv4();
    const memoryToSave: Memory = {
      id: memoryId,
      objectId: selectedObjectId,
      image,
      description,
      date: Date.now(),
    };
    
    try {
      await saveMemory(memoryToSave);
      await loadPalaceData();
      setIsEditing(false);
    } catch (e) {
      console.warn("Failed to save memory", e);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const memoriesData = memories.map(m => ({ id: m.id, description: m.description }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, persona: 'palace', memories: memoriesData })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const newMsg: any = { role: 'bot', text: data.text };
      if (data.relevantMemoryId) {
         const relMem = memories.find(m => m.id === data.relevantMemoryId);
         if (relMem && relMem.image) {
            newMsg.image = relMem.image;
         }
      }
      
      setChatMessages(prev => [...prev, newMsg]);
      
      if (data.newObjects && data.newObjects.length > 0) {
        setHistory(prev => [...prev, [...palaceObjects]]);
        
        const mappedObjects = data.newObjects.map((obj: any) => ({
          id: `obj-${uuidv4()}`,
          name: obj.name,
          type: obj.type,
          position: obj.position,
          color: obj.color
        }));
        
        const newObjects = [...palaceObjects, ...mappedObjects];
        setPalaceObjects(newObjects);
        await savePalaceState(houseConfig, newObjects);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting right now." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleUndo = async () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setPalaceObjects(previousState);
      setHistory(prev => prev.slice(0, -1));
      await savePalaceState(houseConfig, previousState);
    }
  };

  const selectedMemoryObj = palaceObjects.find(o => o.id === selectedObjectId);
  const existingMemory = memories.find((m) => m.objectId === selectedObjectId);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#faf8f5]">
        <div className="w-10 h-10 border-3 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#faf8f5] pb-20 overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
          <color attach="background" args={['#f3efe8']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.9} castShadow />
          
          {houseConfig ? (
            <HouseRoom config={houseConfig} />
          ) : (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#ebe6de" />
            </mesh>
          )}

          {palaceObjects.map((obj) => (
            <group key={obj.id} position={obj.position as [number, number, number]}>
              {obj.type === 'cylinder' && (
                <Cylinder args={[0.5, 0.5, 1]} castShadow onClick={(e) => { e.stopPropagation(); handleObjectClick(obj.id); }}>
                  <meshStandardMaterial color={obj.color} roughness={0.3} metalness={0.1} />
                </Cylinder>
              )}
              {obj.type === 'box' && (
                <RoundedBox args={[1, 0.9, 1]} radius={0.1} castShadow onClick={(e) => { e.stopPropagation(); handleObjectClick(obj.id); }}>
                  <meshStandardMaterial color={obj.color} roughness={0.7} />
                </RoundedBox>
              )}
              {obj.type === 'sphere' && (
                <Sphere args={[0.6, 32, 32]} castShadow onClick={(e) => { e.stopPropagation(); handleObjectClick(obj.id); }}>
                  <meshStandardMaterial color={obj.color} roughness={0.2} metalness={0.3} />
                </Sphere>
              )}
              {memories.some(m => m.objectId === obj.id) && (
                <mesh position={[0, 1.3, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="#059669" />
                </mesh>
              )}
              <Html position={[0, 1.1, 0]} center distanceFactor={14}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleObjectClick(obj.id); }}
                  className="cursor-pointer bg-white/95 hover:bg-stone-50 border border-stone-300 shadow-xs px-2.5 py-1 rounded-full text-xs font-semibold text-stone-900 flex items-center gap-1.5 whitespace-nowrap pointer-events-auto transition-transform active:scale-95"
                >
                  <span>{obj.icon || '📍'}</span>
                  <span>{getLocalizedObjectName(obj)}</span>
                </button>
              </Html>
            </group>
          ))}
          <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={20} blur={2} far={4} />
          <Environment preset="city" />
          <GardenSurroundings />
          <OrbitControls enablePan={true} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.05} minDistance={4} maxDistance={35} />
        </Canvas>
      </div>

      <div className="absolute top-0 w-full p-4 sm:p-5 bg-gradient-to-b from-white/90 via-white/70 to-transparent pointer-events-none flex flex-col gap-2 z-30">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-2">
              <span>{t.palace.title}</span>
              <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                Safe Sanctuary
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">{t.palace.subtitle}</p>
          </div>
        </div>

        {/* NER Essentials Quick Finder */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
            Daily Essentials:
          </span>
          {INITIAL_PALACE_OBJECTS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleObjectClick(item.id)}
              className="bg-white/95 hover:bg-stone-50 border border-stone-200 shadow-2xs px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-800 flex items-center gap-1.5 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{getLocalizedObjectName(item)}</span>
            </button>
          ))}
        </div>
      </div>

      {isChatLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-2xs z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-stone-200 flex flex-col items-center">
            <div className="w-10 h-10 border-3 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-stone-800 font-bold text-base">Updating Memory Palace...</p>
          </div>
        </div>
      )}

      {/* Collapsible Chat Guide */}
      <div className={`absolute top-20 right-4 sm:right-6 transition-all duration-300 z-40 flex flex-col items-end ${isChatOpen ? 'w-80 sm:w-96' : 'w-12'}`}>
        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-xl mb-3 border border-stone-200 overflow-hidden flex flex-col h-96 w-full">
            <div className="bg-stone-900 text-white p-3.5 flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2"><Bot className="w-4 h-4"/> Palace Guide</span>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button onClick={handleUndo} className="px-2 py-0.5 bg-stone-800 rounded text-xs hover:bg-stone-700 transition-colors">
                    Undo
                  </button>
                )}
                <button onClick={() => setIsChatOpen(false)}><X className="w-5 h-5"/></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-stone-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl text-xs sm:text-sm ${msg.role === 'user' ? 'bg-stone-900 text-white ml-6 rounded-tr-none' : 'bg-white border border-stone-200 text-stone-800 mr-6 rounded-tl-none shadow-2xs'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.image && (
                     <img src={msg.image} alt="Related Memory" className="mt-2 rounded-lg w-full object-cover max-h-40 border border-stone-200" />
                  )}
                </div>
              ))}
              {isChatLoading && <div className="text-xs text-stone-500 italic">Thinking...</div>}
            </div>

            <div className="p-2.5 bg-white border-t border-stone-200 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about your palace..."
                className="flex-1 px-3 py-1.5 bg-stone-100 rounded-lg outline-none text-xs sm:text-sm text-stone-900"
              />
              <button onClick={handleSendChat} disabled={!chatInput.trim() || isChatLoading} className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                <Send className="w-4 h-4"/>
              </button>
            </div>
          </div>
        )}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-12 h-12 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105"
            title="Palace Assistant"
          >
            <MessageSquare className="w-5 h-5 text-stone-700" />
          </button>
        )}
      </div>

      {selectedObjectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-stone-200 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">
                {selectedMemoryObj ? getLocalizedObjectName(selectedMemoryObj) : ''}
              </h2>
              <button onClick={closeModal} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col gap-4">
              {!isEditing && existingMemory ? (
                <div className="flex flex-col gap-4">
                  {existingMemory.image && <img src={existingMemory.image} alt="Memory" className="w-full h-52 object-cover rounded-2xl border border-stone-200" />}
                  <p className="text-base text-stone-800 leading-relaxed font-medium bg-stone-50 p-4 rounded-xl border border-stone-200">
                    {existingMemory.description || (selectedMemoryObj ? getLocalizedObjectDesc(selectedMemoryObj) : '') || "No description provided."}
                  </p>
                  <button onClick={() => setIsEditing(true)} className="p-3 text-sm font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors">Edit Memory</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 hover:bg-stone-100 cursor-pointer overflow-hidden transition-colors">
                    {image ? (
                      <img src={image} alt="Upload preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-4 pb-5">
                        <Camera className="w-10 h-10 text-stone-400 mb-2" />
                        <p className="text-sm font-semibold text-stone-600">Tap to attach a photo</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What do you want to remember about this item?" className="w-full p-4 text-sm text-stone-800 border border-stone-200 rounded-xl h-36 focus:border-stone-400 outline-none resize-none" />
                  <button onClick={handleSaveMemory} disabled={!description && !image} className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs">
                    <Save className="w-5 h-5" /> {t.palace.saveMemory}
                  </button>
                  {existingMemory && <button onClick={() => setIsEditing(false)} className="w-full py-2 text-sm font-semibold text-stone-600 flex items-center justify-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Cancel</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* House Builder Prompt */}
      {showHousePrompt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-xl border border-stone-200">
            <div className="flex items-center gap-2.5 text-stone-900 mb-2">
              <Home className="w-6 h-6 text-stone-700" />
              <h2 className="text-xl font-bold">Build Your Familiar Room</h2>
            </div>
            <p className="text-stone-600 text-sm mb-4 leading-relaxed">
              Before we begin placing objects, describe what you remember about your house: wall colors, wooden or tiled floors. We will shape a familiar room for you.
            </p>
            <textarea
              value={housePromptInput}
              onChange={e => setHousePromptInput(e.target.value)}
              placeholder="E.g., The walls were light cream and we had polished bamboo or dark wooden floors..."
              className="w-full p-3 border border-stone-200 rounded-xl h-28 focus:border-stone-400 outline-none text-sm resize-none mb-3 text-stone-800"
            />
            <button
              onClick={handleBuildHouse}
              disabled={isChatLoading || !housePromptInput.trim()}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              {isChatLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Build My Room"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
