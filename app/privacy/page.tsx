import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | AI Series Studio',
  description: 'Privacy Policy for AI Series Studio',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-slate-400 hover:text-slate-200"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold text-slate-50">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 2025</p>
        <div className="mt-8 space-y-6 text-sm text-slate-300">
          <p>
            AI Series Studio collects and uses information needed to run the service: account data
            (e.g. email), content you create, and connection details for linked platforms (e.g.
            TikTok) so we can publish on your behalf.
          </p>
          <p>
            We use this data to operate the product, improve it, and comply with law. We do not sell
            your personal information. When you connect TikTok or other services, their privacy
            policies also apply to data they receive.
          </p>
          <p>
            We may share data with service providers that help us run the platform, and where
            required by law. We keep data only as long as needed for these purposes.
          </p>
          <p>
            You can request access, correction, or deletion of your data by contacting us at the
            support address in the app or on our website.
          </p>
        </div>
      </div>
    </div>
  );
}
