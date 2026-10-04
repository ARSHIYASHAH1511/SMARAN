export type Language = 'en' | 'as' | 'brx' | 'mni' | 'hi';

export interface TranslationStrings {
  appName: string;
  appTagline: string;
  greeting: string;
  // Dashboard & global shortcuts
  title: string;
  tagline: string;
  offlineMode: string;
  onlineMode: string;
  quickTour: string;
  offlineBannerTitle: string;
  offlineBannerDesc: string;
  reminders: string;
  takeMedicine: string;
  takeMedicineSub: string;
  cognitiveGames: string;
  matchMotifs: string;
  matchMotifsDesc: string;
  memoryCards: string;
  memoryCardsDesc: string;
  sequenceMemory: string;
  sequenceMemoryDesc: string;
  familySupport: string;
  callFamily: string;
  callFamilySub: string;
  tabs: {
    profile: string;
    home: string;
    rituals: string;
    palace: string;
    album: string;
    listen: string;
  };
  dashboard: {
    urgentReminders: string;
    morningMedicine: string;
    medicineDesc: string;
    keepMindActive: string;
    motifMatch: string;
    motifMatchDesc: string;
    memoryCards: string;
    memoryCardsDesc: string;
    sequenceMemory: string;
    sequenceMemoryDesc: string;
    familySupport: string;
    callFamily: string;
    callFamilyDesc: string;
    voiceGuide: string;
  };
  palace: {
    title: string;
    subtitle: string;
    keys: string;
    keysDesc: string;
    medicine: string;
    medicineDesc: string;
    teaFlask: string;
    teaFlaskDesc: string;
    pujaBell: string;
    pujaBellDesc: string;
    jaapi: string;
    jaapiDesc: string;
    saveMemory: string;
  };
  album: {
    title: string;
    empty: string;
    emptyDesc: string;
    page: string;
    addMemory: string;
    recordVoice: string;
    stopRecording: string;
    playVoice: string;
  };
  therapist: {
    title: string;
    subtitle: string;
    typePlaceholder: string;
    voiceGuide: string;
  };
  voiceAI: {
    title: string;
    promptPlaceholder: string;
  };
  tutorial: {
    title: string;
    welcome: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    close: string;
    next: string;
    prev: string;
    finish: string;
  };
  offline: {
    online: string;
    offlineCache: string;
    syncQueue: string;
    toggleSimulation: string;
  };
  bhashini: {
    badge: string;
    poweredBy: string;
  };
  settings: {
    title: string;
    patientProfile: string;
    age: string;
    protocol: string;
    language: string;
    languageSubtitle: string;
    telemetryTitle: string;
    telemetrySubtitle: string;
    clinicalReportTitle: string;
    clinicalReportSubtitle: string;
    generateReport: string;
    analyzingReport: string;
    downloadDoc: string;
    downloadMd: string;
    regenerate: string;
    reminderSettingsTitle: string;
    reminderSettingsSubtitle: string;
    configure: string;
    walkthroughTitle: string;
    walkthroughSubtitle: string;
    restartTour: string;
    close: string;
  };
  actions: {
    back: string;
    close: string;
    save: string;
    done: string;
    snooze: string;
    testAudio: string;
    takeMedication: string;
    completed: string;
    speakVoice: string;
    dueNow: string;
    inMinutes: string;
    inHoursMinutes: string;
    repeatEvery90Min: string;
    repeatEvery3Min?: string;
  };
}

const BASE_TRANSLATIONS: Record<Language, any> = {
  en: {
    appName: 'SMARAN',
    appTagline: 'Remember. Relive. Reconnect.',
    greeting: 'Namaskar! Here is your daily gentle guide.',
    tabs: {
      profile: 'Profile',
      home: 'Home',
      rituals: 'Daily Care',
      palace: 'Memory Palace',
      album: 'Photo Album',
      listen: 'Companion',
    },
    dashboard: {
      urgentReminders: 'Scheduled Daily Care',
      morningMedicine: 'Take Morning Medicine',
      medicineDesc: 'With a glass of warm water & Tulsi tea',
      keepMindActive: 'Keep Your Mind Active',
      motifMatch: 'Match Cultural Motifs',
      motifMatchDesc: 'Find 3 matching regional tiles: Rhino, Gamosa, Dhol.',
      memoryCards: 'Cultural Memory Cards',
      memoryCardsDesc: 'Flip & remember iconic symbols of Assam & North East.',
      sequenceMemory: 'Follow the Rhythms',
      sequenceMemoryDesc: 'Remember traditional Bihu & folk sequences.',
      familySupport: 'Family & Support',
      callFamily: 'Call Daughter (Anjali)',
      callFamilyDesc: 'Tap to start a gentle voice call',
      voiceGuide: 'Voice Assistant Ready',
    },
    palace: {
      title: 'Memory Palace',
      subtitle: 'Your safe mental room for daily essentials in the North East',
      keys: "Grandmother's Brass Keys on Gamosa",
      keysDesc: 'Front gate & wardrobe keys kept safely on the embroidered cloth.',
      medicine: 'Morning BP & Sugar Tablet Box',
      medicineDesc: 'Two tablets taken daily with warm water at 8:00 AM.',
      teaFlask: 'Assam CTC Ginger Tea Thermos & Brass Cup',
      teaFlaskDesc: 'Warm aromatic tea brewed fresh from upper Assam gardens.',
      pujaBell: 'Puja Room Brass Bell',
      pujaBellDesc: 'For morning and dusk prayer rituals.',
      jaapi: 'Traditional Bamboo Jaapi Hat',
      jaapiDesc: 'Handcrafted conical bamboo hat of honour hanging on the wall.',
    },
    tutorial: {
      title: 'Welcome to SMARAN',
      welcome: 'Remember. Relive. Reconnect. A gentle, step-by-step tour designed for elders and caregivers.',
      step1Title: '1. Daily Routine & Reminders',
      step1Desc: 'On the Home tab, find large audio-assisted reminders for medicine, hydration, and gentle check-ins.',
      step2Title: '2. 3D Memory Palace (Essential Items)',
      step2Desc: 'Never lose your house keys or morning medicines! View your 3D room with quick tags for your keys, tea, and prescriptions.',
      step3Title: '3. Cultural Photo Album',
      step3Desc: 'Browse cherished family moments from Majuli, Kaziranga, and festivals with speech captions.',
      step4Title: '4. Reminiscence Companion',
      step4Desc: 'Talk or listen to a gentle companion who knows your North Eastern memories and shows family photos automatically.',
      step5Title: '5. Voice AI & Caregiver Analytics',
      step5Desc: 'Tap the microphone for hands-free voice control. Caregivers can view weekly cognitive progress charts in Profile.',
      close: 'Skip Tour',
      next: 'Next',
      prev: 'Back',
      finish: 'Start Using SMARAN',
    },
    offline: {
      online: 'Cloud Sync Live',
      offlineCache: 'Offline Ready',
      syncQueue: 'Offline Resilience Active: SQLite/IndexedDB queue keeps your game scores & memories safe without internet.',
      toggleSimulation: 'Simulate Offline Mode',
    },
    bhashini: {
      badge: 'Bhashini NER Enabled',
      poweredBy: 'AI Voice & Translation tuned for North Eastern dialects',
    },
    settings: {
      title: 'Settings & Clinical Profile',
      patientProfile: 'Patient Profile',
      age: 'Age',
      protocol: 'Care Protocol Active',
      language: 'Language & Regional Dialect',
      languageSubtitle: 'Select a preferred language for all text across the entire application.',
      telemetryTitle: 'Weekly Cognitive Telemetry & Trends',
      telemetrySubtitle: 'Continuous performance tracking across Visual Motif Matching and Working Memory recall.',
      clinicalReportTitle: 'Clinical Dementia Assessment Report',
      clinicalReportSubtitle: 'Generates an objective clinical evaluation of dementia stage, memory retention, and safety recommendations.',
      generateReport: 'Generate Clinical Dementia Report',
      analyzingReport: 'Analyzing Patient Telemetry...',
      downloadDoc: 'Download Medical Doc (.doc)',
      downloadMd: 'Download Markdown (.md)',
      regenerate: 'Regenerate',
      reminderSettingsTitle: 'Medication & Activity Alerts',
      reminderSettingsSubtitle: 'Configure repeating intervals for medicines, memory palace visits, and chimes.',
      configure: 'Configure',
      walkthroughTitle: 'Website Walkthrough Tour',
      walkthroughSubtitle: 'Replay the simple step-by-step introduction to SMARAN.',
      restartTour: 'Start Tour',
      close: 'Close',
    },
    actions: {
      back: 'Back',
      close: 'Close',
      save: 'Save',
      done: 'Mark as Completed',
      snooze: 'Snooze (15 mins)',
      testAudio: 'Test Audio & Voice',
      takeMedication: 'Take Medicine Now',
      completed: 'Completed',
      speakVoice: 'Listen to Voice Reminder',
      dueNow: 'Due now',
      inMinutes: 'in {m} min',
      inHoursMinutes: 'in {h}h {m}m',
      repeatEvery90Min: 'Repeats every 90 minutes',
      repeatEvery3Min: 'Repeats every 90 minutes',
    },
  },
  as: {
    appName: 'স্মৰণ (SMARAN)',
    appTagline: 'Remember. Relive. Reconnect.',
    greeting: 'নমস্কাৰ! আপোনাৰ আজিৰ শান্ত পথপ্ৰদৰ্শন।',
    tabs: {
      profile: 'প্ৰফাইল',
      home: 'মূলপৃষ্ঠা',
      rituals: 'দৈনিক যতন',
      palace: 'স্মৃতি মহল',
      album: 'আলোকচিত্ৰ',
      listen: 'সংগী',
    },
    dashboard: {
      urgentReminders: 'নিৰ্ধাৰিত দৈনিক যতন',
      morningMedicine: 'ৰাতিপুৱাৰ ঔষধ খাবলৈ সময়',
      medicineDesc: 'এগিলাচ কুহুমীয়া পানী আৰু তুলসী চাহৰ সৈতে',
      keepMindActive: 'মন সক্ৰিয় ৰাখক',
      motifMatch: 'সাংস্কৃতিক মোটিফ মিলোৱা',
      motifMatchDesc: 'তিনিটা খবৰ বাছি লওক: গঁড়, গামোচা, ঢোল।',
      memoryCards: 'সাংস্কৃতিক স্মৃতি কাৰ্ড',
      memoryCardsDesc: 'কাৰ্ড ওলোটাই অসম আৰু উত্তৰ-পূবৰ চিন মিলোৱা।',
      sequenceMemory: 'লয় আৰু সুৰ অনুসৰণ কৰক',
      sequenceMemoryDesc: 'পৰম্পৰাগত বিহু আৰু লোকসংগীতৰ লয় মনত পেলাওক।',
      familySupport: 'পৰিয়াল আৰু সমৰ্থন',
      callFamily: 'কন্যা অঞ্জলিলৈ ফোন কৰক',
      callFamilyDesc: 'মৰমৰ কথা পাতিবলৈ টেপ কৰক',
      voiceGuide: 'কণ্ঠ সহায়ক প্ৰস্তুত',
    },
    palace: {
      title: 'স্মৃতি মহল',
      subtitle: 'উত্তৰ-পূবৰ ঘৰুৱা প্ৰয়োজনীয় সামগ্ৰীৰ শান্ত কোঠা',
      keys: 'গামোচাত ককাৰ পিতলৰ চাবি',
      keysDesc: 'আলমাৰী আৰু গেটৰ চাবি ফুলাম গামোচাত সুৰক্ষিত।',
      medicine: 'ৰাতিপুৱাৰ বিপি আৰু চুগাৰৰ টেবলেট',
      medicineDesc: 'ৰাতিপুৱা ৮ বজাত কুহুমীয়া পানীৰে খাবলগা টেবলেট।',
      teaFlask: 'আদা চাহৰ ফ্লাস্ক আৰু পিতলৰ কাপ',
      teaFlaskDesc: 'উজনি অসমৰ বাগিচাৰ সতেজ সুবাসিত আদা চাহ।',
      pujaBell: 'পূজা কোঠাৰ পিতলৰ ঘণ্টা',
      pujaBellDesc: 'পুৱা-গধূলি প্ৰাৰ্থনা আৰু শান্ত ধ্যানৰ বাবে।',
      jaapi: 'মাজুলীৰ পৰম্পৰাগত বাঁহৰ জাপি',
      jaapiDesc: 'সন্মানৰ জাপি কোঠাৰ দেৱালত ওলোমাই থোৱা আছে।',
    },
    tutorial: {
      title: 'ফায়াৰফ্লাই AI লৈ স্বাগতম',
      welcome: 'জ্যেষ্ঠ নাগৰিক আৰু সেৱাকাৰীৰ বাবে বিশেষভাৱে নিৰ্মিত ভ্ৰমণ।',
      step1Title: '১. দৈনিক দিনচৰ্যা আৰু সোঁৱৰণি',
      step1Desc: 'ঔষধ, পানী আৰু কুশলবাৰ্তাৰ বাবে সহজ কণ্ঠ-সহায় প্ৰণালী।',
      step2Title: '২. ৩D স্মৃতি মহল (প্ৰয়োজনীয় বস্তু)',
      step2Desc: 'চাবি বা ঔষধ কেতিয়াও নেহেৰুৱাব! চাবি, চাহ আৰু টেবলেটৰ অৱস্থান চাওক।',
      step3Title: '৩. মনপৰশা ফটো এলবাম',
      step3Desc: 'মাজুলী, কাজিৰঙা আৰু বিহুৰ আনন্দময় ফটো উপভোগ কৰক।',
      step4Title: '৪. সংবেদনশীল AI সংগী',
      step4Desc: 'আপোনাৰ স্মৃতিৰ কথা কওক, সংগীয়ে আত্মীয়ৰ ফটো দেখুৱাব।',
      step5Title: '৫. কণ্ঠ আৰু ক্লিনিকেল বিশ্লেষণ',
      step5Desc: 'মাইক্ৰফোন টিপি কথা কওক। প্ৰফাইলত স্বাস্থ্যৰ অগ্ৰগতি চাওক।',
      close: 'বাদ দিয়ক',
      next: 'পৰৱৰ্তী',
      prev: 'পূৰ্বৱৰ্তী',
      finish: 'আৰম্ভ কৰক',
    },
    offline: {
      online: 'ক্লাউড সংযোগ সক্ৰিয়',
      offlineCache: 'অফলাইন প্ৰস্তুত',
      syncQueue: 'ইণ্টাৰনেট অবিহনে সকলো স্কোৰ আৰু স্মৃতি ডিভাইচত সুৰক্ষিত।',
      toggleSimulation: 'অফলাইন পৰীক্ষা কৰক',
    },
    bhashini: {
      badge: 'ভাষিণী উত্তৰ-পূব সক্ৰিয়',
      poweredBy: 'উত্তৰ-পূবৰ স্থানীয় উপভাষাৰ বাবে AI প্ৰযুক্তি',
    },
    settings: {
      title: 'ছেটিংছ আৰু ক্লিনিকেল প্ৰফাইল',
      patientProfile: 'ৰোগীৰ পৰিচয়',
      age: 'বয়স',
      protocol: 'উত্তৰ-পূব কেয়াৰ প্ৰট’কল',
      language: 'ভাষা আৰু উপভাষা',
      languageSubtitle: 'সমগ্ৰ এপ্লিকেচনৰ বাবে আপোনাৰ পচন্দৰ ভাষা নিৰ্বাচন কৰক।',
      telemetryTitle: 'সাপ্তাহিক স্মৃতি অগ্ৰগতি আৰু সূচক',
      telemetrySubtitle: 'মোটিফ আৰু ছিকুৱেন্স মেম’ৰীৰ ধাৰাবাহিক নিৰীক্ষণ।',
      clinicalReportTitle: 'ক্লিনিকেল ডিমেনচিয়া মূল্যায়ন প্ৰতিবেদন',
      clinicalReportSubtitle: 'চিকিৎসক আৰু পৰিয়ালৰ বাবে ডিমেনচিয়াৰ স্তৰ আৰু নিৰাপত্তাৰ পৰামৰ্শ।',
      generateReport: 'প্ৰতিবেদন প্ৰস্তুত কৰক',
      analyzingReport: 'তথ্য বিশ্লেষণ কৰি থকা হৈছে...',
      downloadDoc: 'মেডিকেল ডক (.doc)',
      downloadMd: 'মাৰ্কডাউন (.md)',
      regenerate: 'পুনৰ প্ৰস্তুত কৰক',
      reminderSettingsTitle: 'ঔষধ আৰু কাৰ্যসূচী সজাগতা',
      reminderSettingsSubtitle: 'নিয়মীয়া ব্যৱধানত ঔষধ আৰু স্মৃতি কোঠাৰ চিম বজাওক।',
      configure: 'সাজু কৰক',
      walkthroughTitle: 'এপ্লিকেচন পৰিচিতি ভ্ৰমণ',
      walkthroughSubtitle: 'ফায়াৰফ্লাই AI ৰ সহজ নিৰ্দেশনাসমূহ পুনৰ চাওক।',
      restartTour: 'ভ্ৰমণ আৰম্ভ কৰক',
      close: 'বন্ধ কৰক',
    },
    actions: {
      back: 'উভতি যাওক',
      close: 'বন্ধ কৰক',
      save: 'সংৰক্ষণ কৰক',
      done: 'সম্পূৰ্ণ হ’ল',
      snooze: '১৫ মিনিট পাছত',
      testAudio: 'ধ্বনি পৰীক্ষা কৰক',
      takeMedication: 'ঔষধ এতিয়াই খাওক',
      completed: 'সম্পূৰ্ণ হৈছে',
      speakVoice: 'কণ্ঠ নিৰ্দেশনা শুনক',
      dueNow: 'এতিয়াই সময় হৈছে',
      inMinutes: '{m} মিনিটৰ ভিতৰত',
      inHoursMinutes: '{h} ঘণ্টা {m} মিনিটত',
      repeatEvery90Min: 'প্ৰতি ৯০ মিনিটত বাজি উঠিব',
      repeatEvery3Min: 'প্ৰতি ৯০ মিনিটত বাজি উঠিব',
    },
  },
  brx: {
    appName: 'स्मरण (SMARAN)',
    appTagline: 'Remember. Relive. Reconnect.',
    greeting: 'खुलुमबाय! दिनैनि गोसोनि गाहाम लामा।',
    tabs: {
      profile: 'प्रफाइल',
      home: 'गाहाय',
      rituals: 'सानफ्रोमनि सिबिनाय',
      palace: 'गोसोखां न\'',
      album: 'फट\' एलबाम',
      listen: 'लोगो',
    },
    dashboard: {
      urgentReminders: 'सानफ्रोमनि गोनांथार खामानि',
      morningMedicine: 'फुंनि मुलि लोंनायनि सम',
      medicineDesc: 'दुंफुं दै आरो तुलसि साहाजों',
      keepMindActive: 'गोसोखौ साख्रिथाव लाखि',
      motifMatch: 'हारिमुनि मोखां सरजाब',
      motifMatchDesc: 'मोन ३ रोखोमनि रोखोमखौ सायख\': म\'र, आरोनाय, खाम।',
      memoryCards: 'हारिमुनि गोसोखांथि कार्ड',
      memoryCardsDesc: 'असम आरो सा-सानजानि निसानखौ मोखां खालाम।',
      sequenceMemory: 'दामनाय-बानाय सोलों',
      sequenceMemoryDesc: 'बिहु आरो हारिमुनि मेथाइनि सुरखौ गोसोखां।',
      familySupport: 'नखर आरो हेफाजाब',
      callFamily: 'फिसायजौ (अन्जलि) नो कल हर',
      callFamilyDesc: 'रायलायनो थु',
      voiceGuide: 'राव हेफाजाबगिरि थियारि',
    },
    palace: {
      title: 'गोसोखां न\'',
      subtitle: 'सा-सानजानि नखरनि गोनांथार बेसाद लाखिनाय जायगा',
      keys: 'आरोनाय सायाव थिनि साबि',
      keysDesc: 'दहना आरो गेटनि साबि गोजा सिमानि आरोनायाव लाखिनाय।',
      medicine: 'फुंनि बिपि आरो सुगारनि मुलि बाकसु',
      medicineDesc: 'फुंनि ८ बाजियाव दुंफुं दैजों लोंनांगौ।',
      teaFlask: 'असमनि हादुं साहा फ्लास्क आरो थिनि बाथि',
      teaFlaskDesc: 'सा-सानजा हाजोनि गोजाव साहा।',
      pujaBell: 'फुजा खथानि घन्टा',
      pujaBellDesc: 'फुं आरो बेलासिनि फुजा-आरज खालामनो।',
      jaapi: 'मजुलिनि बांनि जापि',
      jaapiDesc: 'मान होनाय जापि बेन्थियाव खोख्लैना लाखिनाय।',
    },
    tutorial: {
      title: 'फायरफ्लाइ AI आव बरायबाय',
      welcome: 'गिदिर मानसिनि थाखाय सुलु गोनां दिन्थिनाय।',
      step1Title: '१. सानफ्रोमनि नेम आरो गोसोखांथि',
      step1Desc: 'मुलि, दै आरो गाहाम थानो थाखाय राव हेफाजाब।',
      step2Title: '२. ३D गोसोखां न\'',
      step2Desc: 'साबि एबा मुलि गोमाबावनाय नङा! साबि, साहा बेयावनो दं।',
      step3Title: '३. नखरनि मोजां फट\'',
      step3Desc: 'मजुलि, काजिरङ्गा आरो बिहुनि रंजानाय फट\' नाय।',
      step4Title: '४. अनसुला AI लोगो',
      step4Desc: 'नोंथांनि साननायखौ खोनासंनो लोगो दं।',
      step5Title: '५. राव आरो डाक्टर रिपर्ट',
      step5Desc: 'माइकखौ थुनानै बुं। नोंथांनि गोसोनि थासारिखौ नाय।',
      close: 'नेरसोन',
      next: 'उननि',
      prev: 'सिगांनि',
      finish: 'जागाय',
    },
    offline: {
      online: 'क्लाउड दाजाबनाय दं',
      offlineCache: 'अमफलाइन थियारि',
      syncQueue: 'इन्टारनेट गैयाब्लाबो गासैबो गोसोखांथि लाखिबाय।',
      toggleSimulation: 'अमफलाइन आनजाद खालाम',
    },
    bhashini: {
      badge: 'भाषिणी सा-सानजा सख्रि',
      poweredBy: 'सा-सानजा रावफोरनि थाखाय AI गोहो',
    },
    settings: {
      title: 'फिसिनाय आरो क्लिनिक प्रफाइल',
      patientProfile: 'रगियारि सिनायथि',
      age: 'बैसो',
      protocol: 'सा-सानजा सेसा नेम',
      language: 'राव आरो ओनसोलारि राव',
      languageSubtitle: 'गासै एप्लिकेसननि थाखाय गावनि मोजां मोननाय रावखौ सायख\'।',
      telemetryTitle: 'दानफ्रोमनि गोसोनि थासारि',
      telemetrySubtitle: 'मोतिफ आरो गोसोखांथि आनजादनि खौरां।',
      clinicalReportTitle: 'क्लिनिक डिमेन्सिया रिपर्ट',
      clinicalReportSubtitle: 'डाक्टर आरो नखरनि थाखाय मोजां सुबुंथि।',
      generateReport: 'रिपर्ट दिहुन',
      analyzingReport: 'रिपर्ट बानायबाय दं...',
      downloadDoc: 'मेदिकेल दक (.doc)',
      downloadMd: 'मार्कदाउन (.md)',
      regenerate: 'फिन बानाय',
      reminderSettingsTitle: 'मुलि आरो खामानि सोंनाय',
      reminderSettingsSubtitle: 'सम सम घन्टा देग्लाना मुलि लोंनो गोसोखां।',
      configure: 'साजाय न\'',
      walkthroughTitle: 'एप्लिकेशन दिन्थिनाय',
      walkthroughSubtitle: 'फायरफ्लाइ AI नि मोजां लामाखौ फिन नाय।',
      restartTour: 'जागायफिन',
      close: 'बन्द खालाम',
    },
    actions: {
      back: 'फैफिन',
      close: 'बन्द',
      save: 'लाखि',
      done: 'जाबाय',
      snooze: '१५ मिनिट उनाव',
      testAudio: 'सोदोब आनजाद',
      takeMedication: 'दानो मुलि लों',
      completed: 'जाखांबाय',
      speakVoice: 'राव खोनासं',
      dueNow: 'दानो जाबाय',
      inMinutes: '{m} मिनिट उनाव',
      inHoursMinutes: '{h} घन्टा {m} मिनिट उनाव',
      repeatEvery90Min: 'सानफ्रोमबो ९० मिनिट उनाव',
      repeatEvery3Min: 'सानफ्रोमबो ९० मिनिट उनाव',
    },
  },
  mni: {
    appName: 'স্মৰণ (SMARAN)',
    appTagline: 'Remember. Relive. Reconnect.',
    greeting: 'খোৰুমজরি! অদোমগী নুমিৎ খুদিংগী নুংশিরবা লম্বীজিংবা।',
    tabs: {
      profile: 'প্রোফাইল',
      home: 'য়ুমফম',
      rituals: 'নোংমগী থবক',
      palace: 'নিংশিং কোল',
      album: 'ফটো এলবাম',
      listen: 'মরুপ',
    },
    dashboard: {
      urgentReminders: 'লেপ্নরবা নোংমগী সেবা',
      morningMedicine: 'অয়ুক্কী হিদাক চাবগী মতম',
      medicineDesc: 'ঈশিং অশাবা অমসুং তুলসী চা গা লোয়ননা',
      keepMindActive: 'ৱাখলবু থৱায় পানহনলু',
      motifMatch: 'হেরিটেজ মোটিফ চান্নহনবা',
      motifMatchDesc: 'পোৎশক ৩ তান্নহল্লু: সামু, গামোসা, পুং।',
      memoryCards: 'নিংশিং কাৰ্ড চান্নহনবা',
      memoryCardsDesc: 'কাৰ্ড ওন্থোক্তুনা অৱাং-নোংপোক্কী খুদমশিং নিংশিংলু।',
      sequenceMemory: 'সুৰ অমসুং শৈরাংগী মতুং ইনবা',
      sequenceMemoryDesc: 'বিহু অমসুং ঈশৈগী খোন্থোক নিংশিংলু।',
      familySupport: 'ইমুং অমসুং তেংবাং',
      callFamily: 'ইচানুপী (অঞ্জলি) দা ফোন তৌরো',
      callFamilyDesc: 'ৱারি শানবা ক্লিক তৌরো',
      voiceGuide: 'খোন্থোক্কী মতেং শেমরে',
    },
    palace: {
      title: 'নিংশিং কোল',
      subtitle: 'অৱাং-নোংপোক্কী খুৎশু-খুৎলায়শিং থম্বগী নিংথিরবা কা',
      keys: 'গামোচাদা থম্বা পিথ্ৰাইগী চোবী',
      keysDesc: 'থোং অমসুং আলমিরাগী চাবি গামোচাদা নিংথিনা থম্লি।',
      medicine: 'অয়ুক্কী বিপি অমসুং সুগার হিদাক্কী বাক্স',
      medicineDesc: 'অয়ুক্কী পুং ৮ দা ঈশিং অশাবগা লোয়ননা চাগদবা।',
      teaFlask: 'আসাম চাগী থাৰ্মাস অমসুং পিথ্ৰাই খোংহাম',
      teaFlaskDesc: 'অৱাং-নোংপোক্কী অচুম্বা আদা চা।',
      pujaBell: 'পূজাগী পিথ্ৰাই খোঙলৌ',
      pujaBellDesc: 'অয়ুক অমসুং নুমিদাংগী লাইনীং থৌরমগীদমক।',
      jaapi: 'ৱাগী শাবা জাপি',
      jaapiDesc: 'ইকায় খুম্নরবা জাপি কাদা য়াৎতুনা থম্লি।',
    },
    tutorial: {
      title: 'ফায়ারফ্লাই AI দা তরাম্না ওকচরি',
      welcome: 'অহলশিংগীদমক অয়ুক নুমিদাংগী কোমথোক্লবা লম্বী।',
      step1Title: '১. নুমিৎ খুদিংগী হিদাক অমসুং নিংশিংবা',
      step1Desc: 'হিদাক চাবা অমসুং ঈশিং থকপগী খোন্থোক্কী মতেং।',
      step2Title: '২. ৩D নিংশিং কোল (মরুওইবা পোৎলম)',
      step2Desc: 'চাবী নত্রগা হিদাক মাংবা য়াদে! মফম অসিদা য়েংবীয়ু।',
      step3Title: '৩. নুংশিরবা ইমুংগী ফটো',
      step3Desc: 'মাজুলী অমসুং কাজিরঙ্গাগী নিংথিরবা ফটোশিং য়েংবীয়ু।',
      step4Title: '৪. অপেনবা AI মরুপ',
      step4Desc: 'অদোমগী পুন্সিগী ৱারি শানবা য়ারবা মরুপ।',
      step5Title: '৫. খোন্থোক অমসুং লাইয়েংগী চাংচৎ',
      step5Desc: 'মাইক নম্বীয়ু অমসুং ঙাংবীয়ু। হকশেলগী চাং য়েংবীয়ু।',
      close: 'তোথোক্লু',
      next: 'মখা তাবা',
      prev: 'হন্নবা',
      finish: 'হৌরো',
    },
    offline: {
      online: 'ক্লাউদ শম্নরে',
      offlineCache: 'অফলাইন শেমরে',
      syncQueue: 'ইণ্টাৰনেট য়াওদনা পোৎলম পুম্নমক শাফনা লৈরে।',
      toggleSimulation: 'অফলাইন চাংয়েং',
    },
    bhashini: {
      badge: 'ভাষিনী নোংপোক সক্ৰিয়',
      poweredBy: 'অৱাং-নোংপোক্কী লোলশিংগীদমক AI খোন্থোক',
    },
    settings: {
      title: 'সেটিং অমসুং প্রোফাইল',
      patientProfile: 'অনাবগী প্রোফাইল',
      age: 'চহি',
      protocol: 'অৱাং-নোংপোক্কী সেবা কাংলোন',
      language: 'লোল অমসুং লমদমগী খোন্থোক',
      languageSubtitle: 'এপ্প পুম্নমক্কীদমক অদোমগী পামজবা লোল খনবীযু।',
      telemetryTitle: 'চয়োলগী ৱাখলগী ফিভম',
      telemetrySubtitle: 'মোতিফ অমসুং নিংশিংবগী চাং য়েংশিনবা।',
      clinicalReportTitle: 'ক্লিনিকেল ডিমেনসিয়া রিপোৰ্ট',
      clinicalReportSubtitle: 'দাক্তর অমসুং ইমুংগীদমক লাইয়েংগী পাউতাক।',
      generateReport: 'রিপোৰ্ট শেম্মু',
      analyzingReport: 'ৱাখলগী ফিভম চাংয়েং তৌরি...',
      downloadDoc: 'মেডিকেল ডক (.doc)',
      downloadMd: 'মার্কদাউন (.md)',
      regenerate: 'অমুক হন্না শেম্মু',
      reminderSettingsTitle: 'হিদাক অমসুং সেবা নিংশিংবা',
      reminderSettingsSubtitle: 'ঘণ্টা ঘণ্টাগী মতুংদা হিদাক চাগদবা নিংশিংহল্লু।',
      configure: 'শেমজিনবা',
      walkthroughTitle: 'এপ্লিকেসন য়েংশিনবা',
      walkthroughSubtitle: 'ফায়ারফ্লাই AI গী লম্বীজিং অমুক হন্না য়েংবীয়ু।',
      restartTour: 'অমুক হন্না হৌরো',
      close: 'থিংজিনলু',
    },
    actions: {
      back: 'হল্লকপা',
      close: 'থিংজিনবা',
      save: 'থমজিনবা',
      done: 'লোইরে',
      snooze: 'মিনিট ১৫ গী তুংদা',
      testAudio: 'খোন্থোক য়েংবা',
      takeMedication: 'হৌজিক হিদাক চাউ',
      completed: 'লোইশিনখ্রে',
      speakVoice: 'খোন্থোক তাবীয়ু',
      dueNow: 'হৌজিক মতম ওইরে',
      inMinutes: 'মিনিট {m} গী মনুংদা',
      inHoursMinutes: 'পুং {h} মিনিট {m} গী মনুংদা',
      repeatEvery90Min: 'মিনিট ৯০ খুদিংগী অমুক হন্না',
      repeatEvery3Min: 'মিনিট ৯০ খুদিংগী অমুক হন্না',
    },
  },
  hi: {
    appName: 'स्मरण (SMARAN)',
    appTagline: 'Remember. Relive. Reconnect.',
    greeting: 'नमस्कार! आपका आज का शांत दैनिक मार्गदर्शक।',
    tabs: {
      profile: 'प्रोफाइल',
      home: 'मुख्य',
      rituals: 'दैनिक देखभाल',
      palace: 'स्मृति महल',
      album: 'तस्वीरें',
      listen: 'साथी',
    },
    dashboard: {
      urgentReminders: 'दैनिक आवश्यक देखभाल',
      morningMedicine: 'सुबह की दवा लेने का समय',
      medicineDesc: 'गुनगुने पानी और तुलसी की चाय के साथ लें',
      keepMindActive: 'मन को सक्रिय और शांत रखें',
      motifMatch: 'सांस्कृतिक प्रतीक मिलान',
      motifMatchDesc: 'तीन समान प्रतीक चुनें: गैंडा, गमोसा, ढोल।',
      memoryCards: 'सांस्कृतिक स्मृति कार्ड',
      memoryCardsDesc: 'कार्ड पलटकर असम और पूर्वोत्तर के प्रतीक याद रखें।',
      sequenceMemory: 'लय और संगीत का अनुसरण',
      sequenceMemoryDesc: 'पारंपरिक बिहू और लोक धुनों को याद रखें।',
      familySupport: 'परिवार और सहारा',
      callFamily: 'बेटी (अंजलि) को कॉल करें',
      callFamilyDesc: 'प्यार से बात करने के लिए टैप करें',
      voiceGuide: 'आवाज़ सहायक तैयार है',
    },
    palace: {
      title: 'स्मृति महल',
      subtitle: 'घर की आवश्यक वस्तुओं के लिए आपका शांत 3D कमरा',
      keys: 'गमोसा पर रखी पीतल की चाबियां',
      keysDesc: 'अलमारी और मुख्य द्वार की चाबियां सुरक्षित रखी हैं।',
      medicine: 'सुबह की दवा का डिब्बा',
      medicineDesc: 'सुबह 8 बजे गुनगुने पानी के साथ दो गोलियां लें।',
      teaFlask: 'असम अदरक वाली चाय की केतली',
      teaFlaskDesc: 'ऊपरी असम के बागानों की ताज़ा सुगंधित अदरक वाली चाय।',
      pujaBell: 'पूजा कक्ष की पीतल की घंटी',
      pujaBellDesc: 'सुबह और शाम की पूजा-अर्चना और शांति के लिए।',
      jaapi: 'पारंपरिक बांस की जापी',
      jaapiDesc: 'सम्मान की जापी दीवार पर सजी हुई है।',
    },
    tutorial: {
      title: 'फायरफ्लाई AI में आपका स्वागत है',
      welcome: 'बुजुर्गों और देखभालकर्ताओं के लिए एक सरल और सहज यात्रा।',
      step1Title: '१. दैनिक दिनचर्या और याद दिलाने वाले संकेत',
      step1Desc: 'दवा, पानी और स्वास्थ्य के लिए बड़ी लिखावट और आवाज़ वाले संकेत।',
      step2Title: '२. 3D स्मृति महल (आवश्यक वस्तुएं)',
      step2Desc: 'चाबी या दवा कभी न भूलें! 3D कमरे में चाबी और दवा देखें।',
      step3Title: '३. प्यारी पारिवारिक तस्वीरें',
      step3Desc: 'माजुली, काजीरंगा और बिहू के सुंदर पलों को याद करें।',
      step4Title: '४. स्नेही AI साथी',
      step4Desc: 'अपनी यादें साझा करें, साथी पुरानी तस्वीरें दिखाएगा।',
      step5Title: '५. आवाज़ और चिकित्सकीय रिपोर्ट',
      step5Desc: 'माइक दबाकर बोलें। प्रोफाइल में स्वास्थ्य प्रगति देखें।',
      close: 'छोड़ें',
      next: 'अगला',
      prev: 'पिछला',
      finish: 'आरंभ करें',
    },
    offline: {
      online: 'क्लाउड सिंक चालू है',
      offlineCache: 'ऑफलाइन तैयार',
      syncQueue: 'बिना इंटरनेट के भी आपकी यादें और स्कोर पूरी तरह सुरक्षित हैं।',
      toggleSimulation: 'ऑफलाइन मोड आज़माएं',
    },
    bhashini: {
      badge: 'भाषिणी पूर्वोत्तर सक्रिय',
      poweredBy: 'पूर्वोत्तर की स्थानीय बोलियों के लिए AI तकनीक',
    },
    settings: {
      title: 'सेटिंग्स और स्वास्थ्य प्रोफाइल',
      patientProfile: 'मरीज़ की जानकारी',
      age: 'उम्र',
      protocol: 'पूर्वोत्तर देखभाल प्रोटोकॉल',
      language: 'भाषा और स्थानीय बोली',
      languageSubtitle: 'पूरी ऐप के लिए अपनी पसंदीदा भाषा चुनें।',
      telemetryTitle: 'साप्ताहिक स्मृति और संज्ञानात्मक प्रगति',
      telemetrySubtitle: 'पैटर्न मिलान और स्मृति का निरंतर विश्लेषण।',
      clinicalReportTitle: 'चिकित्सकीय मनोभ्रंश मूल्यांकन रिपोर्ट',
      clinicalReportSubtitle: 'डॉक्टर और परिवार के लिए मनोभ्रंश चरण और देखभाल के सुझाव।',
      generateReport: 'रिपोर्ट तैयार करें',
      analyzingReport: 'जानकारी का विश्लेषण हो रहा है...',
      downloadDoc: 'मेडिकल डॉक (.doc)',
      downloadMd: 'मार्कडाउन (.md)',
      regenerate: 'पुनः तैयार करें',
      reminderSettingsTitle: 'दवा और गतिविधि सूचनाएं',
      reminderSettingsSubtitle: 'हर 90 मिनट में दवा और स्मृति महल की याद दिलाएं।',
      configure: 'व्यवस्था करें',
      walkthroughTitle: 'मार्गदर्शन भ्रमण',
      walkthroughSubtitle: 'फायरफ्लाई AI के उपयोग के सरल चरण फिर से देखें।',
      restartTour: 'भ्रमण शुरू करें',
      close: 'बंद करें',
    },
    actions: {
      back: 'वापस',
      close: 'बंद करें',
      save: 'सहेजें',
      done: 'पूरा हुआ',
      snooze: '15 मिनट बाद',
      testAudio: 'आवाज़ जांचें',
      takeMedication: 'दवा अभी लें',
      completed: 'पूर्ण हुआ',
      speakVoice: 'आवाज़ में निर्देश सुनें',
      dueNow: 'अभी समय हो गया है',
      inMinutes: '{m} मिनट में',
      inHoursMinutes: '{h} घंटे {m} मिनट में',
      repeatEvery90Min: 'हर 90 मिनट में दोहराएं',
      repeatEvery3Min: 'हर 90 मिनट में दोहराएं',
    },
  },
};

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    ...BASE_TRANSLATIONS.en,
    title: BASE_TRANSLATIONS.en.appName,
    tagline: BASE_TRANSLATIONS.en.appTagline,
    offlineMode: BASE_TRANSLATIONS.en.offline.offlineCache,
    onlineMode: BASE_TRANSLATIONS.en.offline.online,
    quickTour: 'App Tour',
    offlineBannerTitle: 'Offline Mode Active',
    offlineBannerDesc: 'All scores and voice reminders are operating locally on your device with Zero-Cloud latency.',
    reminders: BASE_TRANSLATIONS.en.dashboard.urgentReminders,
    takeMedicine: BASE_TRANSLATIONS.en.dashboard.morningMedicine,
    takeMedicineSub: BASE_TRANSLATIONS.en.dashboard.medicineDesc,
    cognitiveGames: BASE_TRANSLATIONS.en.dashboard.keepMindActive,
    matchMotifs: BASE_TRANSLATIONS.en.dashboard.motifMatch,
    matchMotifsDesc: BASE_TRANSLATIONS.en.dashboard.motifMatchDesc,
    memoryCards: BASE_TRANSLATIONS.en.dashboard.memoryCards,
    memoryCardsDesc: BASE_TRANSLATIONS.en.dashboard.memoryCardsDesc,
    sequenceMemory: BASE_TRANSLATIONS.en.dashboard.sequenceMemory,
    sequenceMemoryDesc: BASE_TRANSLATIONS.en.dashboard.sequenceMemoryDesc,
    familySupport: BASE_TRANSLATIONS.en.dashboard.familySupport,
    callFamily: BASE_TRANSLATIONS.en.dashboard.callFamily,
    callFamilySub: BASE_TRANSLATIONS.en.dashboard.callFamilyDesc,
    palace: {
      ...BASE_TRANSLATIONS.en.palace,
      saveMemory: 'Save to Memory Palace',
    },
    album: {
      title: 'Cherished Family Album',
      empty: 'No Memories Added Yet',
      emptyDesc: 'Photos of family, festivals, and sacred travels will appear here.',
      page: 'Page',
      addMemory: 'Add Photo Memory',
      recordVoice: 'Record Voice Note',
      stopRecording: 'Stop Recording',
      playVoice: 'Play Voice Note',
    },
    therapist: {
      title: 'Gentle AI Companion',
      subtitle: 'Speaks with warmth and patience in North Eastern dialects',
      typePlaceholder: 'Speak or type a thought...',
      voiceGuide: 'Listening with compassion...',
    },
    voiceAI: {
      title: 'Voice Assistant',
      promptPlaceholder: 'Speak clearly into the microphone...',
    },
  },
  as: {
    ...BASE_TRANSLATIONS.as,
    title: BASE_TRANSLATIONS.as.appName,
    tagline: BASE_TRANSLATIONS.as.appTagline,
    offlineMode: BASE_TRANSLATIONS.as.offline.offlineCache,
    onlineMode: BASE_TRANSLATIONS.as.offline.online,
    quickTour: 'সহজ নিৰ্দেশনা',
    offlineBannerTitle: 'অফলাইন মোড সক্ৰিয়',
    offlineBannerDesc: 'সকলো স্কোৰ আৰু কণ্ঠ নিৰ্দেশনা আপোনাৰ ডিভাইচত ক্লাউড অবিহনে চলি আছে।',
    reminders: BASE_TRANSLATIONS.as.dashboard.urgentReminders,
    takeMedicine: BASE_TRANSLATIONS.as.dashboard.morningMedicine,
    takeMedicineSub: BASE_TRANSLATIONS.as.dashboard.medicineDesc,
    cognitiveGames: BASE_TRANSLATIONS.as.dashboard.keepMindActive,
    matchMotifs: BASE_TRANSLATIONS.as.dashboard.motifMatch,
    matchMotifsDesc: BASE_TRANSLATIONS.as.dashboard.motifMatchDesc,
    memoryCards: BASE_TRANSLATIONS.as.dashboard.memoryCards,
    memoryCardsDesc: BASE_TRANSLATIONS.as.dashboard.memoryCardsDesc,
    sequenceMemory: BASE_TRANSLATIONS.as.dashboard.sequenceMemory,
    sequenceMemoryDesc: BASE_TRANSLATIONS.as.dashboard.sequenceMemoryDesc,
    familySupport: BASE_TRANSLATIONS.as.dashboard.familySupport,
    callFamily: BASE_TRANSLATIONS.as.dashboard.callFamily,
    callFamilySub: BASE_TRANSLATIONS.as.dashboard.callFamilyDesc,
    palace: {
      ...BASE_TRANSLATIONS.as.palace,
      saveMemory: 'স্মৃতি মহলত সংৰক্ষণ কৰক',
    },
    album: {
      title: 'মনপৰশা পৰিয়ালৰ এলবাম',
      empty: 'এতিয়ালৈকে কোনো স্মৃতি নাই',
      emptyDesc: 'মাজুলী, কাজিৰঙা আৰু পৰিয়ালৰ মৰমৰ ফটোসমূহ ইয়াত থাকিব।',
      page: 'পৃষ্ঠা',
      addMemory: 'ফটো স্মৃতি যোগ কৰক',
      recordVoice: 'কণ্ঠ বাৰ্তা ৰেকৰ্ড কৰক',
      stopRecording: 'ৰেকৰ্ডিং বন্ধ কৰক',
      playVoice: 'কণ্ঠ শুনক',
    },
    therapist: {
      title: 'মৰমীয়াল AI সংগী',
      subtitle: 'অসম আৰু উত্তৰ-পূবৰ উপভাষাত শান্তভাৱে কথা পাতে',
      typePlaceholder: 'মনৰ কথা কওক বা লিখক...',
      voiceGuide: 'সহানুভূতিৰে শুনি আছো...',
    },
    voiceAI: {
      title: 'কণ্ঠ সহায়ক',
      promptPlaceholder: 'মাইক্ৰফোনত স্পষ্টকৈ কওক...',
    },
  },
  brx: {
    ...BASE_TRANSLATIONS.brx,
    title: BASE_TRANSLATIONS.brx.appName,
    tagline: BASE_TRANSLATIONS.brx.appTagline,
    offlineMode: BASE_TRANSLATIONS.brx.offline.offlineCache,
    onlineMode: BASE_TRANSLATIONS.brx.offline.online,
    quickTour: 'लामा दिन्थिनाय',
    offlineBannerTitle: 'अमफलाइन थासारि सोलिदों',
    offlineBannerDesc: 'गासैबो मुलि लोंनाय आरो गोसोखांथि नोंथांनि मबाइलानो सुबिदा गोनां जाबाय।',
    reminders: BASE_TRANSLATIONS.brx.dashboard.urgentReminders,
    takeMedicine: BASE_TRANSLATIONS.brx.dashboard.morningMedicine,
    takeMedicineSub: BASE_TRANSLATIONS.brx.dashboard.medicineDesc,
    cognitiveGames: BASE_TRANSLATIONS.brx.dashboard.keepMindActive,
    matchMotifs: BASE_TRANSLATIONS.brx.dashboard.motifMatch,
    matchMotifsDesc: BASE_TRANSLATIONS.brx.dashboard.motifMatchDesc,
    memoryCards: BASE_TRANSLATIONS.brx.dashboard.memoryCards,
    memoryCardsDesc: BASE_TRANSLATIONS.brx.dashboard.memoryCardsDesc,
    sequenceMemory: BASE_TRANSLATIONS.brx.dashboard.sequenceMemory,
    sequenceMemoryDesc: BASE_TRANSLATIONS.brx.dashboard.sequenceMemoryDesc,
    familySupport: BASE_TRANSLATIONS.brx.dashboard.familySupport,
    callFamily: BASE_TRANSLATIONS.brx.dashboard.callFamily,
    callFamilySub: BASE_TRANSLATIONS.brx.dashboard.callFamilyDesc,
    palace: {
      ...BASE_TRANSLATIONS.brx.palace,
      saveMemory: 'गोसोखां न\'आव लाखि',
    },
    album: {
      title: 'नखरनि मोजां एलबाम',
      empty: 'दानो जेबो फट\' गैया',
      emptyDesc: 'नखर आरो रंजानायनि मोजां मोजां फट\'फोर बेयाव थागोन।',
      page: 'बिलाइ',
      addMemory: 'गोसोखां फट\' बानाय',
      recordVoice: 'राव रेकर्ड खालाम',
      stopRecording: 'रेकर्ड बन्द',
      playVoice: 'राव खोनासं',
    },
    therapist: {
      title: 'अनसुला AI लोगो',
      subtitle: 'सा-सानजानि रावजों मोजाङै खोनासंङो',
      typePlaceholder: 'गोसोनि बाथ्रा बुं एबा लिर...',
      voiceGuide: 'खोनासंबाय दं...',
    },
    voiceAI: {
      title: 'राव हेफाजाबगिरि',
      promptPlaceholder: 'माइकआव मोजाङै बुं...',
    },
  },
  mni: {
    ...BASE_TRANSLATIONS.mni,
    title: BASE_TRANSLATIONS.mni.appName,
    tagline: BASE_TRANSLATIONS.mni.appTagline,
    offlineMode: BASE_TRANSLATIONS.mni.offline.offlineCache,
    onlineMode: BASE_TRANSLATIONS.mni.offline.online,
    quickTour: 'লম্বীজিংবা',
    offlineBannerTitle: 'অফলাইন ফিভম শেমরে',
    offlineBannerDesc: 'হিদাক চাবা অমসুং খোন্থোক্কী ৱাফম পুম্নমক ইন্টাৰনেট য়াওদনা চৎলি।',
    reminders: BASE_TRANSLATIONS.mni.dashboard.urgentReminders,
    takeMedicine: BASE_TRANSLATIONS.mni.dashboard.morningMedicine,
    takeMedicineSub: BASE_TRANSLATIONS.mni.dashboard.medicineDesc,
    cognitiveGames: BASE_TRANSLATIONS.mni.dashboard.keepMindActive,
    matchMotifs: BASE_TRANSLATIONS.mni.dashboard.motifMatch,
    matchMotifsDesc: BASE_TRANSLATIONS.mni.dashboard.motifMatchDesc,
    memoryCards: BASE_TRANSLATIONS.mni.dashboard.memoryCards,
    memoryCardsDesc: BASE_TRANSLATIONS.mni.dashboard.memoryCardsDesc,
    sequenceMemory: BASE_TRANSLATIONS.mni.dashboard.sequenceMemory,
    sequenceMemoryDesc: BASE_TRANSLATIONS.mni.dashboard.sequenceMemoryDesc,
    familySupport: BASE_TRANSLATIONS.mni.dashboard.familySupport,
    callFamily: BASE_TRANSLATIONS.mni.dashboard.callFamily,
    callFamilySub: BASE_TRANSLATIONS.mni.dashboard.callFamilyDesc,
    palace: {
      ...BASE_TRANSLATIONS.mni.palace,
      saveMemory: 'নিংশিং কোলদা থমজিনলু',
    },
    album: {
      title: 'নুংশিরবা ইমুংগী এলবাম',
      empty: 'হৌজিক ফাওবা নিংশিংবা অমত্তা লৈত্রি',
      emptyDesc: 'ইমুং অমসুং হরাও-তয়াম্বগী ফটোশিং অসিদা লৈগনি।',
      page: 'লামায়',
      addMemory: 'ফটো নিংশিংবা হাপচিল্লু',
      recordVoice: 'খোন্থোক রেকোৰ্ড তৌরো',
      stopRecording: 'খোন্থোক থিংজিনলু',
      playVoice: 'খোন্থোক তাবীয়ু',
    },
    therapist: {
      title: 'নুংশিরবা AI মরুপ',
      subtitle: 'অৱাং-নোংপোক্কী লোলদা কোমথোক্না ৱারি শারি',
      typePlaceholder: 'ৱাখলগী ৱাফম নম্বীয়ু নত্রগা ঙাংবীয়ু...',
      voiceGuide: 'নুংশিনা তারি...',
    },
    voiceAI: {
      title: 'খোন্থোক্কী মতেংপাংবা',
      promptPlaceholder: 'মাইক নম্বীয়ু অমসুং শেংনা ঙাংবীয়ু...',
    },
  },
  hi: {
    ...BASE_TRANSLATIONS.hi,
    title: BASE_TRANSLATIONS.hi.appName,
    tagline: BASE_TRANSLATIONS.hi.appTagline,
    offlineMode: BASE_TRANSLATIONS.hi.offline.offlineCache,
    onlineMode: BASE_TRANSLATIONS.hi.offline.online,
    quickTour: 'सरल भ्रमण',
    offlineBannerTitle: 'ऑफलाइन मोड सक्रिय',
    offlineBannerDesc: 'सभी स्कोर और आवाज़ वाले संकेत बिना इंटरनेट के आपके फोन में सुरक्षित काम कर रहे हैं।',
    reminders: BASE_TRANSLATIONS.hi.dashboard.urgentReminders,
    takeMedicine: BASE_TRANSLATIONS.hi.dashboard.morningMedicine,
    takeMedicineSub: BASE_TRANSLATIONS.hi.dashboard.medicineDesc,
    cognitiveGames: BASE_TRANSLATIONS.hi.dashboard.keepMindActive,
    matchMotifs: BASE_TRANSLATIONS.hi.dashboard.motifMatch,
    matchMotifsDesc: BASE_TRANSLATIONS.hi.dashboard.motifMatchDesc,
    memoryCards: BASE_TRANSLATIONS.hi.dashboard.memoryCards,
    memoryCardsDesc: BASE_TRANSLATIONS.hi.dashboard.memoryCardsDesc,
    sequenceMemory: BASE_TRANSLATIONS.hi.dashboard.sequenceMemory,
    sequenceMemoryDesc: BASE_TRANSLATIONS.hi.dashboard.sequenceMemoryDesc,
    familySupport: BASE_TRANSLATIONS.hi.dashboard.familySupport,
    callFamily: BASE_TRANSLATIONS.hi.dashboard.callFamily,
    callFamilySub: BASE_TRANSLATIONS.hi.dashboard.callFamilyDesc,
    palace: {
      ...BASE_TRANSLATIONS.hi.palace,
      saveMemory: 'स्मृति महल में सहेजें',
    },
    album: {
      title: 'प्यारा पारिवारिक एलबम',
      empty: 'अभी कोई यादें नहीं जुड़ी हैं',
      emptyDesc: 'परिवार, त्योहारों और यात्राओं की अनमोल तस्वीरें यहाँ दिखाई देंगी।',
      page: 'पृष्ठ',
      addMemory: 'तस्वीर याद जोड़ें',
      recordVoice: 'आवाज़ रिकॉर्ड करें',
      stopRecording: 'रिकॉर्डिंग रोकें',
      playVoice: 'आवाज़ सुनें',
    },
    therapist: {
      title: 'स्नेही AI साथी',
      subtitle: 'पूर्वोत्तर की बोलियों में धैर्य और प्यार से बात करता है',
      typePlaceholder: 'अपने दिल की बात कहें या लिखें...',
      voiceGuide: 'सहानुभूति से सुन रहा हूँ...',
    },
    voiceAI: {
      title: 'आवाज़ सहायक',
      promptPlaceholder: 'माइक में स्पष्ट रूप से बोलें...',
    },
  },
};

export const translations = TRANSLATIONS;
