import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';

export default function PrivacyPolicyPage() {
  return (
    <>
      <SeoHead
        title="Privacy Policy | Toolora"
        description="Read the Toolora Privacy Policy explaining local browser-side file processing, localStorage preferences, and third-party advertising cookies."
        canonicalPath="/privacy-policy"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              1. Local Browser Processing & Zero File Storage
            </h2>
            <p>
              Toolora tools—including image compressors, resizers, croppers, PDF merge/split/export
              utilities, text formatters, encoders, and calculators—run locally inside your web
              browser. Files you select are processed in device memory and are never uploaded to or
              stored on Toolora servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              2. Browser Local Storage
            </h2>
            <p>
              Toolora uses browser <code>localStorage</code> solely to remember your light/dark theme
              preference (<code>toolora-theme</code>) and your recently opened tools list (
              <code>toolora-recent-tools</code>). You can clear this data at any time in your
              browser settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              3. Advertising & Third-Party Cookies
            </h2>
            <p>
              If advertising partners such as Google AdSense are enabled on this site, third-party
              vendors may use cookies or web beacons to serve ads based on prior visits to this or
              other websites. Users may manage personalized advertising settings through Google Ads
              Settings or applicable regional consent controls.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              4. Contact
            </h2>
            <p>
              Questions regarding this policy can be sent to{' '}
              <a href="mailto:support@toolora.app" className="text-indigo-600 dark:text-indigo-400 underline">
                support@toolora.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
