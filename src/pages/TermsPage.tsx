import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';

export default function TermsPage() {
  return (
    <>
      <SeoHead
        title="Terms and Conditions | Toolora"
        description="Terms and conditions governing use of the Toolora online tools website."
        canonicalPath="/terms"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Toolora, you agree to comply with these Terms and Conditions and
              all applicable local and international laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              2. Permitted Use
            </h2>
            <p>
              Toolora tools are provided free of charge for personal, educational, and commercial
              productivity workflows. You agree not to scrape, disrupt, or attempt to interfere with
              site availability or advertising placements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              3. User Content Responsibility
            </h2>
            <p>
              Because all files and text inputs are processed locally on your own device, you retain
              full ownership and responsibility for any documents, images, or data you process using
              our utilities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              4. Service Provided "As Is"
            </h2>
            <p>
              Toolora is provided on an "as-is" and "as-available" basis without warranties of any
              kind, express or implied. Always retain backups of important original files before
              converting or splitting documents.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
