import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { SiteFooter } from "@/components/public/site-footer"

export default async function TermsPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />
      <PageContainer>
        <PageHeader
          title={t("terms.title", lang)}
          subtitle={t("terms.subtitle", lang)}
        />

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Introduction</h2>
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the Digital Coordinator
              platform operated by [Operator Name] (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By
              accessing or using the platform, you agree to be bound by these Terms.
            </p>
            <p className="mt-2">
              The Digital Coordinator is a workforce coordination platform designed to support
              Filipino workers in Czech Republic. It provides onboarding guidance, practical
              information, and coordination services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. Free Services</h2>
            <p>
              The following services are provided free of charge:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>General information about living and working in Czech Republic</li>
              <li>Practical guides (arrival, accommodation, banking, transport, workplace culture)</li>
              <li>Educational content and FAQ</li>
              <li>Self-service tools (onboarding checklists, issue reporting, letter analysis)</li>
              <li>General online support via WhatsApp and the platform</li>
              <li>Access to your personal dashboard and worker profile</li>
            </ul>
            <p className="mt-2">
              Free services are provided as-is and are subject to availability. We reserve the right
              to modify, suspend, or discontinue any free service at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Paid Services</h2>
            <p>
              The following services require payment and are provided upon your explicit request:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Personalized accommodation search and placement</li>
              <li>Relocation assistance (airport pickup, transport coordination)</li>
              <li>Individual administrative assistance (government office appointments, document preparation)</li>
              <li>Communication with third parties on your behalf (employers, landlords, banks)</li>
              <li>Other individually requested coordination services requiring dedicated human time</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Pricing &amp; Confirmation</h2>
            <p>
              <strong>Transparency is fundamental to our service.</strong> Before any paid service
              begins:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>You will be informed of the exact price and scope of the service</li>
              <li>You must provide explicit confirmation (written or digital) before work begins</li>
              <li>No charges will be applied without your prior knowledge and approval</li>
              <li>There are no hidden fees — all costs are disclosed upfront</li>
            </ul>
            <p className="mt-2">
              If you do not agree with the proposed price or scope, you are not obligated to proceed.
              You may request a written estimate before committing to any paid service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Third-Party Services</h2>
            <p>
              The platform may facilitate coordination with third-party service providers, including
              but not limited to:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Transport companies and travel agencies</li>
              <li>Financial institutions and banks</li>
              <li>Government offices and administrative bodies</li>
              <li>Accommodation providers and landlords</li>
              <li>Employers and recruitment agencies</li>
            </ul>
            <p className="mt-2">
              We act as an intermediary and coordinator. We are not a party to any agreement between
              you and a third-party provider. We do not guarantee the quality, availability, or
              outcomes of third-party services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Accommodation Services</h2>
            <p>
              When you request accommodation coordination, we will:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Search for suitable accommodation based on your requirements</li>
              <li>Present available options with pricing and conditions</li>
              <li>Coordinate with landlords or accommodation providers on your behalf</li>
              <li>Assist with move-in logistics where applicable</li>
            </ul>
            <p className="mt-2">
              <strong>Limitations:</strong> We do not own or manage accommodation properties. We are
              not responsible for the condition, safety, or legality of accommodation offered by
              third parties. Any tenancy agreement is between you and the property owner. We strongly
              recommend inspecting accommodation before committing to a lease.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. User Responsibilities</h2>
            <p>By using the platform, you agree to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Provide accurate and truthful information in your profile and communications</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Use the platform only for lawful purposes</li>
              <li>Treat coordinators and other users with respect</li>
              <li>Not attempt to circumvent the platform to avoid applicable fees for paid services</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Limitation of Liability</h2>
            <p>
              The Digital Coordinator platform provides <strong>informational guidance and
              coordination support</strong>. It does <strong>not</strong> provide:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Legal advice or immigration legal services</li>
              <li>Guaranteed outcomes for any application or process</li>
              <li>Financial or tax advice</li>
              <li>Medical or insurance advice</li>
            </ul>
            <p className="mt-2">
              To the maximum extent permitted by law, we shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the platform or
              reliance on information provided. Our total liability shall not exceed the amount you
              paid for the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Account &amp; Termination</h2>
            <p>
              <strong>By you:</strong> You may request account deletion at any time by contacting
              your coordinator or emailing us at [Contact Email]. Upon deletion, your personal data
              will be handled in accordance with our Privacy Policy.
            </p>
            <p className="mt-2">
              <strong>By us:</strong> We may suspend or terminate your account if you:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Violate these Terms or any applicable policy</li>
              <li>Provide false or misleading information</li>
              <li>Engage in harmful, abusive, or fraudulent behavior</li>
              <li>Circumvent the platform to avoid payment for paid services</li>
            </ul>
            <p className="mt-2">
              We will attempt to notify you before termination and provide an opportunity to address
              the issue, except in cases of serious misconduct.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">10. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. When we make material changes,
              we will notify you via the platform or by email. Your continued use of the platform
              after such changes constitutes acceptance of the updated Terms.
            </p>
            <p className="mt-2">
              We encourage you to review these Terms periodically. The &quot;Last Updated&quot; date
              at the top of this page indicates when these Terms were last revised.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">11. Applicable Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Czech
              Republic. Any disputes arising under or in connection with these Terms shall be subject
              to the exclusive jurisdiction of the courts of [City], Czech Republic.
            </p>
            <p className="mt-2">
              If you are a consumer, you may also have rights under the mandatory consumer protection
              laws of your country of residence, which nothing in these Terms is intended to restrict.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">12. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Email: [Contact Email]</li>
              <li>WhatsApp: [Contact Number]</li>
            </ul>
          </section>
        </div>
      </PageContainer>
      <SiteFooter />
    </div>
  )
}
