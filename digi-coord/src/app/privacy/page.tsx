import { getLang } from "@/lib/i18n"
import { t } from "@/lib/translations"
import { SiteHeader } from "@/components/public/site-header"
import { PageContainer, PageHeader } from "@/components/public/page-layout"
import { SiteFooter } from "@/components/public/site-footer"

export default async function PrivacyPage() {
  const lang = await getLang()

  return (
    <div className="min-h-screen">
      <SiteHeader lang={lang} />
      <PageContainer>
        <PageHeader
          title={t("privacy.title", lang)}
          subtitle={t("privacy.subtitle", lang)}
        />

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Data Controller</h2>
            <p>
              The controller of your personal data is the Digital Coordinator service operated by
              Štěpán Potiorek. If you have any questions about this policy, contact us at{" "}
              <a href="mailto:stepan.potiorek@seznam.cz" className="text-blue-400 hover:text-blue-300">
                stepan.potiorek@seznam.cz
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. Data We Collect</h2>
            <p>We collect the following personal data when you register and use the platform:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Name and surname</li>
              <li>Email address</li>
              <li>Phone number (WhatsApp)</li>
              <li>Employer information</li>
              <li>Accommodation address</li>
              <li>Emergency contact details</li>
              <li>Passport and driver&apos;s license information (optional, via Candidate Profile)</li>
              <li>CV / resume (optional upload)</li>
              <li>Onboarding progress data</li>
              <li>Issue reports and communication history</li>
              <li>Language preference (stored in a cookie)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Purpose of Processing</h2>
            <p>Your data is processed for the following purposes:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Worker onboarding and adaptation support</li>
              <li>Communication between worker, coordinator, and employer</li>
              <li>Issue tracking and resolution</li>
              <li>Verification of identity and eligibility</li>
              <li>Presentation of candidate profiles to potential employers (with your consent)</li>
              <li>Service improvement and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Legal Basis</h2>
            <p>
              We process your personal data based on your explicit consent (Article 6(1)(a) GDPR),
              which you give when registering and agreeing to this policy. You may withdraw your
              consent at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Data Retention</h2>
            <p>
              Your personal data is retained for as long as your account is active and for up to
              12 months after your last interaction with the platform, unless a longer retention
              period is required by law. After this period, your data will be anonymized or deleted.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Data Sharing</h2>
            <p>
              Your data is shared only with:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Your coordinator and relevant administrative staff</li>
              <li>Your employer (only information necessary for employment coordination)</li>
              <li>Potential employers (only your Candidate Profile and CV, with your explicit consent)</li>
            </ul>
            <p className="mt-2">
              We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. Your Rights</h2>
            <p>Under GDPR, you have the following rights:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Right of access</strong> — request a copy of your data</li>
              <li><strong>Right to rectification</strong> — correct inaccurate data</li>
              <li><strong>Right to erasure</strong> — request deletion of your data</li>
              <li><strong>Right to restriction</strong> — limit how we use your data</li>
              <li><strong>Right to data portability</strong> — receive your data in a structured format</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:stepan.potiorek@seznam.cz" className="text-blue-400 hover:text-blue-300">
                stepan.potiorek@seznam.cz
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Cookies</h2>
            <p>
              We use only essential cookies for authentication (session token) and language
              preference. These cookies are necessary for the platform to function. No tracking
              or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, loss, or destruction, including
              encryption of data in transit (HTTPS) and hashed passwords.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">10. Contact & Complaints</h2>
            <p>
              If you have a complaint about how we handle your personal data, you have the right
              to lodge a complaint with the Czech Office for Personal Data Protection (Úřad pro
              ochranu osobních údajů, www.uoou.cz).
            </p>
          </section>
        </div>
      </PageContainer>
      <SiteFooter />
    </div>
  )
}
