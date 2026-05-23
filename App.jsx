import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [completedSteps, setCompletedSteps] = useState([]);

  const [selectedHelp, setSelectedHelp] = useState(null);

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
    answer:
      "Inform your employer or supervisor as soon as possible. If it is urgent, call 112. Prepare your insurance card and explain your symptoms clearly.",
  },
  {
     icon: "🔑",
    problem: "I lost my key",
    answer:
      "Contact the accommodation responsible person immediately. Do not force the door. Inform your coordinator and wait for instructions.",
  },
  {
    icon: "📱",
    problem: "I need a SIM card",
    answer:
      "Start with a prepaid SIM card. Keep WhatsApp active because most communication will happen there.",
  },
  {
    icon: "🏦",
    problem: "I need a bank account",
    answer:
      "Prepare your passport and work documents. Ask your employer which bank is recommended before booking an appointment.",
  },
  {
      icon: "👷",
    problem: "Problem at work",
    answer:
      "Write down what happened, when it happened, and who was involved. Report the issue clearly through the system.",
  },
  {
    icon: "🏠",
    problem: "Problem at accommodation",
    answer:
      "Describe the problem clearly. Add room number, address, and photo if needed. Contact accommodation responsible person.",
  },
    {
    icon: "🚨",
    problem: "Emergency help",
    answer:
      "If there is immediate danger or serious health emergency, call 112 in Czech Republic. Then inform your employer or coordinator as soon as possible.",
  },
];

  function HomePage() {
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
                onClick={() => setActiveTab("report")}
                className="border border-white/30 px-6 py-3 rounded-2xl font-bold hover:bg-white/10 transition"
              >
                Report Problem
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
      <section className="mt-10 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <p className="text-blue-600 font-semibold mb-2">
          Worker Registration
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Basic worker information
        </h2>

        <p className="text-slate-600 mb-6">
          This helps organize remote onboarding, communication,
          accommodation information, and emergency support.
        </p>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input className="input-style" type="text" placeholder="Full name" />
          <input className="input-style" type="text" placeholder="WhatsApp number" />
          <input className="input-style" type="email" placeholder="Email address" />
          <input className="input-style" type="text" placeholder="Employer / Client" />
          <input className="input-style" type="text" placeholder="Accommodation address" />
          <input className="input-style" type="date" />
          <input className="input-style" type="text" placeholder="Emergency contact name" />
          <input className="input-style" type="text" placeholder="Emergency contact phone" />

          <button
            type="submit"
            className="sm:col-span-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 hover:scale-[1.01] transition"
          >
            Submit Registration
          </button>
        </form>
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

  function QuickHelpPage() {
  return (
    <section className="pt-10">
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <p className="text-blue-600 font-semibold mb-2">
          Smart Help Center
        </p>

        <h2 className="text-3xl font-bold mb-3">
          How can we help you today?
        </h2>

        <p className="text-slate-600 mb-6">
          Choose your situation and the system will show the first steps automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickHelp.map((item) => (
            <button
              key={item.problem}
              onClick={() => setSelectedHelp(item)}
              className={`text-left rounded-3xl p-5 border transition hover:-translate-y-1 hover:shadow-xl ${
                selectedHelp?.problem === item.problem
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 text-slate-900 border-slate-200"
              }`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>

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
                Tap to get automatic guidance
              </p>
            </button>
          ))}
        </div>

        {selectedHelp && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-6">
            <p className="text-blue-600 font-semibold mb-2">
              Automatic guidance
            </p>

            <h3 className="text-2xl font-bold mb-3">
              {selectedHelp.icon} {selectedHelp.problem}
            </h3>

            <p className="text-slate-700 leading-relaxed">
              {selectedHelp.answer}
            </p>

            <button
              onClick={() => setActiveTab("report")}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              I still need help
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
  function ReportPage() {
    return (
      <section className="pt-10">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <p className="text-red-600 font-semibold mb-2">
            Problem Reporting
          </p>

          <h2 className="text-3xl font-bold mb-4">
            Report a worker issue
          </h2>

          <p className="text-slate-600 mb-6">
            Workers can report work, accommodation, health, communication, or urgent problems.
          </p>

          <form className="grid grid-cols-1 gap-4">
            <select className="input-style">
              <option>Work issue</option>
              <option>Accommodation issue</option>
              <option>Health concern</option>
              <option>Communication problem</option>
              <option>Documents question</option>
              <option>Urgent issue</option>
            </select>

            <textarea
              rows="6"
              placeholder="Describe the problem clearly..."
              className="input-style resize-none"
            ></textarea>

            <button
              type="submit"
              className="bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 hover:scale-[1.01] transition"
            >
              Submit Problem
            </button>
          </form>

          <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
            <h3 className="font-bold text-red-700 mb-2">Emergency</h3>
            <p className="text-slate-700">
              For urgent emergency in Czech Republic call <strong>112</strong>.
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
  {["home", "guide", "help", "report", "admin"].map((tab) => (
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
        {activeTab === "guide" && <GuidePage />}
        {activeTab === "help" && <QuickHelpPage />}
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