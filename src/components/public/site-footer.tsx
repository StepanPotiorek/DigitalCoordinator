export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
      <p className="mb-2">Digital Coordinator — Suporta sa Manggagawang Pilipino 🇵🇭🇨🇿</p>
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=C7KUMCA75GE2N"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-amber-600/20 px-4 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-600/30 transition-colors"
        >
          ☕ Support the Project
        </a>
        <a
          href="/terms"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          Terms & Services
        </a>
        <a
          href="/privacy"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
