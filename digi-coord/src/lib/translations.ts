export type Lang = "en" | "tl"

const dict: Record<string, { en: string; tl: string }> = {
  "site.title": { en: "Digital Coordinator", tl: "Digital Coordinator" },
  "site.tagline": { en: "Filipino Workforce Support", tl: "Suporta sa Manggagawang Pilipino" },
  "site.description": {
    en: "Your guide to working and living in Czech Republic",
    tl: "Gabay mo sa pagtatrabaho at pamumuhay sa Czech Republic",
  },

  "nav.guide": { en: "Guide", tl: "Gabay" },
  "nav.contact": { en: "Contact", tl: "Kontak" },
  "nav.login": { en: "Login", tl: "Login" },
  "nav.home": { en: "Home", tl: "Home" },
  "nav.back": { en: "Back to Guide", tl: "Bumalik sa Gabay" },

  "home.welcome": { en: "Mabuhay!", tl: "Mabuhay!" },
  "home.subtitle": {
    en: "Your complete guide to working in Czech Republic",
    tl: "Ang iyong kumpletong gabay sa pagtatrabaho sa Czech Republic",
  },
  "home.tag": { en: "AUTOMATED ONBOARDING", tl: "AUTOMATED NA SUPPORTA" },
  "home.steps.title": {
    en: "Follow your onboarding journey",
    tl: "Sundin ang iyong onboarding journey",
  },

  "step.register": { en: "Register", tl: "Magparehistro" },
  "step.register.desc": {
    en: "Create your worker profile so your coordinator knows who you are.",
    tl: "Gumawa ng iyong profile para makilala ka ng iyong coordinator.",
  },
  "step.before": { en: "Before Arrival", tl: "Bago Dumating" },
  "step.before.desc": {
    en: "Prepare your documents, check the employer card process, and get ready.",
    tl: "Ihanda ang iyong mga dokumento at ang employer card proseso.",
  },
  "step.employer": { en: "Employer Card & Immigration", tl: "Employer Card at Immigration" },
  "step.employer.desc": {
    en: "Step-by-step process for your Employee Card — from embassy to biometrics.",
    tl: "Hakbang-hakbang na proseso para sa iyong Employee Card.",
  },
  "step.after": { en: "After Arrival", tl: "Pagkatapos Dumating" },
  "step.after.desc": {
    en: "SIM card, bank account, foreign police, and settling into your new home.",
    tl: "SIM card, bank account, foreign police, at pag-aayos sa iyong bagong tahanan.",
  },
  "step.firstday": { en: "First Day at Work", tl: "Unang Araw sa Trabaho" },
  "step.firstday.desc": {
    en: "What to expect on your first day — documents, uniform, safety.",
    tl: "Anong aasahan sa unang araw mo — dokumento, uniporme, kaligtasan.",
  },

  "faq.title": { en: "Frequently Asked Questions", tl: "Mga Madalas Itanong" },
  "faq.subtitle": {
    en: "Answers to common questions about living and working in Czech Republic",
    tl: "Mga sagot sa karaniwang tanong tungkol sa Czech Republic",
  },
  "faq.search": { en: "Search questions...", tl: "Maghanap ng tanong..." },
  "faq.empty": { en: "No matching questions found.", tl: "Walang nahanap na tanong." },

  "guide.title": { en: "Worker Guide", tl: "Gabay ng Manggagawa" },
  "guide.subtitle": {
    en: "Everything you need to know about working and living in Czech Republic",
    tl: "Lahat ng kailangan mong malaman tungkol sa Czech Republic",
  },

  "contact.title": { en: "Contact Your Coordinator", tl: "Kontakin ang Iyong Coordinator" },
  "contact.subtitle": {
    en: "Reach out directly — I am here to help",
    tl: "Mag-message lang — nandito ako para tumulong",
  },
  "contact.whatsapp": { en: "WhatsApp", tl: "WhatsApp" },
  "contact.phone": { en: "Phone", tl: "Tawag" },
  "contact.email": { en: "Email", tl: "Email" },
  "contact.tap.chat": { en: "Tap to chat", tl: "Pindutin para mag-chat" },
  "contact.tap.call": { en: "Tap to call", tl: "Pindutin para tumawag" },
  "contact.tap.email": { en: "Send email", tl: "Mag-email" },
  "contact.emergency": { en: "Emergency: Call 112", tl: "Emergency: Tumawag sa 112" },
  "contact.emergency.desc": {
    en: "For immediate danger — police, ambulance, or fire. Operators speak English.",
    tl: "Para sa agarang panganib — pulis, ambulansya, o bumbero. Nagsasalita ng English ang operators.",
  },
  "contact.report.title": { en: "Report an Issue", tl: "Mag-ulat ng Problema" },
  "contact.report.desc": {
    en: "For non-urgent problems, fill out the form below. Your coordinator will follow up.",
    tl: "Para sa hindi urgent na problema, punan ang form. Susundan ka ng iyong coordinator.",
  },

  "register.title": { en: "Worker Registration", tl: "Pagpaparehistro ng Manggagawa" },
  "register.subtitle": {
    en: "Register to get started with automated onboarding support",
    tl: "Magparehistro para makapagsimula sa automated na suporta",
  },
  "register.already": { en: "Already registered?", tl: "Nakapagrehistro na?" },
  "register.guide": { en: "Go to the worker guide", tl: "Pumunta sa gabay" },

  "report.title": { en: "Report an Issue", tl: "Mag-ulat ng Problema" },
  "report.subtitle": {
    en: "Describe the problem you are experiencing. A coordinator will follow up with you.",
    tl: "Ilarawan ang problemang nararanasan mo. May coordinator na susunod sa iyo.",
  },

  "employer.title": { en: "Employer Card & Immigration", tl: "Employer Card at Immigration" },
  "employer.subtitle": {
    en: "Everything about your Employee Card (Zaměstnanecká karta) in Czech Republic",
    tl: "Lahat tungkol sa iyong Employee Card sa Czech Republic",
  },
  "employer.process": { en: "The Process — Step by Step", tl: "Ang Proseso — Hakbang-hakbang" },
  "employer.oamp": { en: "OAMP Office", tl: "OAMP Office" },
  "employer.oamp.desc": {
    en: "Department of Asylum and Migration Policy — biometrics & card collection",
    tl: "Department of Asylum and Migration — biometrics at card collection",
  },
  "employer.obligations": { en: "Your Obligations", tl: "Iyong mga Obligasyon" },
  "employer.foreign": { en: "Foreign Police (Cizinecká policie)", tl: "Foreign Police" },
  "employer.foreign.desc": {
    en: "For residence registration within 3 working days after arrival",
    tl: "Para sa residence registration sa loob ng 3 araw pagdating",
  },
  "employer.all": { en: "All locations", tl: "Lahat ng lokasyon" },
  "employer.important": {
    en: "The Employee Card is your legal document for living and working in Czech Republic. It combines a work permit and residence permit into one card.",
    tl: "Ang Employee Card ay iyong legal na dokumento para manirahan at magtrabaho sa Czech Republic.",
  },
  "employer.help": { en: "Need Help?", tl: "Kailangan ng Tulong?" },
  "employer.help.desc": {
    en: "If you have any questions about your Employee Card renewal, address change, or immigration status, contact your coordinator.",
    tl: "Kung may tanong ka tungkol sa iyong Employee Card, kontakin ang iyong coordinator.",
  },

  "before.title": { en: "Before Arrival", tl: "Bago Dumating" },
  "before.subtitle": {
    en: "What to prepare before leaving for Czech Republic",
    tl: "Ano ang ihahanda bago umalis papuntang Czech Republic",
  },
  "before.checklist": { en: "Documents Checklist", tl: "Listahan ng mga Dokumento" },
  "before.tips": { en: "Practical Information", tl: "Mahalagang Impormasyon" },
  "before.airport": { en: "Airport Arrival Instructions", tl: "Pagdating sa Airport" },

  "after.title": { en: "After Arrival", tl: "Pagkatapos Dumating" },
  "after.subtitle": {
    en: "Your first steps after landing in Czech Republic",
    tl: "Iyong mga unang hakbang pagdating sa Czech Republic",
  },
  "after.safety": { en: "Important Rules & Safety", tl: "Mahalagang Alituntunin at Kaligtasan" },

  "firstday.title": { en: "First Day at Work", tl: "Unang Araw sa Trabaho" },
  "firstday.subtitle": {
    en: "How to prepare and what to expect on your first day",
    tl: "Paano maghanda at ano ang aasahan sa unang araw mo",
  },
  "firstday.phrases": {
    en: "Useful Czech Phrases for Work",
    tl: "Mga Kapakipakinabang na Czech Phrases para sa Trabaho",
  },
  "firstday.contacts": {
    en: "Save These Contacts",
    tl: "I-save ang mga Kontak na Ito",
  },

  "lang.en": { en: "English", tl: "English" },
  "lang.tl": { en: "Filipino", tl: "Filipino" },
  "lang.toggle": {
    en: "Switch to Filipino",
    tl: "Ilipat sa English",
  },

  "report.problem": { en: "Report a Problem", tl: "Mag-ulat ng Problema" },
  "faq.label": { en: "FAQ", tl: "FAQ" },
  "emergency": { en: "Emergency", tl: "Emergency" },
}

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] || dict[key]?.en || key
}

export function translatePage(pageKey: string, lang: Lang): { title: string; subtitle: string } {
  return {
    title: t(`${pageKey}.title`, lang),
    subtitle: t(`${pageKey}.subtitle`, lang),
  }
}

export function getLang(request?: Request): Lang {
  if (request) {
    const url = new URL(request.url)
    const langParam = url.searchParams.get("lang")
    if (langParam === "tl") return "tl"
    if (langParam === "en") return "en"
  }
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("lang")
    if (stored === "tl") return "tl"
  }
  return "en"
}

export function langSwitchHref(currentLang: Lang, pathname: string, searchParams: URLSearchParams): string {
  const newLang = currentLang === "en" ? "tl" : "en"
  const params = new URLSearchParams(searchParams)
  params.set("lang", newLang)
  return `${pathname}?${params.toString()}`
}

export const langLabels: Record<Lang, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  tl: { short: "TL", full: "Tagalog" },
}
