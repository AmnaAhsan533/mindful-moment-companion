import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ur";

interface Translations {
  // Header
  home: string;
  dashboard: string;
  carePlan: string;
  sessions: string;
  signIn: string;
  signOut: string;
  getStarted: string;
  
  // Crisis Resources
  crisisResources: string;
  crisisDescription: string;
  crisisDisclaimer: string;
  call: string;
  whatsApp: string;
  
  // Crisis resource names and descriptions
  umangName: string;
  umangDesc: string;
  taskeenName: string;
  taskeenDesc: string;
  rozanName: string;
  rozanDesc: string;
  pakistanHelplineName: string;
  pakistanHelplineDesc: string;
  
  // Mood Check-in
  howAreYouFeeling: string;
  addNote: string;
  logMood: string;
  moodLogged: string;
  moodLoggedDesc: string;
  
  // Mood labels
  moodAwful: string;
  moodBad: string;
  moodOkay: string;
  moodGood: string;
  moodGreat: string;
  
  // General
  loading: string;
  save: string;
  cancel: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    home: "Home",
    dashboard: "Dashboard",
    carePlan: "Care Plan",
    sessions: "Sessions",
    signIn: "Sign In",
    signOut: "Sign Out",
    getStarted: "Get Started",
    
    // Crisis Resources
    crisisResources: "Crisis Resources",
    crisisDescription: "If you're in crisis or need immediate support, help is available 24/7.",
    crisisDisclaimer: "Remember: This app supports your wellness journey but is not a replacement for professional care. Always reach out to a mental health professional or emergency services if you're in crisis.",
    call: "Call",
    whatsApp: "WhatsApp",
    
    // Crisis resource names and descriptions
    umangName: "Umang Helpline",
    umangDesc: "Mental health support and counseling services",
    taskeenName: "Taskeen",
    taskeenDesc: "Free mental health support via WhatsApp",
    rozanName: "Rozan Counseling",
    rozanDesc: "Trauma, abuse, and emotional support services",
    pakistanHelplineName: "Pakistan Mental Health Helpline",
    pakistanHelplineDesc: "24/7 toll-free mental health support",
    
    // Mood Check-in
    howAreYouFeeling: "How are you feeling today?",
    addNote: "Add a note about how you're feeling (optional)",
    logMood: "Log Mood",
    moodLogged: "Mood logged!",
    moodLoggedDesc: "Your mood has been recorded.",
    
    // Mood labels
    moodAwful: "Awful",
    moodBad: "Bad",
    moodOkay: "Okay",
    moodGood: "Good",
    moodGreat: "Great",
    
    // General
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
  },
  ur: {
    // Header
    home: "ہوم",
    dashboard: "ڈیش بورڈ",
    carePlan: "نگہداشت منصوبہ",
    sessions: "سیشنز",
    signIn: "سائن ان",
    signOut: "سائن آؤٹ",
    getStarted: "شروع کریں",
    
    // Crisis Resources
    crisisResources: "ہنگامی وسائل",
    crisisDescription: "اگر آپ کو فوری مدد کی ضرورت ہے، تو 24/7 مدد دستیاب ہے۔",
    crisisDisclaimer: "یاد رکھیں: یہ ایپ آپ کی ذہنی صحت کے سفر میں مدد کرتی ہے لیکن پیشہ ورانہ دیکھ بھال کا متبادل نہیں ہے۔",
    call: "کال کریں",
    whatsApp: "واٹس ایپ",
    
    // Crisis resource names and descriptions
    umangName: "امنگ ہیلپ لائن",
    umangDesc: "ذہنی صحت کی مدد اور مشاورت کی خدمات",
    taskeenName: "تسکین",
    taskeenDesc: "واٹس ایپ کے ذریعے مفت ذہنی صحت کی مدد",
    rozanName: "روزن کاؤنسلنگ",
    rozanDesc: "صدمے، بدسلوکی، اور جذباتی مدد کی خدمات",
    pakistanHelplineName: "پاکستان ذہنی صحت ہیلپ لائن",
    pakistanHelplineDesc: "24/7 مفت ذہنی صحت کی مدد",
    
    // Mood Check-in
    howAreYouFeeling: "آج آپ کیسا محسوس کر رہے ہیں؟",
    addNote: "اپنے احساسات کے بارے میں نوٹ لکھیں (اختیاری)",
    logMood: "موڈ ریکارڈ کریں",
    moodLogged: "موڈ ریکارڈ ہو گیا!",
    moodLoggedDesc: "آپ کا موڈ ریکارڈ کر لیا گیا ہے۔",
    
    // Mood labels
    moodAwful: "بہت برا",
    moodBad: "برا",
    moodOkay: "ٹھیک",
    moodGood: "اچھا",
    moodGreat: "بہترین",
    
    // General
    loading: "لوڈ ہو رہا ہے...",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred-language");
    return (saved === "ur" ? "ur" : "en") as Language;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    isRTL: language === "ur",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
