export type Lang = "en" | "tl" | "cz"

const dict: Record<string, { en: string; tl: string; cz: string }> = {
  "site.title": { en: "Digital Coordinator", tl: "Digital Coordinator", cz: "Digitální Koordinátor" },
  "site.tagline": { en: "Filipino Workforce Support", tl: "Suporta sa Manggagawang Pilipino", cz: "Podpora filipínských pracovníků" },
  "site.description": {
    en: "Your guide to working and living in Czech Republic",
    tl: "Gabay mo sa pagtatrabaho at pamumuhay sa Czech Republic",
    cz: "Váš průvodce prací a životem v České republice",
  },

  "nav.guide": { en: "Guide", tl: "Gabay", cz: "Průvodce" },
  "nav.contact": { en: "Contact", tl: "Kontak", cz: "Kontakt" },
  "nav.login": { en: "Login", tl: "Login", cz: "Přihlásit" },
  "nav.home": { en: "Home", tl: "Home", cz: "Domů" },
  "nav.back": { en: "Back to Guide", tl: "Bumalik sa Gabay", cz: "Zpět na průvodce" },

  "home.welcome": { en: "Mabuhay!", tl: "Mabuhay!", cz: "Vítejte!" },
  "home.subtitle": {
    en: "Your complete guide to working in Czech Republic",
    tl: "Ang iyong kumpletong gabay sa pagtatrabaho sa Czech Republic",
    cz: "Váš kompletní průvodce prací v České republice",
  },
  "home.tag": { en: "AUTOMATED ONBOARDING", tl: "AUTOMATED NA SUPPORTA", cz: "AUTOMATIZOVANÝ NÁSTUP" },
  "home.steps.title": {
    en: "Follow your onboarding journey",
    tl: "Sundin ang iyong onboarding journey",
    cz: "Sledujte svůj nástupní proces",
  },

  "step.register": { en: "Register", tl: "Magparehistro", cz: "Registrovat" },
  "step.register.desc": {
    en: "Create your worker profile so your coordinator knows who you are.",
    tl: "Gumawa ng iyong profile para makilala ka ng iyong coordinator.",
    cz: "Vytvořte si profil pracovníka, aby vás koordinátor poznal.",
  },
  "step.before": { en: "Before Arrival", tl: "Bago Dumating", cz: "Před příjezdem" },
  "step.before.desc": {
    en: "Prepare your documents, check the employer card process, and get ready.",
    tl: "Ihanda ang iyong mga dokumento at ang employer card proseso.",
    cz: "Připravte si dokumenty a proces zaměstnanecké karty.",
  },
  "step.employer": { en: "Employer Card & Immigration", tl: "Employer Card at Immigration", cz: "Zaměstnanecká karta a imigrace" },
  "step.employer.desc": {
    en: "Step-by-step process for your Employee Card — from embassy to biometrics.",
    tl: "Hakbang-hakbang na proseso para sa iyong Employee Card.",
    cz: "Postup krok za krokem pro vaši zaměstnaneckou kartu.",
  },
  "step.after": { en: "After Arrival", tl: "Pagkatapos Dumating", cz: "Po příjezdu" },
  "step.after.desc": {
    en: "SIM card, bank account, foreign police, and settling into your new home.",
    tl: "SIM card, bank account, foreign police, at pag-aayos sa iyong bagong tahanan.",
    cz: "SIM karta, bankovní účet, cizinecká policie a zabydlení.",
  },
  "step.firstday": { en: "First Day at Work", tl: "Unang Araw sa Trabaho", cz: "První den v práci" },
  "step.firstday.desc": {
    en: "What to expect on your first day — documents, uniform, safety.",
    tl: "Anong aasahan sa unang araw mo — dokumento, uniporme, kaligtasan.",
    cz: "Co čekat první den — dokumenty, uniforma, bezpečnost.",
  },

  "step.faq": { en: "FAQ", tl: "FAQ", cz: "Často kladené otázky" },
  "step.faq.desc": {
    en: "Answers to common questions about living and working in Czech Republic",
    tl: "Mga sagot sa karaniwang tanong tungkol sa Czech Republic",
    cz: "Odpovědi na běžné otázky o životě a práci v České republice",
  },
  "step.contact": { en: "Contact", tl: "Kontak", cz: "Kontakt" },
  "step.contact.desc": {
    en: "Reach out directly — I am here to help",
    tl: "Mag-message lang — nandito ako para tumulong",
    cz: "Ozvete se přímo — jsem tu, abych pomohl",
  },
  "faq.title": { en: "Frequently Asked Questions", tl: "Mga Madalas Itanong", cz: "Často kladené otázky" },
  "faq.subtitle": {
    en: "Answers to common questions about living and working in Czech Republic",
    tl: "Mga sagot sa karaniwang tanong tungkol sa Czech Republic",
    cz: "Odpovědi na běžné otázky o životě a práci v České republice",
  },
  "faq.search": { en: "Search questions...", tl: "Maghanap ng tanong...", cz: "Hledat otázky..." },
  "faq.empty": { en: "No matching questions found.", tl: "Walang nahanap na tanong.", cz: "Nenalezeny žádné odpovídající otázky." },

  "guide.title": { en: "Worker Guide", tl: "Gabay ng Manggagawa", cz: "Průvodce pracovníka" },
  "guide.subtitle": {
    en: "Everything you need to know about working and living in Czech Republic",
    tl: "Lahat ng kailangan mong malaman tungkol sa Czech Republic",
    cz: "Vše, co potřebujete vědět o práci a životě v České republice",
  },

  "contact.title": { en: "Contact Your Coordinator", tl: "Kontakin ang Iyong Coordinator", cz: "Kontaktujte svého koordinátora" },
  "contact.subtitle": {
    en: "Reach out directly — I am here to help",
    tl: "Mag-message lang — nandito ako para tumulong",
    cz: "Ozvete se přímo — jsem tu, abych pomohl",
  },
  "contact.whatsapp": { en: "WhatsApp", tl: "WhatsApp", cz: "WhatsApp" },
  "contact.phone": { en: "Phone", tl: "Tawag", cz: "Telefon" },
  "contact.email": { en: "Email", tl: "Email", cz: "Email" },
  "contact.tap.chat": { en: "Tap to chat", tl: "Pindutin para mag-chat", cz: "Klepněte pro chat" },
  "contact.tap.call": { en: "Tap to call", tl: "Pindutin para tumawag", cz: "Klepněte pro zavolání" },
  "contact.tap.email": { en: "Send email", tl: "Mag-email", cz: "Odeslat email" },
  "contact.emergency": { en: "Emergency: Call 112", tl: "Emergency: Tumawag sa 112", cz: "Nouze: Volejte 112" },
  "contact.emergency.desc": {
    en: "For immediate danger — police, ambulance, or fire. Operators speak English.",
    tl: "Para sa agarang panganib — pulis, ambulansya, o bumbero. Nagsasalita ng English ang operators.",
    cz: "Pro bezprostřední nebezpečí — policie, záchranka, hasiči. Operátoři mluví anglicky.",
  },
  "contact.report.title": { en: "Report an Issue", tl: "Mag-ulat ng Problema", cz: "Nahlásit problém" },
  "contact.report.desc": {
    en: "For non-urgent problems, fill out the form below. Your coordinator will follow up.",
    tl: "Para sa hindi urgent na problema, punan ang form. Susundan ka ng iyong coordinator.",
    cz: "Pro neakutní problémy vyplňte formulář níže. Koordinátor se vám ozve.",
  },

  "register.title": { en: "Worker Registration", tl: "Pagpaparehistro ng Manggagawa", cz: "Registrace pracovníka" },
  "register.subtitle": {
    en: "Register to get started with automated onboarding support",
    tl: "Magparehistro para makapagsimula sa automated na suporta",
    cz: "Zaregistrujte se a začněte s automatizovanou podporou nástupu",
  },
  "register.already": { en: "Already registered?", tl: "Nakapagrehistro na?", cz: "Již registrován?" },
  "register.guide": { en: "Go to the worker guide", tl: "Pumunta sa gabay", cz: "Přejít na průvodce" },

  "report.title": { en: "Report an Issue", tl: "Mag-ulat ng Problema", cz: "Nahlásit problém" },
  "report.subtitle": {
    en: "Describe the problem you are experiencing. A coordinator will follow up with you.",
    tl: "Ilarawan ang problemang nararanasan mo. May coordinator na susunod sa iyo.",
    cz: "Popište problém, který zažíváte. Koordinátor se vám ozve.",
  },

  "employer.title": { en: "Employer Card & Immigration", tl: "Employer Card at Immigration", cz: "Zaměstnanecká karta a imigrace" },
  "employer.subtitle": {
    en: "Everything about your Employee Card (Zaměstnanecká karta) in Czech Republic",
    tl: "Lahat tungkol sa iyong Employee Card sa Czech Republic",
    cz: "Vše o vaší zaměstnanecké kartě v České republice",
  },
  "employer.process": { en: "The Process — Step by Step", tl: "Ang Proseso — Hakbang-hakbang", cz: "Proces — krok za krokem" },
  "employer.oamp": { en: "OAMP Office", tl: "OAMP Office", cz: "Pracoviště OAMP" },
  "employer.oamp.desc": {
    en: "Department of Asylum and Migration Policy — biometrics & card collection",
    tl: "Department of Asylum and Migration — biometrics at card collection",
    cz: "Odbor azylové a migrační politiky — biometrie a vyzvednutí karty",
  },
  "employer.obligations": { en: "Your Obligations", tl: "Iyong mga Obligasyon", cz: "Vaše povinnosti" },
  "employer.foreign": { en: "Foreign Police (Cizinecká policie)", tl: "Foreign Police", cz: "Cizinecká policie" },
  "employer.foreign.desc": {
    en: "For residence registration within 3 working days after arrival",
    tl: "Para sa residence registration sa loob ng 3 araw pagdating",
    cz: "Pro registraci pobytu do 3 pracovních dnů po příjezdu",
  },
  "employer.all": { en: "All locations", tl: "Lahat ng lokasyon", cz: "Všechna místa" },
  "employer.important": {
    en: "The Employee Card is your legal document for living and working in Czech Republic. It combines a work permit and residence permit into one card.",
    tl: "Ang Employee Card ay iyong legal na dokumento para manirahan at magtrabaho sa Czech Republic.",
    cz: "Zaměstnanecká karta je váš právní doklad pro život a práci v ČR. Spojuje povolení k práci a pobyt do jedné karty.",
  },
  "employer.help": { en: "Need Help?", tl: "Kailangan ng Tulong?", cz: "Potřebujete pomoc?" },
  "employer.help.desc": {
    en: "If you have any questions about your Employee Card renewal, address change, or immigration status, contact your coordinator.",
    tl: "Kung may tanong ka tungkol sa iyong Employee Card, kontakin ang iyong coordinator.",
    cz: "Máte-li dotazy k zaměstnanecké kartě, kontaktujte svého koordinátora.",
  },

  "before.title": { en: "Before Arrival", tl: "Bago Dumating", cz: "Před příjezdem" },
  "before.subtitle": {
    en: "What to prepare before leaving for Czech Republic",
    tl: "Ano ang ihahanda bago umalis papuntang Czech Republic",
    cz: "Co připravit před odjezdem do České republiky",
  },
  "before.checklist": { en: "Documents Checklist", tl: "Listahan ng mga Dokumento", cz: "Kontrolní seznam dokumentů" },
  "before.tips": { en: "Practical Information", tl: "Mahalagang Impormasyon", cz: "Praktické informace" },
  "before.airport": { en: "Airport Arrival Instructions", tl: "Pagdating sa Airport", cz: "Instrukce pro přílet na letiště" },

  "after.title": { en: "After Arrival", tl: "Pagkatapos Dumating", cz: "Po příjezdu" },
  "after.subtitle": {
    en: "Your first steps after landing in Czech Republic",
    tl: "Iyong mga unang hakbang pagdating sa Czech Republic",
    cz: "Vaše první kroky po příletu do České republiky",
  },
  "after.safety": { en: "Important Rules & Safety", tl: "Mahalagang Alituntunin at Kaligtasan", cz: "Důležitá pravidla a bezpečnost" },

  "firstday.title": { en: "First Day at Work", tl: "Unang Araw sa Trabaho", cz: "První den v práci" },
  "firstday.subtitle": {
    en: "How to prepare and what to expect on your first day",
    tl: "Paano maghanda at ano ang aasahan sa unang araw mo",
    cz: "Jak se připravit a co čekat první den",
  },
  "firstday.phrases": {
    en: "Useful Czech Phrases for Work",
    tl: "Mga Kapakipakinabang na Czech Phrases para sa Trabaho",
    cz: "Užitečné české fráze do práce",
  },
  "firstday.contacts": {
    en: "Save These Contacts",
    tl: "I-save ang mga Kontak na Ito",
    cz: "Uložte si tyto kontakty",
  },

  "lang.en": { en: "English", tl: "English", cz: "Angličtina" },
  "lang.tl": { en: "Filipino", tl: "Filipino", cz: "Filipínština" },
  "lang.cz": { en: "Czech", tl: "Czech", cz: "Čeština" },
  "lang.toggle": {
    en: "Switch language",
    tl: "Ilipat sa English",
    cz: "Přepnout jazyk",
  },

  "report.problem": { en: "Report a Problem", tl: "Mag-ulat ng Problema", cz: "Nahlásit problém" },
  "faq.label": { en: "FAQ", tl: "FAQ", cz: "FAQ" },
  "emergency": { en: "Emergency", tl: "Emergency", cz: "Nouzový" },
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
    if (langParam === "cz") return "cz"
    if (langParam === "en") return "en"
  }
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("lang")
    if (stored === "tl") return "tl"
    if (stored === "cz") return "cz"
  }
  return "en"
}

export function langSwitchHref(currentLang: Lang, pathname: string, searchParams: URLSearchParams): string {
  const cycle: Lang[] = ["en", "tl", "cz"]
  const currentIdx = cycle.indexOf(currentLang)
  const newLang = cycle[(currentIdx + 1) % cycle.length]
  const params = new URLSearchParams(searchParams)
  params.set("lang", newLang)
  return `${pathname}?${params.toString()}`
}

export const langLabels: Record<Lang, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  tl: { short: "TL", full: "Tagalog" },
  cz: { short: "CZ", full: "Čeština" },
}
