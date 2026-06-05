export interface LetterCategory {
  id: string
  icon: string
  title: { en: string; cz: string }
  commonReasons: { en: string[]; cz: string[] }
  action: { en: string; cz: string }
  requiresCoordinator: boolean
  coordinatorNote?: { en: string; cz: string }
}

export const letterCategories: LetterCategory[] = [
  {
    id: "MINISTRY_OF_INTERIOR",
    icon: "🏛️",
    title: { en: "Ministry of Interior", cz: "Ministerstvo vnitra" },
    commonReasons: {
      en: [
        "Biometrics appointment",
        "Employee Card collection",
        "Additional documents requested",
        "Change of address",
        "Immigration status update",
      ],
      cz: [
        "Schůzka k biometrii",
        "Vyřízení zaměstnanecké karty",
        "Žádost o další dokumenty",
        "Změna adresy",
        "Aktualizace imigračního statusu",
      ],
    },
    action: {
      en: "Read the letter carefully. Check the date and whether an appointment is required. Contact your coordinator if you do not understand the instructions.",
      cz: "Přečtěte si dopis pozorně. Zkontrolujte datum a zda je vyžadována schůzka. Kontaktujte koordinátora, pokud nerozumíte pokynům.",
    },
    requiresCoordinator: false,
    coordinatorNote: {
      en: "If you are unsure about any ministry letter, contact your coordinator before taking action.",
      cz: "Pokud si nejste jisti jakýmkoli dopisem z ministerstva, před provedením akce kontaktujte koordinátora.",
    },
  },
  {
    id: "HEALTH_INSURANCE",
    icon: "🏥",
    title: { en: "Health Insurance", cz: "Zdravotní pojišťovna" },
    commonReasons: {
      en: [
        "Insurance registration confirmation",
        "Insurance card delivery",
        "Coverage information update",
        "Missing documents request",
        "Payment information",
      ],
      cz: [
        "Potvrzení registrace pojištění",
        "Doručení kartičky pojištění",
        "Aktualizace informací o krytí",
        "Žádost o chybějící dokumenty",
        "Informace o platbách",
      ],
    },
    action: {
      en: "Read the letter — most insurance letters are informational. If they ask for documents, prepare them and send as instructed. Contact your coordinator if you don't understand.",
      cz: "Přečtěte si dopis — většina dopisů od pojišťovny je informativních. Pokud žádají o dokumenty, připravte je a pošlete podle pokynů. Kontaktujte koordinátora, pokud nerozumíte.",
    },
    requiresCoordinator: false,
  },
  {
    id: "BANK",
    icon: "🏦",
    title: { en: "Bank", cz: "Banka" },
    commonReasons: {
      en: [
        "Account activated",
        "Card ready for collection",
        "Security notice",
        "New PIN information",
        "Statement or tax document",
      ],
      cz: [
        "Účet aktivován",
        "Karta připravena k vyzvednutí",
        "Bezpečnostní oznámení",
        "Nové PIN informace",
        "Výpis nebo daňový doklad",
      ],
    },
    action: {
      en: "Check the letter for any deadlines. If your card is ready, bring your passport to the bank branch to collect it. Security notices should be taken seriously.",
      cz: "Zkontrolujte datum v dopise. Pokud je karta připravena, vezměte si pas a vyzvedněte ji na pobočce. Bezpečnostní oznámení berte vážně.",
    },
    requiresCoordinator: false,
  },
  {
    id: "EMPLOYER",
    icon: "🏢",
    title: { en: "Employer", cz: "Zaměstnavatel" },
    commonReasons: {
      en: [
        "Work schedule change",
        "Training invitation",
        "Payroll information",
        "Workplace instructions",
        "Contract update",
      ],
      cz: [
        "Změna pracovního rozvrhu",
        "Pozvánka na školení",
        "Informace o výplatě",
        "Pracovní pokyny",
        "Aktualizace smlouvy",
      ],
    },
    action: {
      en: "Read carefully and follow instructions. If you don't understand something, ask your supervisor or HR directly — they can explain in simple terms.",
      cz: "Přečtěte si pozorně a postupujte podle pokynů. Pokud něčemu nerozumíte, zeptejte se svého nadřízeného nebo HR.",
    },
    requiresCoordinator: false,
  },
  {
    id: "ACCOMMODATION",
    icon: "🏠",
    title: { en: "Accommodation", cz: "Ubytování" },
    commonReasons: {
      en: [
        "Room inspection notice",
        "Maintenance or repair",
        "House rules update",
        "Utility or rent information",
        "Contract renewal",
      ],
      cz: [
        "Oznámení o kontrole pokoje",
        "Údržba nebo oprava",
        "Aktualizace domovního řádu",
        "Informace o nájmu nebo službách",
        "Prodloužení smlouvy",
      ],
    },
    action: {
      en: "Follow the instructions in the letter. For maintenance or inspections, coordinate with your accommodation provider. Contact your coordinator if there is a serious issue.",
      cz: "Postupujte podle pokynů v dopise. Při údržbě nebo kontrolách se domluvte s poskytovatelem ubytování. V případě vážného problému kontaktujte koordinátora.",
    },
    requiresCoordinator: false,
  },
  {
    id: "OTHER",
    icon: "📮",
    title: { en: "Other / Unknown", cz: "Jiné / Neznámé" },
    commonReasons: {
      en: [
        "Letter from an unknown office",
        "Letter not in English or Czech",
        "You are not sure what to do",
      ],
      cz: [
        "Dopis z neznámého úřadu",
        "Dopis není v angličtině ani češtině",
        "Nejste si jisti, co dělat",
      ],
    },
    action: {
      en: "Do not panic. Do not ignore the letter. Contact your coordinator immediately with a photo of the letter.",
      cz: "Nepanikařte. Neignorujte dopis. Okamžitě kontaktujte koordinátora s fotkou dopisu.",
    },
    requiresCoordinator: true,
    coordinatorNote: {
      en: "Please send a clear photo of the letter to your coordinator. We will help you understand it and tell you what to do next.",
      cz: "Pošlete prosím jasnou fotku dopisu vašemu koordinátorovi. Pomůžeme vám porozumět a řekneme, co dělat dál.",
    },
  },
]

export const letterIcons: Record<string, string> = {
  MINISTRY_OF_INTERIOR: "🏛️",
  HEALTH_INSURANCE: "🏥",
  BANK: "🏦",
  EMPLOYER: "🏢",
  ACCOMMODATION: "🏠",
  OTHER: "📮",
}

export function getLetterCategory(id: string): LetterCategory | undefined {
  return letterCategories.find((c) => c.id === id)
}
