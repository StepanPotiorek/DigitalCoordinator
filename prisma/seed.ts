import { PrismaClient, Role, OnboardingStatus, OnboardingCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─── Admin user ─────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  // ⚠️ Change this password after first login — do not keep "admin123" in production

  const admin = await prisma.user.upsert({
    where: { email: "stepan.potiorek@seznam.cz" },
    update: {},
    create: {
      name: "Štěpán Potiorek",
      email: "stepan.potiorek@seznam.cz",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // ─── Sample FAQ items ───────────────────────────────────
  const faqItems = [
    {
      question: "How do I get a SIM card?",
      answer: "Buy a prepaid SIM from any mobile operator (Vodafone, T-Mobile, O2). Keep WhatsApp active. Avoid long contracts without understanding them.",
      category: "Communication",
      order: 1,
    },
    {
      question: "How do I open a bank account?",
      answer: "Prepare your passport, work documents, and accommodation address. Ask your employer which bank they recommend. Book an appointment if needed. Never share your PIN or password.",
      category: "Banking",
      order: 2,
    },
    {
      question: "What should I do in an emergency?",
      answer: "Call 112 for immediate danger. Stay in a safe place. Share your location. After emergency services, inform your employer or coordinator.",
      category: "Emergency",
      order: 3,
    },
    {
      question: "Who do I contact if I have a problem at work?",
      answer: "First inform your supervisor or employer. If the issue continues, create an issue report in the system or contact your coordinator.",
      category: "Workplace",
      order: 4,
    },
    {
      question: "What documents do I need for immigration visit?",
      answer: "Passport, visa/entry document, accommodation address, employment documents, appointment confirmation, and employer confirmation if required.",
      category: "Legal",
      order: 5,
    },
    {
      question: "How do I report a problem at accommodation?",
      answer: "Describe the problem clearly with address, room number, and photo if needed. Contact the accommodation responsible person. Create an issue report if not resolved.",
      category: "Accommodation",
      order: 6,
    },
    {
      question: "What should I do on my first day at work?",
      answer: "Confirm start time and address. Bring your documents. Wear appropriate clothes. Save your supervisor's contact. Arrive on time.",
      category: "Workplace",
      order: 7,
    },
    {
      question: "How do I adapt to cold weather?",
      answer: "Wear warm layers. Use hand cream for dry skin. Keep your room warm but ventilated. Drink enough water. Adaptation takes a few weeks.",
      category: "Adaptation",
      order: 8,
    },
  ];

  for (const faq of faqItems) {
    await prisma.faq.create({ data: faq });
  }

  console.log("✅ FAQ items seeded:", faqItems.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
