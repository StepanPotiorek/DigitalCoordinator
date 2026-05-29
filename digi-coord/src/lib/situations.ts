export interface SituationCategory {
  id: string
  icon: string
  title: { en: string; cz: string }
}

export interface Situation {
  id: string
  categoryId: string
  icon: string
  title: { en: string; cz: string }
  steps: { en: string[]; cz: string[] }
  message: { en: string; cz: string }
  contactTo: string
  reportCategory: string
}

export const categories: SituationCategory[] = [
  { id: "work", icon: "💼", title: { en: "Work", cz: "Práce" } },
  { id: "accommodation", icon: "🏠", title: { en: "Accommodation", cz: "Ubytování" } },
  { id: "bank", icon: "🏦", title: { en: "Bank", cz: "Banka" } },
  { id: "doctor", icon: "🩺", title: { en: "Doctor / Health", cz: "Doktor / Zdraví" } },
  { id: "immigration", icon: "🛂", title: { en: "Immigration", cz: "Imigrace" } },
  { id: "transport", icon: "🚌", title: { en: "Transport", cz: "Doprava" } },
  { id: "other", icon: "📋", title: { en: "Something else", cz: "Něco jiného" } },
]

export const situations: Situation[] = [
  // ===== WORK =====
  {
    id: "calling-in-sick",
    categoryId: "work",
    icon: "🤒",
    title: { en: "Calling in sick", cz: "Hlášení nemoci" },
    steps: {
      en: [
        "Contact your employer as early as possible (before your shift starts)",
        "Tell them you are sick and cannot come to work",
        "Ask if you need to visit a doctor for a sick note",
        "Visit a doctor to get a sick leave certificate if required",
      ],
      cz: [
        "Kontaktujte svého zaměstnavatele co nejdříve (před začátkem směny)",
        "Řekněte mu, že jste nemocní a nemůžete přijít do práce",
        "Zeptejte se, zda potřebujete navštívit lékaře pro potvrzení",
        "Navštivte lékaře a požádejte o neschopenku, pokud je potřeba",
      ],
    },
    message: {
      en: "Good morning/afternoon. I am sorry, but I cannot come to work today because I am sick. I will visit the doctor. I will let you know what the doctor says.",
      cz: "Dobré ráno/odpoledne. Omlouvám se, ale dnes nemohu přijít do práce, protože jsem nemocný/á. Navštívím lékaře. Dám vám vědět, co mi lékař řekne.",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "late-to-work",
    categoryId: "work",
    icon: "⏰",
    title: { en: "Running late for work", cz: "Zpoždění do práce" },
    steps: {
      en: [
        "Inform your employer or supervisor as soon as you know you will be late",
        "Say how late you expect to be",
        "Apologize and explain the reason briefly",
        "Arrive and start working as soon as possible",
      ],
      cz: [
        "Informujte svého zaměstnavatele nebo nadřízeného, jakmile víte, že budete mít zpoždění",
        "Řekněte, jak velké zpoždění očekáváte",
        "Omluvte se a stručně vysvětlete důvod",
        "Přijďte a začněte pracovat co nejdříve",
      ],
    },
    message: {
      en: "Good morning/afternoon. I am sorry, but I will be about [X] minutes late today due to [reason]. I am on my way now.",
      cz: "Dobré ráno/odpoledne. Omlouvám se, ale dnes budu mít asi [X] minut zpoždění kvůli [důvod]. Už jsem na cestě.",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "salary-query",
    categoryId: "work",
    icon: "💰",
    title: { en: "Asking about salary / payslip", cz: "Dotaz na plat / výplatní pásku" },
    steps: {
      en: [
        "Check your payslip carefully first",
        "Write down what you do not understand",
        "Ask your employer or HR about it politely",
        "If the problem continues for more than one month, contact your coordinator",
      ],
      cz: [
        "Nejprve si pečlivě zkontrolujte výplatní pásku",
        "Napište si, čemu nerozumíte",
        "Zeptejte se svého zaměstnavatele nebo HR",
        "Pokud problém trvá déle než jeden měsíc, kontaktujte koordinátora",
      ],
    },
    message: {
      en: "Good morning/afternoon. I would like to ask about my salary for this month. I think there might be a mistake. Can we check it together please?",
      cz: "Dobré ráno/odpoledne. Chtěl/a bych se zeptat na svůj plat za tento měsíc. Myslím, že by tam mohla být chyba. Můžeme to prosím spolu zkontrolovat?",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "asking-day-off",
    categoryId: "work",
    icon: "📅",
    title: { en: "Requesting a day off", cz: "Žádost o volno" },
    steps: {
      en: [
        "Request the day off as early as possible (days or weeks in advance)",
        "Explain the reason for your request",
        "Ask your supervisor or HR",
        "Wait for confirmation before making plans",
      ],
      cz: [
        "Požádejte o volno co nejdříve (dny nebo týdny předem)",
        "Vysvětlete důvod své žádosti",
        "Zeptejte se svého nadřízeného nebo HR",
        "Počkejte na potvrzení, než začnete plánovat",
      ],
    },
    message: {
      en: "Good morning/afternoon. I would like to request a day off on [date] because [reason]. Is this possible? Thank you.",
      cz: "Dobré ráno/odpoledne. Chtěl/a bych požádat o volno na [datum] z důvodu [důvod]. Je to možné? Děkuji.",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "overtime-query",
    categoryId: "work",
    icon: "🕐",
    title: { en: "Asking about overtime", cz: "Dotaz na přesčasy" },
    steps: {
      en: [
        "Ask your supervisor if overtime is available or required",
        "Confirm how the overtime will be paid",
        "Keep a record of your overtime hours",
      ],
      cz: [
        "Zeptejte se svého nadřízeného, zda jsou přesčasy k dispozici nebo vyžadovány",
        "Potvrďte, jak budou přesčasy zaplaceny",
        "Veďte si záznam o odpracovaných přesčasech",
      ],
    },
    message: {
      en: "Hello, I would like to ask about overtime. Is overtime available this week? And how is overtime paid? Thank you.",
      cz: "Dobrý den, chtěl/a bych se zeptat na přesčasy. Jsou tento týden přesčasy k dispozici? A jak se přesčasy platí? Děkuji.",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "workplace-issue",
    categoryId: "work",
    icon: "😕",
    title: { en: "Problem at work", cz: "Problém v práci" },
    steps: {
      en: [
        "Stay calm and professional",
        "Talk to your supervisor or HR about the issue",
        "Write down what happened",
        "If it is serious or continues, contact your coordinator",
      ],
      cz: [
        "Zachovejte klid a profesionalitu",
        "Promluvte si se svým nadřízeným nebo HR o problému",
        "Zapište si, co se stalo",
        "Pokud je to vážné nebo pokračuje, kontaktujte koordinátora",
      ],
    },
    message: {
      en: "Hello, I would like to talk about something that happened at work. Can we discuss it please?",
      cz: "Dobrý den, chtěl/a bych mluvit o tom, co se stalo v práci. Můžeme to prosím probrat?",
    },
    contactTo: "coordinator",
    reportCategory: "Work",
  },
  {
    id: "contract-query",
    categoryId: "work",
    icon: "📝",
    title: { en: "Question about contract", cz: "Dotaz ke smlouvě" },
    steps: {
      en: [
        "Read your contract carefully",
        "Write down specific questions or parts you do not understand",
        "Ask your employer or HR for clarification",
        "If you still have questions, send a copy to your coordinator",
      ],
      cz: [
        "Pečlivě si přečtěte svou smlouvu",
        "Napište si konkrétní otázky nebo části, kterým nerozumíte",
        "Požádejte svého zaměstnavatele nebo HR o vysvětlení",
        "Pokud máte stále otázky, pošlete kopii svému koordinátorovi",
      ],
    },
    message: {
      en: "Hello, I have a question about my contract. I do not understand point number [X]. Can you please explain it to me? Thank you.",
      cz: "Dobrý den, mám dotaz ke své smlouvě. Nerozumím bodu číslo [X]. Můžete mi to prosím vysvětlit? Děkuji.",
    },
    contactTo: "coordinator",
    reportCategory: "Work",
  },
  {
    id: "holiday-query",
    categoryId: "work",
    icon: "🌴",
    title: { en: "Asking about holiday / vacation", cz: "Dotaz na dovolenou" },
    steps: {
      en: [
        "Check your contract for holiday entitlement",
        "Request holiday in advance",
        "Agree with your employer on the dates",
        "Submit a written request if required",
      ],
      cz: [
        "Zkontrolujte si nárok na dovolenou ve smlouvě",
        "Požádejte o dovolenou s předstihem",
        "Domluvte se se zaměstnavatelem na termínu",
        "V případě potřeby podejte písemnou žádost",
      ],
    },
    message: {
      en: "Hello, I would like to apply for holiday from [start date] to [end date]. Is this possible? I have [X] days of holiday remaining. Thank you.",
      cz: "Dobrý den, chtěl/a bych požádat o dovolenou od [datum začátku] do [datum konce]. Je to možné? Zbývá mi [X] dní dovolené. Děkuji.",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },
  {
    id: "work-accident",
    categoryId: "work",
    icon: "⚠️",
    title: { en: "Accident at work", cz: "Pracovní úraz" },
    steps: {
      en: [
        "Get medical help immediately (call 112 if serious)",
        "Report the accident to your supervisor right away",
        "Write down what happened (date, time, how it happened)",
        "Visit a doctor and get a medical report",
        "Inform your coordinator about the accident",
      ],
      cz: [
        "Okamžitě vyhledejte lékařskou pomoc (v případě vážného zranění volejte 112)",
        "Nahlaste úraz svému nadřízenému ihned",
        "Zapište si, co se stalo (datum, čas, jak k úrazu došlo)",
        "Navštivte lékaře a nechte si vystavit lékařskou zprávu",
        "Informujte svého koordinátora o úrazu",
      ],
    },
    message: {
      en: "I had an accident at work today at [time]. I [describe injury]. I have reported it to my supervisor. I need to see a doctor.",
      cz: "Dnes v [čas] jsem měl/a úraz v práci. [Popis zranění]. Nahlásil/a jsem to svému nadřízenému. Potřebuji navštívit lékaře.",
    },
    contactTo: "coordinator",
    reportCategory: "Work",
  },
  {
    id: "break-time",
    categoryId: "work",
    icon: "☕",
    title: { en: "Asking about break time", cz: "Dotaz na přestávku" },
    steps: {
      en: [
        "Check your contract or workplace rules about breaks",
        "Ask your supervisor when you can take your break",
        "Take your break at the agreed time",
      ],
      cz: [
        "Zkontrolujte svou smlouvu nebo pracovní řád ohledně přestávek",
        "Zeptejte se svého nadřízeného, kdy si můžete vzít přestávku",
        "Vezměte si přestávku v dohodnutý čas",
      ],
    },
    message: {
      en: "Hello, when is the best time for me to take my break today?",
      cz: "Dobrý den, kdy je dnes nejlepší čas na mou přestávku?",
    },
    contactTo: "employer",
    reportCategory: "Work",
  },

  // ===== ACCOMMODATION =====
  {
    id: "heating-problem",
    categoryId: "accommodation",
    icon: "❄️",
    title: { en: "Heating not working", cz: "Nefunguje topení" },
    steps: {
      en: [
        "Check if the radiator valve is open and air is bled",
        "Tell your landlord or property manager immediately",
        "Take photos of the problem",
        "If not fixed within 24 hours, inform your coordinator",
      ],
      cz: [
        "Zkontrolujte, zda je ventil topení otevřený a zda je radiátor odvzdušněný",
        "Ihned informujte pronajímatele nebo správce",
        "Vyfoťte problém",
        "Pokud není opraveno do 24 hodin, informujte koordinátora",
      ],
    },
    message: {
      en: "Hello, the heating in my apartment is not working. It is very cold. Can you please send someone to check it? Thank you.",
      cz: "Dobrý den, v mém bytě nefunguje topení. Je mi velká zima. Můžete prosím poslat někoho na kontrolu? Děkuji.",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "water-problem",
    categoryId: "accommodation",
    icon: "💧",
    title: { en: "Water problem (no water / leak)", cz: "Problém s vodou (netěsnost / žádná voda)" },
    steps: {
      en: [
        "Check if the main water valve is open",
        "Tell your landlord immediately",
        "If there is a leak, try to stop it temporarily",
        "Take photos of the problem",
      ],
      cz: [
        "Zkontrolujte, zda je hlavní vodovodní ventil otevřený",
        "Ihned informujte pronajímatele",
        "Pokud dojde k úniku, zkuste jej dočasně zastavit",
        "Vyfoťte problém",
      ],
    },
    message: {
      en: "Hello, there is a problem with the water in my apartment. [No water / Water is leaking]. Can you please help?",
      cz: "Dobrý den, mám problém s vodou v bytě. [Netéká voda / Uniká voda]. Můžete prosím pomoci?",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "electricity-problem",
    categoryId: "accommodation",
    icon: "⚡",
    title: { en: "Electricity problem (power outage)", cz: "Problém s elektřinou (výpadek)" },
    steps: {
      en: [
        "Check if the main circuit breaker is tripped",
        "Check if the problem is only in your apartment or building-wide",
        "If building-wide, contact the building manager",
        "If only your apartment, contact your landlord",
        "If there is no power at all, call emergency services if needed",
      ],
      cz: [
        "Zkontrolujte, zda není vyhozený hlavní jistič",
        "Zkontrolujte, zda je problém jen ve vašem bytě nebo v celém domě",
        "Pokud je problém v celém domě, kontaktujte správce budovy",
        "Pokud jen ve vašem bytě, kontaktujte pronajímatele",
        "Pokud není elektřina vůbec, v případě potřeby zavolejte záchrannou službu",
      ],
    },
    message: {
      en: "Hello, there is no electricity in my apartment. I checked the circuit breaker. Can you please send someone to check it?",
      cz: "Dobrý den, v mém bytě není elektřina. Zkontroloval/a jsem jistič. Můžete prosím poslat někoho na kontrolu?",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "lost-keys",
    categoryId: "accommodation",
    icon: "🔑",
    title: { en: "Lost keys", cz: "Ztráta klíčů" },
    steps: {
      en: [
        "Check all your bags and pockets first",
        "Tell your landlord or property manager immediately",
        "Arrange for a locksmith if necessary",
        "Ask for a spare key if available",
      ],
      cz: [
        "Nejprve zkontrolujte všechny tašky a kapsy",
        "Ihned informujte pronajímatele nebo správce",
        "V případě potřeby zajistěte zámečníka",
        "Požádejte o náhradní klíč, pokud je k dispozici",
      ],
    },
    message: {
      en: "Hello, I lost my keys. I cannot get into the apartment. Can you please help me?",
      cz: "Dobrý den, ztratil/a jsem klíče. Nemohu se dostat do bytu. Můžete mi prosím pomoci?",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "roommate-issue",
    categoryId: "accommodation",
    icon: "👥",
    title: { en: "Problem with roommate", cz: "Problém se spolubydlícím" },
    steps: {
      en: [
        "Talk to your roommate calmly about the issue first",
        "If it does not help, tell your landlord or coordinator",
        "Do not argue or fight - stay calm",
        "If it becomes serious, ask for a room change",
      ],
      cz: [
        "Nejprve si v klidu promluvte se spolubydlícím o problému",
        "Pokud to nepomůže, řekněte to pronajímateli nebo koordinátorovi",
        "Nehádejte se ani nebojujte - zachovejte klid",
        "Pokud se to zhorší, požádejte o změnu pokoje",
      ],
    },
    message: {
      en: "Hello, I have a problem with my roommate. Can we talk about it? I would like to find a solution.",
      cz: "Dobrý den, mám problém se svým spolubydlícím. Můžeme si o tom promluvit? Rád/a bych našel/našla řešení.",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "repair-needed",
    categoryId: "accommodation",
    icon: "🔧",
    title: { en: "Something needs repair", cz: "Potřeba opravy" },
    steps: {
      en: [
        "Describe what is broken clearly",
        "Take photos of the damage",
        "Tell your landlord or property manager",
        "Follow up if the repair is not done within a reasonable time",
      ],
      cz: [
        "Jasně popište, co je rozbité",
        "Vyfoťte poškození",
        "Informujte pronajímatele nebo správce",
        "Připomeňte se, pokud oprava nebude provedena v přiměřené době",
      ],
    },
    message: {
      en: "Hello, [item] in my apartment is broken / not working. Can you please send someone to repair it? Here is a photo.",
      cz: "Dobrý den, [věc] v mém bytě je rozbitá / nefunguje. Můžete prosím poslat někoho na opravu? Přikládám fotografii.",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "internet-problem",
    categoryId: "accommodation",
    icon: "📶",
    title: { en: "Internet not working", cz: "Ne funguje internet" },
    steps: {
      en: [
        "Restart the router (unplug for 10 seconds, plug back in)",
        "Check if other devices can connect",
        "If still not working, contact your landlord or internet provider",
        "If you need internet urgently, ask your coordinator for help",
      ],
      cz: [
        "Restartujte router (odpojte na 10 sekund, znovu zapojte)",
        "Zkontrolujte, zda se mohou připojit jiná zařízení",
        "Pokud stále nefunguje, kontaktujte pronajímatele nebo poskytovatele internetu",
        "Pokud naléhavě potřebujete internet, požádejte koordinátora o pomoc",
      ],
    },
    message: {
      en: "Hello, my internet is not working. I restarted the router but it still does not work. Can you help?",
      cz: "Dobrý den, nefunguje mi internet. Restartoval/a jsem router, ale stále to nefunguje. Můžete pomoci?",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },
  {
    id: "moving-out",
    categoryId: "accommodation",
    icon: "📦",
    title: { en: "Moving out notification", cz: "Oznámení o odstěhování" },
    steps: {
      en: [
        "Check your contract for notice period (usually 30 days)",
        "Inform your landlord or property manager in writing",
        "Clean the apartment before you leave",
        "Arrange for the return of your deposit",
      ],
      cz: [
        "Zkontrolujte výpovědní lhůtu ve smlouvě (obvykle 30 dní)",
        "Písemně informujte pronajímatele nebo správce",
        "Před odchodem byt uklidte",
        "Domluvte se na vrácení kauce",
      ],
    },
    message: {
      en: "Hello, I would like to inform you that I will be moving out on [date]. My notice period is [X] days. Thank you for everything.",
      cz: "Dobrý den, chtěl/a bych vás informovat, že se odstěhuji dne [datum]. Moje výpovědní lhůta je [X] dní. Děkuji za vše.",
    },
    contactTo: "coordinator",
    reportCategory: "Accommodation",
  },

  // ===== BANK =====
  {
    id: "open-account",
    categoryId: "bank",
    icon: "🏦",
    title: { en: "Opening a bank account", cz: "Založení bankovního účtu" },
    steps: {
      en: [
        "Choose a bank (AirBank, Česká spořitelna, ČSOB, KB, etc.)",
        "Bring your passport and employee card to the bank branch",
        "Ask for a standard current account (běžný účet)",
        "Some banks allow online application if you have a Czech phone number",
        "In 3-5 working days you will receive your card and online banking details",
      ],
      cz: [
        "Vyberte si banku (AirBank, Česká spořitelna, ČSOB, KB atd.)",
        "Vezměte si pas a zaměstnaneckou kartu na pobočku banky",
        "Požádejte o běžný účet",
        "Některé banky umožňují online žádost, pokud máte české telefonní číslo",
        "Do 3-5 pracovních dnů obdržíte kartu a přístup do internetového bankovnictví",
      ],
    },
    message: {
      en: "Good morning/afternoon. I would like to open a standard bank account, please. I have my passport and employee card with me.",
      cz: "Dobré ráno/odpoledne. Chtěl/a bych si založit běžný bankovní účet. Mám s sebou pas a zaměstnaneckou kartu.",
    },
    contactTo: "coordinator",
    reportCategory: "Bank",
  },
  {
    id: "atm-card-problem",
    categoryId: "bank",
    icon: "💳",
    title: { en: "ATM card not working", cz: "Platební karta nefunguje" },
    steps: {
      en: [
        "Check if the card is expired (date on the front)",
        "Check your account balance - you may have reached your limit",
        "Try a different ATM machine",
        "If still not working, call your bank or visit a branch",
      ],
      cz: [
        "Zkontrolujte, zda karta není prošlá (datum na přední straně)",
        "Zkontrolujte zůstatek na účtu - mohli jste dosáhnout limitu",
        "Zkuste jiný bankomat",
        "Pokud stále nefunguje, zavolejte do banky nebo navštivte pobočku",
      ],
    },
    message: {
      en: "Hello, my bank card is not working at the ATM. Can you help me check what is wrong?",
      cz: "Dobrý den, moje bankovní karta nefunguje v bankomatu. Můžete mi pomoci zjistit, co je špatně?",
    },
    contactTo: "coordinator",
    reportCategory: "Bank",
  },
  {
    id: "send-money-ph",
    categoryId: "bank",
    icon: "💸",
    title: { en: "Sending money to Philippines", cz: "Posílání peněz na Filipíny" },
    steps: {
      en: [
        "You can use your bank's international transfer service",
        "Or use a money transfer service like Western Union, MoneyGram, or Wise",
        "You will need the recipient's full name, address, and bank account details",
        "Compare fees - Wise and similar apps are often cheaper than banks",
      ],
      cz: [
        "Můžete využít mezinárodní převod z banky",
        "Nebo použít službu jako Western Union, MoneyGram nebo Wise",
        "Budete potřebovat celé jméno, adresu a údaje o bankovním účtu příjemce",
        "Porovnejte poplatky - Wise a podobné aplikace jsou často levnější než banky",
      ],
    },
    message: {
      en: "Hello, I would like to send money to the Philippines. What is the best and cheapest way to do this?",
      cz: "Dobrý den, chtěl/a bych poslat peníze na Filipíny. Jaký je nejlepší a nejlevnější způsob?",
    },
    contactTo: "coordinator",
    reportCategory: "Bank",
  },
  {
    id: "lost-bank-card",
    categoryId: "bank",
    icon: "🪪",
    title: { en: "Lost bank card", cz: "Ztráta bankovní karty" },
    steps: {
      en: [
        "Block the card immediately - call your bank's emergency number",
        "The bank will issue a replacement card within 5-7 working days",
        "Check your account for any unauthorized transactions",
        "Inform your coordinator about the lost card",
      ],
      cz: [
        "Okamžitě zablokujte kartu - zavolejte na nouzovou linku banky",
        "Banka vydá novou kartu do 5-7 pracovních dnů",
        "Zkontrolujte účet na neoprávněné transakce",
        "Informujte koordinátora o ztrátě karty",
      ],
    },
    message: {
      en: "Hello, I lost my bank card. I have already blocked it. What do I need to do to get a new card?",
      cz: "Dobrý den, ztratil/a jsem bankovní kartu. Už jsem ji zablokoval/a. Co musím udělat pro získání nové karty?",
    },
    contactTo: "coordinator",
    reportCategory: "Bank",
  },
  {
    id: "online-banking-help",
    categoryId: "bank",
    icon: "📱",
    title: { en: "Online banking help", cz: "Pomoc s internetovým bankovnictvím" },
    steps: {
      en: [
        "Download your bank's official app from the App Store or Google Play",
        "Register using your account number and personal information",
        "You will receive an activation code by SMS or post",
        "Follow the app instructions to set up your login",
        "If you get stuck, visit your bank branch for help",
      ],
      cz: [
        "Stáhněte si oficiální aplikaci vaší banky z App Store nebo Google Play",
        "Zaregistrujte se pomocí čísla účtu a osobních údajů",
        "Obdržíte aktivační kód SMS nebo poštou",
        "Postupujte podle pokynů v aplikaci pro nastavení přihlášení",
        "Pokud si nevíte rady, navštivte pobočku banky",
      ],
    },
    message: {
      en: "Hello, I am having trouble setting up my online banking. Can you help me with the steps?",
      cz: "Dobrý den, mám potíže s nastavením internetového bankovnictví. Můžete mi pomoci s postupem?",
    },
    contactTo: "coordinator",
    reportCategory: "Bank",
  },

  // ===== DOCTOR / HEALTH =====
  {
    id: "need-doctor",
    categoryId: "doctor",
    icon: "🩺",
    title: { en: "Need to see a doctor", cz: "Potřeba navštívit lékaře" },
    steps: {
      en: [
        "Find a general practitioner (praktický lékař) near you",
        "Call to make an appointment (objednání)",
        "Bring your passport, employee card, and health insurance card",
        "Explain your symptoms to the doctor",
        "If urgent, go to the emergency department (pohotovost)",
      ],
      cz: [
        "Najděte praktického lékaře ve svém okolí",
        "Zavolejte a objednejte se",
        "Vezměte si pas, zaměstnaneckou kartu a kartičku zdravotní pojišťovny",
        "Popište lékaři své příznaky",
        "V naléhavém případě jděte na pohotovost",
      ],
    },
    message: {
      en: "Hello, I need to see a doctor. I have [symptoms]. Can you help me make an appointment?",
      cz: "Dobrý den, potřebuji navštívit lékaře. Mám [příznaky]. Můžete mi pomoci s objednáním?",
    },
    contactTo: "coordinator",
    reportCategory: "Health",
  },
  {
    id: "emergency-room",
    categoryId: "doctor",
    icon: "🚑",
    title: { en: "Emergency room", cz: "Pohotovost" },
    steps: {
      en: [
        "If it is life-threatening, call 112 immediately",
        "Go to the nearest hospital emergency department",
        "Bring your passport and health insurance card",
        "Tell the receptionist your symptoms",
        "If you need an ambulance, call 155 (medical emergency)",
      ],
      cz: [
        "Pokud jde o ohrožení života, okamžitě volejte 112",
        "Jděte na nejbližší oddělení urgentního příjmu v nemocnici",
        "Vezměte si pas a kartičku zdravotní pojišťovny",
        "Řekněte recepční, jaké máte příznaky",
        "Pokud potřebujete sanitku, volejte 155 (lékařská pohotovost)",
      ],
    },
    message: {
      en: "I need to go to the emergency room. I have [symptoms]. Where is the nearest hospital?",
      cz: "Potřebuji jít na pohotovost. Mám [příznaky]. Kde je nejbližší nemocnice?",
    },
    contactTo: "emergency",
    reportCategory: "Health",
  },
  {
    id: "dentist",
    categoryId: "doctor",
    icon: "🦷",
    title: { en: "Dentist appointment", cz: "Zubař" },
    steps: {
      en: [
        "Find a dentist (zubní lékař) near you",
        "Call and make an appointment",
        "In an emergency, ask for an urgent appointment",
        "Bring your health insurance card",
      ],
      cz: [
        "Najděte zubaře ve svém okolí",
        "Zavolejte a objednejte se",
        "V naléhavém případě požádejte o neodkladnou péči",
        "Vezměte si kartičku zdravotní pojišťovny",
      ],
    },
    message: {
      en: "Hello, I need to see a dentist. I have a toothache. Can you help me find a dentist near me?",
      cz: "Dobrý den, potřebuji k zubaři. Bolí mě zub. Můžete mi pomoci najít zubaře v okolí?",
    },
    contactTo: "coordinator",
    reportCategory: "Health",
  },
  {
    id: "pharmacy",
    categoryId: "doctor",
    icon: "💊",
    title: { en: "Pharmacy - need medicine", cz: "Lékárna - potřebuji lék" },
    steps: {
      en: [
        "Go to a pharmacy (lékárna) - look for a green cross sign",
        "Tell the pharmacist what you need or show them your prescription",
        "Some medicines require a prescription from a doctor",
        "Pharmacies are usually open Mon-Fri 8:00-18:00, some are 24h",
      ],
      cz: [
        "Jděte do lékárny - hledejte zelený kříž",
        "Řekněte lékárníkovi, co potřebujete, nebo ukažte recept",
        "Některé léky jsou pouze na předpis od lékaře",
        "Lékárny jsou obvykle otevřeny Po-Pá 8:00-18:00, některé jsou 24h",
      ],
    },
    message: {
      en: "Hello, I need to buy medicine. I have a prescription from the doctor. Where is the nearest pharmacy?",
      cz: "Dobrý den, potřebuji koupit lék. Mám recept od lékaře. Kde je nejbližší lékárna?",
    },
    contactTo: "coordinator",
    reportCategory: "Health",
  },
  {
    id: "sick-leave",
    categoryId: "doctor",
    icon: "📄",
    title: { en: "Sick leave certificate", cz: "Neschopenka" },
    steps: {
      en: [
        "Visit a doctor and explain that you cannot work due to illness",
        "The doctor will issue a sick leave certificate (neschopenka)",
        "Send the certificate to your employer immediately",
        "Follow the doctor's instructions for how long to rest",
        "If you need more days, visit the doctor again for an extension",
      ],
      cz: [
        "Navštivte lékaře a vysvětlete, že nemůžete pracovat kvůli nemoci",
        "Lékař vystaví neschopenku",
        "Ihned pošlete potvrzení zaměstnavateli",
        "Dodržujte pokyny lékaře ohledně doby odpočinku",
        "Pokud potřebujete více dní, navštivte lékaře znovu pro prodloužení",
      ],
    },
    message: {
      en: "Hello, I visited the doctor today. I have a sick leave certificate from [date] to [date]. I am sending it to you now.",
      cz: "Dobrý den, dnes jsem navštívil/a lékaře. Mám neschopenku od [datum] do [datum]. Posílám vám ji. ",
    },
    contactTo: "coordinator",
    reportCategory: "Health",
  },

  // ===== IMMIGRATION =====
  {
    id: "ec-application",
    categoryId: "immigration",
    icon: "📋",
    title: { en: "Employee card application", cz: "Žádost o zaměstnaneckou kartu" },
    steps: {
      en: [
        "Your employer registers the position at the Labour Office",
        "Prepare all required documents (passport, contract, accommodation proof, etc.)",
        "Get an Apostille from DFA for Philippine documents if needed",
        "Submit your application at the Czech Embassy in Manila",
        "Wait for processing (60-90 days)",
      ],
      cz: [
        "Zaměstnavatel zaregistruje pozici na Úřadu práce",
        "Připravte všechny potřebné dokumenty (pas, smlouva, doklad o ubytování atd.)",
        "V případě potřeby nechte filipínské dokumenty opatřit Apostilou na DFA",
        "Podejte žádost na České ambasádě v Manile",
        "Počkejte na vyřízení (60-90 dní)",
      ],
    },
    message: {
      en: "Hello, I would like to start my employee card application. What documents do I need to prepare and what is the first step?",
      cz: "Dobrý den, chtěl/a bych zahájit žádost o zaměstnaneckou kartu. Jaké dokumenty potřebuji připravit a jaký je první krok?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "ec-renewal",
    categoryId: "immigration",
    icon: "🔄",
    title: { en: "Employee card renewal", cz: "Prodloužení zaměstnanecké karty" },
    steps: {
      en: [
        "Apply for renewal up to 120 days before the card expires",
        "Prepare the same documents as for the first application",
        "Submit at OAMP in the Czech Republic",
        "Processing time is usually 30-60 days",
      ],
      cz: [
        "Požádejte o prodloužení až 120 dní před vypršením platnosti karty",
        "Připravte stejné dokumenty jako při první žádosti",
        "Podání na OAMP v České republice",
        "Doba vyřízení je obvykle 30-60 dní",
      ],
    },
    message: {
      en: "Hello, my employee card expires on [date]. I would like to renew it. What do I need to do?",
      cz: "Dobrý den, moje zaměstnanecká karta končí [datum]. Chtěl/a bych ji prodloužit. Co musím udělat?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "lost-ec",
    categoryId: "immigration",
    icon: "🆔",
    title: { en: "Lost employee card", cz: "Ztráta zaměstnanecké karty" },
    steps: {
      en: [
        "Report the loss to the police immediately",
        "Get a police report about the loss",
        "Contact your coordinator - they will help you apply for a replacement",
        "Visit OAMP to apply for a duplicate card",
        "The fee for a duplicate card is 1,000 CZK",
      ],
      cz: [
        "Ihned nahlaste ztrátu na policii",
        "Získejte policejní protokol o ztrátě",
        "Kontaktujte svého koordinátora - pomůže vám s žádostí o náhradu",
        "Navštivte OAMP a požádejte o duplikát karty",
        "Poplatek za duplikát karty je 1 000 Kč",
      ],
    },
    message: {
      en: "Hello, I lost my employee card. I have already reported it to the police. What do I need to do next to get a new card?",
      cz: "Dobrý den, ztratil/a jsem zaměstnaneckou kartu. Už jsem to nahlásil/a na policii. Co musím udělat pro získání nové karty?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "address-change",
    categoryId: "immigration",
    icon: "📍",
    title: { en: "Reporting address change", cz: "Hlášení změny adresy" },
    steps: {
      en: [
        "Report any change of address within 3 working days",
        "Visit the Foreign Police department (cizinecká policie)",
        "Bring your passport and employee card",
        "Bring proof of new accommodation (contract, letter from landlord)",
        "You must report changes even within the same city",
      ],
      cz: [
        "Jakoukoli změnu adresy nahlaste do 3 pracovních dnů",
        "Navštivte cizineckou policii",
        "Vezměte si pas a zaměstnaneckou kartu",
        "Vezměte si doklad o novém ubytování (smlouvu, potvrzení od pronajímatele)",
        "Změny musíte hlásit i v rámci stejného města",
      ],
    },
    message: {
      en: "Hello, I have moved to a new address. I need to report the change to the Foreign Police. Can you help me with the process?",
      cz: "Dobrý den, přestěhoval/a jsem se na novou adresu. Potřebuji nahlásit změnu na cizinecké policii. Můžete mi pomoci s procesem?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "biometrics-appointment",
    categoryId: "immigration",
    icon: "✋",
    title: { en: "Biometrics appointment", cz: "Schůzka pro biometrii" },
    steps: {
      en: [
        "Wait for the invitation from OAMP",
        "Visit the OAMP office on the scheduled date and time",
        "Bring your passport and employment contract",
        "They will take your fingerprints and photo",
        "Pay the fee of 2,500 CZK",
      ],
      cz: [
        "Počkejte na pozvánku z OAMP",
        "Navštivte úřad OAMP v dohodnutém termínu",
        "Vezměte si pas a pracovní smlouvu",
        "Budou vám sejmuty otisky prstů a pořízena fotografie",
        "Zaplaťte poplatek 2 500 Kč",
      ],
    },
    message: {
      en: "Hello, I received an invitation for my biometric appointment at OAMP on [date]. What do I need to bring with me?",
      cz: "Dobrý den, dostal/a jsem pozvánku na biometrii na OAMP na [datum]. Co si mám vzít s sebou?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "collect-ec",
    categoryId: "immigration",
    icon: "🎫",
    title: { en: "Collecting employee card", cz: "Vy zvednutí zaměstnanecké karty" },
    steps: {
      en: [
        "Wait for the SMS or letter from OAMP that your card is ready",
        "Visit the OAMP office in person (you cannot send someone else)",
        "Bring your passport",
        "Check that all information on the card is correct",
        "The card is usually ready within 30 days after biometrics",
      ],
      cz: [
        "Počkejte na SMS nebo dopis z OAMP, že je karta připravena",
        "Navštivte úřad OAMP osobně (nemůžete poslat někoho jiného)",
        "Vezměte si pas",
        "Zkontrolujte, zda jsou všechny údaje na kartě správné",
        "Karta je obvykle připravena do 30 dnů po biometrii",
      ],
    },
    message: {
      en: "Hello, I received a notification that my employee card is ready. Where and when can I pick it up?",
      cz: "Dobrý den, dostal/a jsem oznámení, že je moje zaměstnanecká karta připravena. Kde a kdy si ji mohu vyzvednout?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "foreign-police-registration",
    categoryId: "immigration",
    icon: "🏛️",
    title: { en: "Foreign Police registration", cz: "Registrace na cizinecké policii" },
    steps: {
      en: [
        "Register within 3 working days after arriving in Czech Republic",
        "Visit the Foreign Police department (cizinecká policie)",
        "Bring your passport with D/VR visa",
        "Bring proof of accommodation",
        "You will receive a confirmation of registered residence",
      ],
      cz: [
        "Zaregistrujte se do 3 pracovních dnů po příjezdu do České republiky",
        "Navštivte cizineckou policii",
        "Vezměte si pas s vízem D/VR",
        "Vezměte si doklad o ubytování",
        "Obdržíte potvrzení o registraci pobytu",
      ],
    },
    message: {
      en: "Hello, I just arrived in Czech Republic. I need to register at the Foreign Police. Where is the nearest office and what do I need to bring?",
      cz: "Dobrý den, právě jsem přijel/a do České republiky. Potřebuji se zaregistrovat na cizinecké policii. Kde je nejbližší úřad a co si mám vzít s sebou?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },
  {
    id: "oamp-appointment",
    categoryId: "immigration",
    icon: "📅",
    title: { en: "OAMP appointment", cz: "Schůzka na OAMP" },
    steps: {
      en: [
        "You usually need to book an appointment online",
        "Bring your passport, employee card, and all relevant documents",
        "Arrive on time or 15 minutes early",
        "If you cannot attend, cancel and reschedule at least 24 hours before",
      ],
      cz: [
        "Obvykle je nutné se objednat online",
        "Vezměte si pas, zaměstnaneckou kartu a všechny relevantní dokumenty",
        "Přijďte včas nebo 15 minut předem",
        "Pokud se nemůžete dostavit, zrušte a přeobjednejte se alespoň 24 hodin předem",
      ],
    },
    message: {
      en: "Hello, I have an appointment at OAMP on [date] at [time]. What documents should I bring with me?",
      cz: "Dobrý den, mám schůzku na OAMP dne [datum] v [čas]. Jaké dokumenty si mám vzít s sebou?",
    },
    contactTo: "coordinator",
    reportCategory: "Immigration",
  },

  // ===== TRANSPORT =====
  {
    id: "buy-ticket",
    categoryId: "transport",
    icon: "🎫",
    title: { en: "Buying a transport ticket", cz: "Koupení jízdenky" },
    steps: {
      en: [
        "You can buy tickets at ticket machines (most stops have them)",
        "Or use mobile apps like PID Lítačka or ČD Můj vlak",
        "At a ticket machine - select your destination zone, pay by card or cash",
        "Validate your ticket before you board (stamp it in the machine)",
        "Always keep your ticket with you during the journey",
      ],
      cz: [
        "Jízdenky lze koupit v automatech (většina zastávek je má)",
        "Nebo použijte mobilní aplikace jako PID Lítačka nebo ČD Můj vlak",
        "V automatu - vyberte cílovou zónu, zaplaťte kartou nebo hotově",
        "Označte jízdenku před nástupem (vložte do označovacího strojku)",
        "Během cesty mějte jízdenku vždy u sebe",
      ],
    },
    message: {
      en: "Hello, I need to buy a ticket for public transport. How do I buy a ticket from the machine?",
      cz: "Dobrý den, potřebuji si koupit jízdenku na veřejnou dopravu. Jak koupím jízdenku z automatu?",
    },
    contactTo: "coordinator",
    reportCategory: "Transport",
  },
  {
    id: "lost-ticket",
    categoryId: "transport",
    icon: "🎟️",
    title: { en: "Lost transport ticket / pass", cz: "Ztráta jízdenky / průkazu" },
    steps: {
      en: [
        "If you bought a single ticket and lost it, you need a new one",
        "If you have a long-term pass (Lítačka), contact the transport company",
        "You can get a replacement Lítačka card at a Customer Service Center",
        "If you are caught without a valid ticket, you will get a fine (1,000+ CZK)",
      ],
      cz: [
        "Pokud jste ztratil/a jednorázovou jízdenku, kupte si novou",
        "Pokud máte dlouhodobý kupón (Lítačka), kontaktujte dopravní podnik",
        "Náhradní kartu Lítačka můžete získat v zákaznickém centru",
        "Pokud vás chytí bez platné jízdenky, dostanete pokutu (1 000+ Kč)",
      ],
    },
    message: {
      en: "Hello, I lost my Lítačka / transport pass. How do I get a replacement?",
      cz: "Dobrý den, ztratil/a jsem Lítačku / průkazku na dopravu. Jak získám náhradu?",
    },
    contactTo: "coordinator",
    reportCategory: "Transport",
  },
  {
    id: "missed-bus",
    categoryId: "transport",
    icon: "🏃",
    title: { en: "Missed my bus / train", cz: "Zmeškal/a jsem autobus / vlak" },
    steps: {
      en: [
        "Stay calm - the next bus/train will come (check the schedule)",
        "Use the PID Lítačka app or Google Maps to find the next connection",
        "Inform your employer if you will be late for work",
        "Your single ticket is usually valid for a certain time - you can use the next one",
      ],
      cz: [
        "Zachovejte klid - další autobus/vlak přijede (zkontrolujte jízdní řád)",
        "Použijte aplikaci PID Lítačka nebo Google Maps pro další spojení",
        "Informujte zaměstnavatele, pokud budete mít zpoždění do práce",
        "Jednorázová jízdenka obvykle platí určitou dobu - můžete použít další spoj",
      ],
    },
    message: {
      en: "Hello, I missed my bus. I will be late for work. The next bus arrives at [time]. Sorry for the delay.",
      cz: "Dobrý den, zmeškal/a jsem autobus. Budu mít zpoždění do práce. Další autobus přijede v [čas]. Omlouvám se za zpoždění.",
    },
    contactTo: "employer",
    reportCategory: "Transport",
  },
  {
    id: "directions",
    categoryId: "transport",
    icon: "🗺️",
    title: { en: "Need directions", cz: "Potřebuji navigaci" },
    steps: {
      en: [
        "Use Google Maps or Mapy.cz - enter your destination address",
        "Select public transport option to see bus/train connections",
        "The app will show you which stop to get off at and any transfers",
        "If you get lost, ask a passerby or transport staff for help",
      ],
      cz: [
        "Použijte Google Maps nebo Mapy.cz - zadejte cílovou adresu",
        "Vyberte možnost veřejné dopravy pro zobrazení spojů",
        "Aplikace ukáže, na které zastávce vystoupit a případné přestupy",
        "Pokud se ztratíte, zeptejte se kolemjdoucích nebo personálu dopravy",
      ],
    },
    message: {
      en: "Hello, I am lost. I need to get to [address]. Can you help me find the right bus/train?",
      cz: "Dobrý den, ztratil/a jsem se. Potřebuji se dostat na [adresa]. Můžete mi pomoci najít správný autobus/vlak?",
    },
    contactTo: "coordinator",
    reportCategory: "Transport",
  },
  {
    id: "ticket-inspection",
    categoryId: "transport",
    icon: "👮",
    title: { en: "Ticket inspection", cz: "Kontrola jízdenky" },
    steps: {
      en: [
        "When inspectors board, show them your ticket or pass calmly",
        "If you have a valid ticket, you have nothing to worry about",
        "If you do not have a valid ticket, they will issue a fine (1,000-1,500 CZK)",
        "You must pay the fine within 15 days",
        "Always keep your ticket until you exit the transport system",
      ],
      cz: [
        "Když nastoupí revizoři, v klidu jim ukažte jízdenku nebo průkazku",
        "Pokud máte platnou jízdenku, nemusíte se ničeho bát",
        "Pokud nemáte platnou jízdenku, dostanete pokutu (1 000-1 500 Kč)",
        "Pokutu musíte zaplatit do 15 dnů",
        "Jízdenku si vždy schovávejte až do opuštění dopravního systému",
      ],
    },
    message: {
      en: "I was checked by a ticket inspector. I have a valid ticket / I did not have a valid ticket and received a fine. Can you help me with the next steps?",
      cz: "Byl/a jsem zkontrolován/a revizorem. Mám platnou jízdenku / Neměl/a jsem platnou jízdenku a dostal/a jsem pokutu. Můžete mi pomoci s dalšími kroky?",
    },
    contactTo: "coordinator",
    reportCategory: "Transport",
  },

  // ===== OTHER =====
  {
    id: "sim-card",
    categoryId: "other",
    icon: "📱",
    title: { en: "Getting a SIM card", cz: "Získání SIM karty" },
    steps: {
      en: [
        "You need your passport to buy a SIM card",
        "Go to any mobile operator store (T-Mobile, Vodafone, O2)",
        "Choose a prepaid card (předplacená karta) or a monthly plan",
        "The staff will help you activate it",
        "You will have a Czech phone number immediately",
      ],
      cz: [
        "K nákupu SIM karty potřebujete pas",
        "Jděte do kteréhokoli obchodu mobilního operátora (T-Mobile, Vodafone, O2)",
        "Vyberte si předplacenou kartu nebo měsíční tarif",
        "Personál vám pomůže s aktivací",
        "Okamžitě budete mít české telefonní číslo",
      ],
    },
    message: {
      en: "Hello, I need to get a Czech SIM card. Where is the nearest mobile shop and what do I need to bring?",
      cz: "Dobrý den, potřebuji získat českou SIM kartu. Kde je nejbližší prodejce a co potřebuji?",
    },
    contactTo: "coordinator",
    reportCategory: "Other",
  },
  {
    id: "internet-at-home",
    categoryId: "other",
    icon: "🌐",
    title: { en: "Setting up internet at home", cz: "Zřízení internetu doma" },
    steps: {
      en: [
        "Ask your landlord if internet is already available",
        "If not, choose a provider (T-Mobile, Vodafone, O2)",
        "Contact the provider to sign up for a plan",
        "A technician will come to install it (usually within 1 week)",
        "Mobile internet (4G/5G) is often faster to set up",
      ],
      cz: [
        "Zeptejte se pronajímatele, zda je internet již k dispozici",
        "Pokud ne, vyberte si poskytovatele (T-Mobile, Vodafone, O2)",
        "Kontaktujte poskytovatele a sjednejte tarif",
        "Technik přijede nainstalovat (obvykle do 1 týdne)",
        "Mobilní internet (4G/5G) je často rychlejší na zřízení",
      ],
    },
    message: {
      en: "Hello, I need to set up internet in my apartment. Which provider do you recommend and how do I sign up?",
      cz: "Dobrý den, potřebuji zřídit internet v bytě. Kterého operátora doporučujete a jak se přihlásím?",
    },
    contactTo: "coordinator",
    reportCategory: "Other",
  },
  {
    id: "tax-return",
    categoryId: "other",
    icon: "🧾",
    title: { en: "Tax return help", cz: "Pomoc s daňovým přiznáním" },
    steps: {
      en: [
        "As an employee, your employer usually does the annual tax return",
        "If you need to do it yourself, you can get help from a tax advisor",
        "The tax deadline is usually March or April each year",
        "You can also use a free tax filing service (Úřad práce has information)",
      ],
      cz: [
        "Jako zaměstnanec za vás obvykle dělá roční zúčtování daní zaměstnavatel",
        "Pokud to potřebujete udělat sami, můžete využít daňového poradce",
        "Termín pro podání daní je obvykle březen nebo duben každého roku",
        "Můžete také využít bezplatnou službu podání daní",
      ],
    },
    message: {
      en: "Hello, I have questions about my tax return. Do I need to file it myself or does my employer handle it?",
      cz: "Dobrý den, mám otázky ohledně daňového přiznání. Musím ho podat sám/sama nebo ho vyřizuje zaměstnavatel?",
    },
    contactTo: "coordinator",
    reportCategory: "Other",
  },
  {
    id: "health-insurance",
    categoryId: "other",
    icon: "🛡️",
    title: { en: "Health insurance question", cz: "Dotaz na zdravotní pojištění" },
    steps: {
      en: [
        "All employees in CZ must have public health insurance",
        "Your employer registers you with a health insurance company",
        "You will receive a health insurance card in the mail",
        "If you lose it, contact your insurance company for a replacement",
        "Doctor visits and most treatments are free / covered by insurance",
      ],
      cz: [
        "Všichni zaměstnanci v ČR musí mít veřejné zdravotní pojištění",
        "Zaměstnavatel vás přihlásí u zdravotní pojišťovny",
        "Kartičku pojištění obdržíte poštou",
        "Pokud ji ztratíte, kontaktujte pojišťovnu pro náhradu",
        "Návštěvy lékaře a většina léčby je zdarma / hrazena pojištěním",
      ],
    },
    message: {
      en: "Hello, I have questions about my health insurance. Which insurance company am I registered with and how do I get my card?",
      cz: "Dobrý den, mám otázky ohledně svého zdravotního pojištění. U které pojišťovny jsem registrován/a a jak získám kartičku?",
    },
    contactTo: "coordinator",
    reportCategory: "Other",
  },
]

export function getSituationsByCategory(categoryId: string): Situation[] {
  return situations.filter((s) => s.categoryId === categoryId)
}

export function getSituation(id: string): Situation | undefined {
  return situations.find((s) => s.id === id)
}
