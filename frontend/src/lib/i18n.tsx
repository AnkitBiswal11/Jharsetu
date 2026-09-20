import React, { createContext, useContext, useState, useMemo } from "react";

export type Lang = "en" | "hi" | "bn" | "or";

export const DICTIONARY = {
  en: {
    "nav.intake": "Citizen Intake",
    "nav.challenges": "University R&D Bank",
    "nav.csr": "Industry CSR Desk",
    "nav.admin": "State Admin",
    "hero.badge": "Quad-Helix: Citizens · Academia · Industry · Government",
    "hero.title1": "A village problem in Khunti becomes",
    "hero.title2": "a funded research project",
    "hero.title3": "in Mesra.",
    "hero.desc": "JharSetu structures grassroots grievances from all 24 districts into research-grade challenge statements, routes them to student capstone teams for NEP 2020 credit, and matches them with verified industry CSR grants.",
    "hero.btnReport": "Report a community challenge",
    "hero.btnBrowse": "Browse the challenge bank",
    "form.heading": "Report Community Challenge",
    "form.subtitle": "Any citizen, panchayat member or field worker can file. No login required.",
    "form.badge": "Instant AI Formulation",
    "form.name": "Citizen name",
    "form.namePlaceholder": "e.g. Sunita Devi",
    "form.district": "District",
    "form.districtPlaceholder": "Select district",
    "form.block": "Block / village",
    "form.title": "Issue title",
    "form.titlePlaceholder": "e.g. Hand pumps run dry by February",
    "form.domain": "Problem domain",
    "form.description": "Detailed field description",
    "form.descriptionPlaceholder": "Describe what happens, since when, how many households are affected...",
    "form.photo": "Photo evidence (optional)",
    "form.photoDrop": "Drag & drop a photo, or tap to take one",
    "form.photoHint": "Attach field photographic evidence (e.g., contaminated well, broken culvert, crop blight). JPEG/PNG up to 5 MB.",
    "form.submit": "Submit for AI Restructuring",
    "form.submitting": "Triaging through Groq LPU...",
    "form.done": "Field Problem Recorded & AI-Synthesized",
    "form.trackingId": "Official Tracking ID",
    "form.doneHint": "Your report has been analyzed by Llama 3.3 70B and registered into the Jharkhand State Challenge Bank for university capstone adoption.",
    "form.again": "Submit another report",
    "voice.label": "Can't write? Speak your complaint",
  },
  hi: {
    "nav.intake": "नागरिक शिकायत",
    "nav.challenges": "विश्वविद्यालय R&D बैंक",
    "nav.csr": "उद्योग CSR डेस्क",
    "nav.admin": "राज्य प्रशासन",
    "hero.badge": "क्वाड-हेलिक्स: नागरिक · शिक्षा जगत · उद्योग · सरकार",
    "hero.title1": "खूंटी के एक गाँव की समस्या बनती है",
    "hero.title2": "मेसरा में एक वित्तपोषित शोध परियोजना",
    "hero.title3": "।",
    "hero.desc": "झारसेतु सभी 24 जिलों से जमीनी समस्याओं को शोध-स्तरीय चुनौतियों में बदलता है, उन्हें NEP 2020 क्रेडिट के तहत छात्रों को सौंपता है, और उद्योग CSR अनुदान से जोड़ता है।",
    "hero.btnReport": "सामुदायिक समस्या दर्ज करें",
    "hero.btnBrowse": "चुनौती बैंक देखें",
    "form.heading": "सामुदायिक समस्या दर्ज करें",
    "form.subtitle": "कोई भी नागरिक, पंचायत प्रतिनिधि या कार्यकर्ता दर्ज कर सकते हैं। लॉगिन की आवश्यकता नहीं।",
    "form.badge": "त्वरित AI निर्माण",
    "form.name": "नागरिक का नाम",
    "form.namePlaceholder": "उदा. सुनीता देवी",
    "form.district": "ज़िला",
    "form.districtPlaceholder": "ज़िला चुनें",
    "form.block": "प्रखंड / गाँव",
    "form.title": "समस्या का शीर्षक",
    "form.titlePlaceholder": "उदा. फरवरी तक हैंडपंप सूख जाते हैं",
    "form.domain": "समस्या का क्षेत्र",
    "form.description": "विस्तृत विवरण",
    "form.descriptionPlaceholder": "बताएं कि क्या समस्या है, कब से है, और कितने परिवार प्रभावित हैं...",
    "form.photo": "फोटो प्रमाण (वैकल्पिक)",
    "form.photoDrop": "फोटो खींचें या यहाँ ड्रॉप करें",
    "form.photoHint": "समस्या की तस्वीर संलग्न करें (उदा. सूखा कुआँ, टूटी सड़क)। अधिकतम 5 MB।",
    "form.submit": "AI विश्लेषण हेतु सबमिट करें",
    "form.submitting": "Groq LPU द्वारा विश्लेषण जारी...",
    "form.done": "समस्या सफलतापूर्वक दर्ज एवं संश्लेषित हुई",
    "form.trackingId": "आधिकारिक ट्रैकिंग संख्या",
    "form.doneHint": "आपकी समस्या को AI द्वारा शोध परियोजना में बदलकर झारखंड स्टेट चैलेंज बैंक में शामिल कर लिया गया है।",
    "form.again": "एक और समस्या दर्ज करें",
    "voice.label": "लिखने में असमर्थ हैं? बोलकर दर्ज करें",
  },
  bn: {
    "nav.intake": "নাগরিক রিপোর্ট",
    "nav.challenges": "বিশ্ববিদ্যালয় R&D ব্যাংক",
    "nav.csr": "শিল্প CSR ডেস্ক",
    "nav.admin": "রাজ্য প্রশাসন",
    "hero.badge": "কোয়াড-হেলিক্স: নাগরিক · শিক্ষা · শিল্প · সরকার",
    "hero.title1": "খুঁটির একটি গ্রামীণ সমস্যা পরিণত হয়",
    "hero.title2": "মেসরায় অর্থায়িত গবেষণা প্রকল্পে",
    "hero.title3": "।",
    "hero.desc": "ঝাড়সেতু ২৪টি জেলার সমস্যাগুলিকে গবেষণা-গ্রেড প্রকল্পে রূপান্তরিত করে এবং NEP 2020 ক্রেডিট ও CSR অনুদানের সাথে যুক্ত করে।",
    "hero.btnReport": "সমস্যা রিপোর্ট করুন",
    "hero.btnBrowse": "চ্যালেঞ্জ ব্যাংক দেখুন",
    "form.heading": "গ্রামের সমস্যা রিপোর্ট করুন",
    "form.subtitle": "যে কোনো নাগরিক রিপোর্ট করতে পারেন। কোনো লগইন প্রয়োজন নেই।",
    "form.badge": "তাৎক্ষণিক AI বিশ্লেষণ",
    "form.name": "আপনার নাম",
    "form.namePlaceholder": "যেমন সুনিতা দেবী",
    "form.district": "জেলা",
    "form.districtPlaceholder": "জেলা নির্বাচন করুন",
    "form.block": "ব্লক / গ্রাম",
    "form.title": "সমস্যার শিরোনাম",
    "form.titlePlaceholder": "যেমন নলকূপের জল শুকিয়ে যাওয়া",
    "form.domain": "সমস্যার ক্ষেত্র",
    "form.description": "বিস্তারিত বিবরণ",
    "form.descriptionPlaceholder": "কী সমস্যা এবং কতগুলি পরিবার ক্ষতিগ্রস্ত হচ্ছে বিস্তারিত লিখুন...",
    "form.photo": "ছবির প্রমাণ (ঐচ্ছিক)",
    "form.photoDrop": "ছবি তুলুন বা ফাইল আপলোড করুন",
    "form.photoHint": "সমস্যার ছবি সংযুক্ত করুন (সর্বোচ্চ ৫ MB)।",
    "form.submit": "AI বিশ্লেষণের জন্য জমা দিন",
    "form.submitting": "Groq LPU বিশ্লেষণ চলছে...",
    "form.done": "সমস্যা সফলভাবে নথিভুক্ত হয়েছে",
    "form.trackingId": "ট্র্যাকিং আইডি",
    "form.doneHint": "আপনার অভিযোগটি গবেষণা প্রকল্পে অন্তর্ভুক্ত করা হয়েছে।",
    "form.again": "অন্য সমস্যা জমা দিন",
    "voice.label": "লিখতে সমস্যা? কথা বলে জানান",
  },
  or: {
    "nav.intake": "ନାଗରିକ ଅଭିଯୋଗ",
    "nav.challenges": "ବିଶ୍ୱବିଦ୍ୟାଳୟ R&D ବ୍ୟାଙ୍କ",
    "nav.csr": "ଶିଳ୍ପ CSR ଡେସ୍କ",
    "nav.admin": "ରାଜ୍ୟ ପ୍ରଶାସନ",
    "hero.badge": "କ୍ୱାଡ-ହେଲିକ୍ସ: ନାଗରିକ · ଶିକ୍ଷା · ଶିଳ୍ପ · ସରକାର",
    "hero.title1": "ଖୁଣ୍ଟିର ଗ୍ରାମୀଣ ସମସ୍ୟା ପାଲଟେ",
    "hero.title2": "ମେସରାର ଏକ ଅନୁଦାନପ୍ରାପ୍ତ ଗବେଷଣା",
    "hero.title3": "।",
    "hero.desc": "ଝାରସେତୁ ୨୪ଟି ଜିଲ୍ଲାର ଜନସାଧାରଣଙ୍କ ସମସ୍ୟାକୁ ଗବେଷଣା ପ୍ରକଳ୍ପରେ ରୂପାନ୍ତରିତ କରେ।",
    "hero.btnReport": "ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ",
    "hero.btnBrowse": "ଚ୍ୟାଲେଞ୍ଜ ବ୍ୟାଙ୍କ ଦେଖନ୍ତୁ",
    "form.heading": "ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ",
    "form.subtitle": "କୌଣସି ଲଗଇନ୍ ବିନା ଯେକୌଣସି ନାଗରିକ ଦାଖଲ କରିପାରିବେ।",
    "form.badge": "AI ବିଶ୍ଳେଷଣ",
    "form.name": "ନାମ",
    "form.namePlaceholder": "ଯଥା: ସୁନୀତା ଦେବୀ",
    "form.district": "ଜିଲ୍ଲା",
    "form.districtPlaceholder": "ଜିଲ୍ଲା ବାଛନ୍ତୁ",
    "form.block": "ବ୍ଲକ / ଗ୍ରାମ",
    "form.title": "ସମସ୍ୟାର ନାମ",
    "form.titlePlaceholder": "ଯଥା: ଫେବୃଆରୀ ସୁଦ୍ଧା ନଳକୂପ ଶୁଖିଯାଏ",
    "form.domain": "କ୍ଷେତ୍ର",
    "form.description": "ବିସ୍ତୃତ ବିବରଣୀ",
    "form.descriptionPlaceholder": "ସମସ୍ୟା ସମ୍ପର୍କରେ ବିସ୍ତୃତ ଭାବରେ ଲେଖନ୍ତୁ...",
    "form.photo": "ଫଟୋ ପ୍ରମାଣ (ଇଚ୍ଛାଧୀନ)",
    "form.photoDrop": "ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ",
    "form.photoHint": "ସର୍ବାଧିକ ୫ MB ସାଇଜ୍ ଫଟୋ।",
    "form.submit": "ଦାଖଲ କରନ୍ତୁ",
    "form.submitting": "Groq LPU ପ୍ରକ୍ରିୟାକରଣ ଚାଲିଛି...",
    "form.done": "ସଫଳତାର ସହ ପଞ୍ଜିକୃତ ହେଲା",
    "form.trackingId": "ଟ୍ରାକିଂ ଆଇଡି",
    "form.doneHint": "ଆପଣଙ୍କ ସମସ୍ୟାକୁ ରାଜ୍ୟ ଚ୍ୟାଲେଞ୍ଜ ବ୍ୟାଙ୍କରେ ସାମିଲ କରାଗଲା।",
    "form.again": "ଅନ୍ୟ ଏକ ସମସ୍ୟା ଦାଖଲ କରନ୍ତୁ",
    "voice.label": "ଲେଖିପାରୁନାହାଁନ୍ତି କି? କହି ଅଭିଯୋଗ କରନ୍ତୁ",
  },
} as const;

export type DictKey = keyof (typeof DICTIONARY)["en"];

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("jharsetu_lang");
        if (stored === "en" || stored === "hi" || stored === "bn" || stored === "or") {
          return stored;
        }
      }
    } catch {
      // Ignore localStorage access failures
    }
    return "en";
  });

  const setLang = (newLang: Lang) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("jharsetu_lang", newLang);
      }
    } catch {
      // Ignore storage write errors
    }
    setLangState(newLang);
  };

  const t = useMemo(() => {
    return (key: DictKey): string => {
      const activeDict = DICTIONARY[lang] as Record<string, string> | undefined;
      if (activeDict && activeDict[key]) {
        return activeDict[key];
      }
      return (DICTIONARY.en as Record<string, string>)[key] ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallbackLang: Lang = "en";
    return {
      lang: fallbackLang,
      setLang: () => {},
      t: (key: DictKey) => (DICTIONARY.en as Record<string, string>)[key] ?? key,
    };
  }
  return ctx;
}