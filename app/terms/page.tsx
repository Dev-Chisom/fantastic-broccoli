import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | AI Series Studio',
  description: 'Terms of Service for AI Series Studio',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-slate-400 hover:text-slate-200"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold text-slate-50">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 2025</p>
        <div className="mt-8 space-y-6 text-sm text-slate-300">
          <p>
            By using AI Series Studio you agree to these terms. The service lets you create and
            manage AI-generated video series and connect to third-party platforms (e.g. TikTok) for
            publishing.
          </p>
          <p>
            You must use the service lawfully and in line with each platform’s policies (including
            TikTok’s Terms of Service and Community Guidelines). You are responsible for your
            content and how you use connected accounts.
          </p>
          <p>
            We may change these terms from time to time. Continued use after changes means you
            accept the updated terms. We may suspend or end access if you breach these terms.
          </p>
          <p>
            For questions, contact us at the support address provided in the app or on our website.
          </p>
        </div>
      </div>
    </div>
  );
}
