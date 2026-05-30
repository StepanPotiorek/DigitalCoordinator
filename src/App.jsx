import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [completedOnboardingItems, setCompletedOnboardingItems] = useState([]);
  const [selectedHelp, setSelectedHelp] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const cards = [
    {
      title: "Automated Onboarding",
      text: "Workers receive step-by-step guidance without waiting for manual answers.",
    },
    {
      title: "Self-Service FAQ",
      text: "Common questions are answered directly inside the system.",
    },
    {
      title: "Accommodation Info",
      text: "Workers can find address, rules, contacts, and important housing details.",
    },
    {
      title: "Bank & SIM Guidance",
      text: "The system explains basic steps for bank account and SIM card setup.",
    },
    {
      title: "Issue Reporting",
      text: "Workers report problems through a structured form instead of random messages.",
    },
    {
      title: "Coordinator Dashboard",
      text: "You focus only on important cases while the system handles repeated questions.",
    },
  ];

  const onboardingSteps = [
    "Worker registration completed",
    "Accommodation information confirmed",
    "SIM card guidance reviewed",
    "Bank account guidance reviewed",
    "First day at work instructions reviewed",
    "Emergency contacts saved",
  ];

  function toggleStep(step) {
    setCompletedSteps((prev) =>
      prev.includes(step)
        ? prev.filter((item) => item !== step)
        : [...prev, step]
    );
  }

  function toggleOnboardingProgress(item) {
    setCompletedOnboardingItems((prev) =>
      prev.includes(item)
        ? prev.filter((task) => task !== item)
        : [...prev, item]
    );
  }

  const onboardingProgress = Math.round(
    (completedSteps.length / onboardingSteps.length) * 100
  );


  const guideCards = [
    {
      title: "Bank Account",
      description: "Basic guidance for opening a Czech bank account.",
      steps: [
        "Prepare passport and work documents.",
        "Ask employer which bank is recommended.",
        "Book appointment if needed.",
        "Never share PIN or banking password.",
      ],
    },
    {
      title: "SIM Card",
      description: "Mobile data and WhatsApp setup.",
      steps: [
        "Buy prepaid SIM first if unsure.",
        "Keep WhatsApp active.",
        "Avoid long contracts without understanding.",
        "Save emergency contacts offline.",
      ],
    },
    {
      title: "Accommodation",
      description: "Housing information and coordination.",
      steps: [
        "Check address and room.",
        "Understand house rules.",
        "Save accommodation contact.",
        "Report problems early.",
      ],
    },
    {
      title: "Transport",
      description: "How to get from accommodation to work.",
      steps: [
        "Check route to workplace.",
        "Save map offline.",
        "Learn bus/tram/train stop.",
        "Ask if you are lost.",
      ],
    },
    {
      title: "First Day at Work",
      description: "What to prepare for the first shift.",
      steps: [
        "Confirm start time.",
        "Bring documents.",
        "Wear correct clothes.",
        "Save supervisor contact.",
      ],
    },
    {
      title: "Health / Doctor",
      description: "What to do when sick or in emergency.",
      steps: [
        "For emergency call 112.",
        "Inform employer if sick.",
        "Prepare insurance card.",
        "Ask coordinator for guidance.",
      ],
    },
  ];

  const quickHelp = [
  {
    icon: "🤒",
    problem: "I am sick",
    category: "Health",
    priority: "Medium",
    responsible: "Employer / Coordinator",
    route: "Health support",
    steps: [
      "Inform your employer or supervisor as soon as possible.",
      "Prepare your insurance card and passport.",
      "Describe your symptoms clearly.",
      "If the situation is serious or dangerous, call 112 immediately.",
    ],
  },
  {
    icon: "🔑",
    problem: "I lost my key",
    category: "Accommodation",
    priority: "Medium",
    responsible: "Accommodation contact",
    route: "Housing support",
    steps: [
      "Do not force the door.",
      "Contact the accommodation responsible person immediately.",
      "Send your address and room number.",
      "If needed, create an issue report in the system.",
    ],
  },
  {
    icon: "📱",
    problem: "I need SIM card",
    category: "Communication",
    priority: "Low",
    responsible: "Coordinator",
    route: "Setup guidance",
    steps: [
      "Start with a prepaid SIM card if you are unsure.",
      "Keep WhatsApp active for communication.",
      "Avoid long contracts without understanding the conditions.",
      "Save emergency contacts offline.",
    ],
  },
  {
    icon: "🏦",
    problem: "I need bank account",
    category: "Banking",
    priority: "Low",
    responsible: "Employer / Coordinator",
    route: "Bank setup",
    steps: [
      "Prepare your passport and work documents.",
      "Ask your employer which bank is recommended.",
      "Book an appointment if needed.",
      "Never share your PIN or banking password.",
    ],
  },
  {
    icon: "🏠",
    problem: "Problem at accommodation",
    category: "Accommodation",
    priority: "Medium",
    responsible: "Accommodation contact / Coordinator",
    route: "Housing issue",
    steps: [
      "Describe the problem clearly.",
      "Add address, room number, and photo if needed.",
      "Contact the accommodation responsible person.",
      "Create an issue report if the problem continues.",
    ],
  },
  {
    icon: "👷",
    problem: "Problem at work",
    category: "Workplace",
    priority: "Medium",
    responsible: "Employer / Supervisor",
    route: "Workplace issue",
    steps: [
      "Write down what happened and when.",
      "Save names of people involved if needed.",
      "Contact your supervisor or employer.",
      "Create an issue report with clear details.",
    ],
  },
  {
    icon: "🚨",
    problem: "Emergency help",
    category: "Emergency",
    priority: "Urgent",
    responsible: "Emergency services",
    route: "Immediate emergency",
    steps: [
      "If there is immediate danger, call 112 now.",
      "Stay in a safe place if possible.",
      "Share your location clearly.",
      "After emergency contact, inform your employer or coordinator.",
    ],
  },
];

  function HomePage() {
  const workerStatus = [
    {
      icon: "✅",
      label: "Registered",
      status: "Completed",
      color: "text-green-600",
    },
    {
      icon: "🏠",
      label: "Accommodation checked",
      status: "Pending",
      color: "text-amber-600",
    },
    {
      icon: "📱",
      label: "SIM card",
      status: "Pending",
      color: "text-amber-600",
    },
    {
      icon: "🏦",
      label: "Bank account",
      status: "Pending",
      color: "text-amber-600",
    },
    {
      icon: "👷",
      label: "First work day",
      status: "Pending",
      color: "text-amber-600",
    },
  ];

  return (
    <>
      <section className="pt-10 sm:pt-16">
        <div className="bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10">
          <p className="inline-block bg-white/15 text-blue-100 px-4 py-2 rounded-full text-sm font-semibold mb-5">
            Automated remote coordination system
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5">
            Automated onboarding and worker support for Filipino workers in Czech Republic.
          </h2>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-3xl mb-7">
            A self-service Digital Coordinator that automatically guides workers
            through onboarding, adaptation, accommodation information, bank
            account steps, SIM card setup, emergency contacts, and issue
            reporting — reducing manual coordination work.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab("guide")}
              className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              Start Onboarding
            </button>

            <button
              onClick={() => setActiveTab("help")}
              className="border border-white/30 px-6 py-3 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              Quick Help
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
          <p className="text-blue-200 text-sm">Registered Workers</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
          <p className="text-blue-200 text-sm">Open Issues</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
          <p className="text-blue-200 text-sm">Emergency Setup</p>
          <p className="text-3xl font-bold mt-2">Ready</p>
        </div>
      </section>

      <section className="mt-8 bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-600 font-semibold mb-1">
              Worker Status
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Automatic onboarding overview
            </h2>
            <p className="text-slate-500 mt-2">
              The worker can clearly see what is completed and what still needs attention.
            </p>
          </div>

          <div className="bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl font-bold">
            20% completed
          </div>
        </div>

        <div className="space-y-3">
          {workerStatus.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-blue-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </div>

              <span className={`font-bold ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-slate-900 rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <p className="text-blue-300 font-semibold mb-2">
            Automation Center
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            The system handles repeated coordination work automatically.
          </h2>

          <p className="text-slate-300 max-w-3xl mb-6">
            Digital Coordinator reduces manual messages by guiding workers,
            answering common questions, tracking onboarding progress, and sending
            workers to the right support flow.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🤖",
                title: "Auto Guidance",
                text: "Workers receive clear next steps without waiting.",
              },
              {
                icon: "🔔",
                title: "Smart Reminders",
                text: "Important onboarding tasks are visible and easy to follow.",
              },
              {
                icon: "🧭",
                title: "Issue Routing",
                text: "Problems are organized by category before you respond.",
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                text: "You can see what is completed and what is still pending.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 hover:bg-white/15 hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 bg-white text-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-600 font-semibold mb-1">
              Smart Task Checklist
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Worker can complete onboarding steps
            </h2>

            <p className="text-slate-500 mt-2">
              Every completed step updates the progress automatically.
            </p>
          </div>

          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold">
            {onboardingProgress}% done
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${onboardingProgress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {onboardingSteps.map((step) => {
            const isDone = completedSteps.includes(step);

            return (
              <button
                key={step}
                onClick={() => toggleStep(step)}
                className={`text-left rounded-2xl p-4 border font-semibold transition hover:-translate-y-1 ${
                  isDone
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50"
                }`}
              >
                <span className="mr-2">{isDone ? "✅" : "⭕"}</span>
                {step}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-5">
          Worker Support Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group bg-white text-slate-900 rounded-3xl p-6 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition">
                ✓
              </div>

              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <RegistrationForm />
    </>
  );
}

  function RegistrationForm() {
  return (
    <section className="mt-10 bg-white text-slate-900 rounded-[2rem] p-5 sm:p-8 shadow-2xl border border-blue-100">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 bg-gradient-to-br from-blue-600 to-slate-900 text-white rounded-3xl p-6">
          <p className="text-blue-100 font-semibold mb-3">Worker Profile</p>

          <h2 className="text-3xl font-extrabold mb-4">
            Start your support journey
          </h2>

          <p className="text-blue-100 leading-relaxed mb-6">
            Register once and the Digital Coordinator will guide you through
            onboarding, accommodation info, SIM card, bank account, and support.
          </p>

          <div className="space-y-3 text-sm">
            <div className="bg-white/10 rounded-2xl p-3">✅ Remote support</div>
            <div className="bg-white/10 rounded-2xl p-3">📱 WhatsApp-ready</div>
            <div className="bg-white/10 rounded-2xl p-3">🚨 Emergency contacts</div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="mb-6">
            <p className="text-blue-600 font-semibold mb-1">
              Registration
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Basic information
            </h3>
            <p className="text-slate-500 mt-2">
              This helps us organize support quickly and clearly.
            </p>
          </div>

          <form
          
  action="https://formspree.io/f/mwvznoen"
  method="POST"
  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
>
  <input name="fullName" className="input-style" type="text" placeholder="Full name" />

  <input name="whatsapp" className="input-style" type="text" placeholder="WhatsApp number" />

  <input name="email" className="input-style" type="email" placeholder="Email address" />

  <input name="employer" className="input-style" type="text" placeholder="Employer / Client" />

  <input name="accommodation" className="input-style sm:col-span-2" type="text" placeholder="Accommodation address" />

  <input name="arrivalDate" className="input-style" type="date" />

  <input name="emergencyContactName" className="input-style" type="text" placeholder="Emergency contact name" />

  <input name="emergencyContactPhone" className="input-style" type="text" placeholder="Emergency contact phone" />

  <button
    type="submit"
    className="sm:col-span-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.01] transition"
  >
    Submit Registration
  </button>
  </form>
  <input type="hidden" name="formType" value="Worker Registration" />
<input type="hidden" name="source" value="Digital Coordinator App" />
<input type="hidden" name="formType" value="Worker Issue Report" />
<input type="hidden" name="source" value="Digital Coordinator App" />
        </div>
      </div>
    </section>
  );
}

  function GuidePage() {
    return (
      <section className="pt-10">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <p className="text-blue-600 font-semibold mb-2">
            Onboarding Guide
          </p>

          <h2 className="text-3xl font-bold mb-4">
            Practical arrival support
          </h2>

          <p className="text-slate-600 mb-6">
            Simple guidance for common situations after arriving in Czech Republic.
          </p>

          <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-bold text-blue-900">
      Automated Onboarding Progress
    </h3>
    <span className="font-bold text-blue-700">
      {onboardingProgress}%
    </span>
  </div>

  <div className="h-3 bg-white rounded-full overflow-hidden mb-4">
    <div
      className="h-full bg-blue-600 rounded-full transition-all duration-500"
      style={{ width: `${onboardingProgress}%` }}
    ></div>
  </div>

  <div className="space-y-2">
    {onboardingSteps.map((step) => (
      <label
        key={step}
        className="flex items-center gap-3 bg-white rounded-xl p-3 cursor-pointer hover:bg-blue-50 transition"
      >
        <input
          type="checkbox"
          checked={completedSteps.includes(step)}
          onChange={() => toggleStep(step)}
          className="w-5 h-5"
        />
        <span className="text-slate-700">{step}</span>
      </label>
    ))}
  </div>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guideCards.map((card) => (
              <div
                key={card.title}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>

                <p className="text-slate-600 mb-4">{card.description}</p>

                <ul className="space-y-2">
                  {card.steps.map((step) => (
                    <li key={step} className="flex gap-2 text-slate-700">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function OnboardingPage() {
  const renderChecklist = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => {
        const isDone = completedOnboardingItems.includes(item);

        return (
          <button
            key={item}
            onClick={() => toggleOnboardingProgress(item)}
            className={`text-left rounded-2xl p-4 border font-semibold transition hover:-translate-y-1 ${
              isDone
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50"
            }`}
          >
            <span className="mr-2">{isDone ? "✅" : "⭕"}</span>
            {item}
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="pt-10">
      <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-blue-100">
        <p className="text-blue-600 font-semibold mb-2">Onboarding Support</p>

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Remote onboarding system for Filipino workers
        </h2>

        <p className="text-slate-600 max-w-3xl mb-6">
          This module guides workers step by step after arrival and helps the
          coordinator track what is completed and what still needs attention.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-3xl p-5 mb-6">
          <h3 className="font-bold text-red-700 text-xl mb-2">
            ⚠️ Priority 1: Immigration & Employee Card
          </h3>
          <p className="text-slate-700">
            Immigration and employee card steps must follow official instructions
            from the employer, agency, Ministry of Interior, or responsible legal
            provider. This app provides remote coordination and practical
            guidance, not legal processing.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6">
          <h3 className="text-xl font-bold mb-4">📄 Documents Checklist</h3>
          {renderChecklist([
            "Passport prepared",
            "Visa / entry document prepared",
            "Accommodation address prepared",
            "Employment documents prepared",
            "Appointment date and time confirmed",
            "Employer confirmation prepared if required",
          ])}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 mb-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            💬 Simple phrases for immigration visit
          </h3>

          <div className="space-y-3">
            {[
              {
                en: "Hello, I am here for my immigration appointment.",
                cz: "Dobrý den, jsem tady na termín ohledně imigračního procesu.",
              },
              {
                en: "I am here for my employee card process.",
                cz: "Jsem tady kvůli procesu zaměstnanecké karty.",
              },
              {
                en: "This is my passport.",
                cz: "Toto je můj pas.",
              },
              {
                en: "This is my accommodation address.",
                cz: "Toto je moje adresa ubytování.",
              },
              {
                en: "I do not understand Czech. Can you please speak English?",
                cz: "Nerozumím česky. Můžete prosím mluvit anglicky?",
              },
              {
                en: "Can I contact my coordinator?",
                cz: "Mohu kontaktovat svého koordinátora?",
              },
            ].map((phrase) => (
              <div
                key={phrase.en}
                className="bg-white rounded-2xl p-4 border border-blue-100"
              >
                <p className="font-semibold text-slate-800">💬 {phrase.en}</p>
                <p className="text-slate-500 mt-1">🇨🇿 {phrase.cz}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-6 border border-white/10">
          <p className="text-blue-300 font-semibold mb-2">
            Remote Coordination Flow
          </p>

          <h3 className="text-2xl font-extrabold mb-4">
            How the Digital Coordinator supports the worker remotely
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                icon: "📍",
                title: "Send location",
                text: "Worker receives office address and map before the visit.",
              },
              {
                icon: "⏰",
                title: "Reminder",
                text: "Worker gets clear reminder about date, time, and documents.",
              },
              {
                icon: "💬",
                title: "Simple phrases",
                text: "Worker can show prepared English and Czech phrases.",
              },
              {
                icon: "✅",
                title: "Confirm result",
                text: "Worker confirms visit, biometrics, or next appointment.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 rounded-3xl p-4 border border-white/10 hover:bg-white/15 transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-slate-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            🏠 Priority 2: Accommodation Check
          </h3>
          <p className="text-slate-500 mb-5">
            Worker must understand where they live, who to contact, and what rules to follow.
          </p>
          {renderChecklist([
            "Accommodation address confirmed",
            "Room / bed confirmed",
            "Keys received",
            "Wi-Fi information received",
            "House rules explained",
            "Accommodation contact saved",
            "Problem reporting process explained",
            "Emergency contact available",
          ])}
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            📱 Priority 3: SIM Card & WhatsApp
          </h3>
          <p className="text-slate-500 mb-5">
            Worker needs mobile data and WhatsApp for stable communication.
          </p>
          {renderChecklist([
            "SIM card received",
            "Mobile data working",
            "WhatsApp active",
            "Coordinator contact saved",
            "Employer contact saved",
            "Accommodation contact saved",
            "Emergency number saved",
            "Worker can send location if lost",
          ])}
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            🏦 Priority 4: Bank Account
          </h3>
          <p className="text-slate-500 mb-5">
            Worker needs clear guidance for opening a bank account and receiving salary safely.
          </p>
          {renderChecklist([
            "Passport prepared for bank",
            "Employment document prepared for bank",
            "Accommodation address prepared for bank",
            "Bank appointment confirmed",
            "Salary account information shared with employer",
            "PIN and password kept private",
            "Mobile banking installed if needed",
            "Worker understands basic bank safety",
          ])}
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            👷 Priority 5: First Day at Work
          </h3>
          <p className="text-slate-500 mb-5">
            Worker must know where to go, when to arrive, who to contact, and what to bring.
          </p>
          {renderChecklist([
            "Workplace address confirmed",
            "Start time confirmed",
            "Supervisor contact saved",
            "Transport route checked",
            "Work clothes prepared",
            "Documents prepared for first day",
            "Break rules understood",
            "Worker knows who to call if lost",
          ])}
        </div>

        <div className="bg-red-50 border border-red-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold text-red-900 mb-2">
            🚨 Priority 6: Emergency Contacts
          </h3>
          <p className="text-slate-600 mb-5">
            Worker must know who to contact in urgent situations.
          </p>
          {renderChecklist([
            "Emergency number 112 saved",
            "Coordinator contact saved",
            "Employer contact saved",
            "Accommodation contact saved",
            "Worker knows when to call emergency",
            "Worker knows when to contact coordinator",
            "Worker can share location",
            "Worker understands this is for urgent help",
          ])}
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            🗣️ Priority 7: Language & Communication
          </h3>
          <p className="text-slate-500 mb-5">
            Worker can show simple English and Czech phrases when they need help.
          </p>

          <div className="space-y-3">
            {[
              {
                en: "I do not understand Czech. Can you please speak English?",
                cz: "Nerozumím česky. Můžete prosím mluvit anglicky?",
              },
              {
                en: "Can you please repeat it slowly?",
                cz: "Můžete to prosím zopakovat pomalu?",
              },
              {
                en: "I need help from my coordinator.",
                cz: "Potřebuji pomoc od svého koordinátora.",
              },
              {
                en: "I am lost. Can I send my location?",
                cz: "Ztratil/a jsem se. Mohu poslat svou polohu?",
              },
              {
                en: "I have a problem at accommodation.",
                cz: "Mám problém na ubytování.",
              },
              {
                en: "I have a problem at work.",
                cz: "Mám problém v práci.",
              },
              {
                en: "I am sick today.",
                cz: "Dnes jsem nemocný/nemocná.",
              },
              {
                en: "Can you please write it in a message?",
                cz: "Můžete mi to prosím napsat do zprávy?",
              },
            ].map((phrase) => (
              <div
                key={phrase.en}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-blue-50 transition"
              >
                <p className="font-semibold text-slate-800">💬 {phrase.en}</p>
                <p className="text-slate-500 mt-1">🇨🇿 {phrase.cz}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-3xl p-5 mb-6 shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">
            ❄️ Priority 8: Adaptation / Weather Shock
          </h3>
          <p className="text-slate-500 mb-5">
            Filipino workers may experience cold weather, dry skin, and difficulty adapting to European climate.
          </p>
          {renderChecklist([
            "Wear warm layers during winter",
            "Use hand cream or body lotion for dry skin",
            "Keep room warm but ventilated",
            "Ask if heating is not working",
            "Drink enough water",
            "Prepare warm shoes and jacket",
            "Understand that adaptation can take a few weeks",
            "Report serious health problems early",
          ])}
        </div>
      </div>
    </section>
  );
}
  function QuickHelpPage() {
  return (
    <section className="pt-10">
      <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-blue-100">
        <div className="mb-8">
          <p className="text-blue-600 font-semibold mb-2">
            Smart Help Center
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            What do you need help with?
          </h2>

          <p className="text-slate-500 max-w-3xl">
            Choose a situation and the Digital Coordinator will automatically
            show priority, responsible contact, and first steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickHelp.map((item) => (
            <button
              key={item.problem}
              onClick={() => setSelectedHelp(item)}
              className={`text-left rounded-3xl p-5 border transition hover:-translate-y-1 hover:shadow-xl ${
                selectedHelp?.problem === item.problem
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                  : "bg-slate-50 text-slate-900 border-slate-200 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{item.icon}</div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.priority === "Urgent"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.priority}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">
                {item.problem}
              </h3>

              <p
                className={`text-sm ${
                  selectedHelp?.problem === item.problem
                    ? "text-blue-100"
                    : "text-slate-500"
                }`}
              >
                Auto route: {item.route}
              </p>
            </button>
          ))}
        </div>

        {selectedHelp && (
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-blue-600 font-semibold mb-2">
                  Automatic decision
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold">
                  {selectedHelp.icon} {selectedHelp.problem}
                </h3>
              </div>

              <div
                className={`px-4 py-2 rounded-2xl font-bold text-sm ${
                  selectedHelp.priority === "Urgent"
                    ? "bg-red-100 text-red-700"
                    : selectedHelp.priority === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                Priority: {selectedHelp.priority}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-slate-400 text-sm font-semibold mb-1">
                  Category
                </p>
                <p className="font-bold">{selectedHelp.category}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-slate-400 text-sm font-semibold mb-1">
                  Responsible
                </p>
                <p className="font-bold">{selectedHelp.responsible}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <p className="text-slate-400 text-sm font-semibold mb-1">
                  Route
                </p>
                <p className="font-bold">{selectedHelp.route}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100">
              <p className="text-blue-600 font-semibold mb-3">
                First steps
              </p>

              <ul className="space-y-3">
                {selectedHelp.steps.map((step) => (
                  <li
                    key={step}
                    className="flex gap-3 text-slate-700 leading-relaxed"
                  >
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
  onClick={() => {
    setSelectedIssue(selectedHelp);
    setActiveTab("report");
  }}
  className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.01] transition"
>
  Create issue report
</button>
          </div>
        )}
      </div>
    </section>
  );
}
  function ReportPage() {
  const [reportSent, setReportSent] = useState(false);

  async function handleReportSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    await fetch("https://formspree.io/f/mwvznoen", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    setReportSent(true);
    form.reset();
  }

  return (
    <section className="pt-10">
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-100">
        {reportSent && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-5">
            <h3 className="font-bold text-xl mb-1">
              ✅ Report sent successfully
            </h3>
            <p>Your issue has been sent to the coordinator.</p>
          </div>
        )}

        <p className="text-red-600 font-semibold mb-2">
          Smart Issue Report
        </p>

        <h2 className="text-3xl font-bold mb-4">
          Report a worker issue
        </h2>

        <p className="text-slate-600 mb-6">
          The system organizes the issue and sends the report directly to the coordinator.
        </p>

        {selectedIssue && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-3xl p-5">
            <p className="text-blue-600 font-semibold mb-2">
              Selected from Quick Help
            </p>

            <h3 className="text-xl font-bold text-slate-900">
              {selectedIssue.icon} {selectedIssue.problem}
            </h3>

            <p className="text-slate-600 mt-2">
              {selectedIssue.answer}
            </p>
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="grid grid-cols-1 gap-4">
          <input type="hidden" name="formType" value="Worker Issue Report" />
          <input type="hidden" name="source" value="Digital Coordinator App" />

          <input
            type="hidden"
            name="quickHelpSelected"
            value={selectedIssue?.problem || "Not selected from Quick Help"}
          />

          <input
            type="hidden"
            name="_subject"
            value="New Worker Issue Report - Digital Coordinator"
          />

          <select
            name="issueType"
            className="input-style"
            required
            value={selectedIssue?.problem || ""}
            onChange={(e) =>
              setSelectedIssue({
                problem: e.target.value,
                answer: "",
                icon: "📝",
              })
            }
          >
            <option value="">Select issue type</option>
            <option value="Work issue">Work issue</option>
            <option value="Accommodation issue">Accommodation issue</option>
            <option value="Health concern">Health concern</option>
            <option value="Communication problem">Communication problem</option>
            <option value="Documents question">Documents question</option>
            <option value="Urgent issue">Urgent issue</option>
          </select>

          <textarea
            name="issueDescription"
            rows="6"
            required
            placeholder="Describe what happened, when it happened, where it happened, and who was involved..."
            className="input-style resize-none"
          />

          <input
            name="workerName"
            className="input-style"
            type="text"
            required
            placeholder="Your name"
          />

          <input
            name="workerWhatsapp"
            className="input-style"
            type="text"
            required
            placeholder="WhatsApp number"
          />

          <button
            type="submit"
            className="bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 hover:scale-[1.01] transition"
          >
            Submit Structured Report
          </button>
        </form>

        <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
          <h3 className="font-bold text-red-700 mb-2">
            🚨 Emergency reminder
          </h3>
          <p className="text-slate-700">
            For urgent emergency in Czech Republic call <strong>112</strong>.
            This report does not replace emergency services.
          </p>
        </div>
      </div>
    </section>
  );
}
  function AdminPage() {
    return (
      <section className="pt-10">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <p className="text-blue-600 font-semibold mb-2">
            Admin Dashboard
          </p>

          <h2 className="text-3xl font-bold mb-6">
            Remote coordination overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 border">
              <p className="text-slate-500">Workers</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">0</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border">
              <p className="text-slate-500">Open Issues</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">0</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border">
              <p className="text-slate-500">Urgent Cases</p>
              <p className="text-3xl font-bold text-red-600 mt-2">0</p>
            </div>
          </div>

          <div className="mt-8 bg-slate-50 rounded-2xl p-5 border">
            <h3 className="font-bold mb-2">Next admin features</h3>
            <ul className="text-slate-600 space-y-2">
              <li>• Worker database</li>
              <li>• Issue status: new / in progress / solved</li>
              <li>• Onboarding progress tracking</li>
              <li>• Client communication notes</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Digital Coordinator
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Remote Filipino Workforce Support 🇵🇭🇨🇿
            </p>
          </div>

        <div className="hidden sm:flex gap-2">
  {["home", "onboarding", "help", "communication", "report", "admin"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-full font-semibold transition ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-white/10 text-blue-100 hover:bg-white/20"
      }`}
    >
      {tab.toUpperCase()}
    </button>
  ))}
</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-28 sm:pb-12">
        {activeTab === "home" && <HomePage />}
{activeTab === "onboarding" && <OnboardingPage />}
{activeTab === "help" && <QuickHelpPage />}
{activeTab === "communication" && <GuidePage />}

{activeTab === "report" && <ReportPage />}
{activeTab === "admin" && <AdminPage />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white text-slate-900 border-t sm:hidden z-50">
        <div className="grid grid-cols-4 text-xs">
          {["home", "guide", "help", "report", "admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-semibold ${
                activeTab === tab ? "text-blue-600" : "text-slate-500"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;