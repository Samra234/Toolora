import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';

export default function DisclaimerPage() {
  return (
    <>
      <SeoHead
        title="Disclaimer | Toolora"
        description="Important disclaimers regarding accuracy of Toolora calculators, unit converters, and file processing utilities."
        canonicalPath="/disclaimer"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <Breadcrumbs items={[{ label: 'Disclaimer' }]} />
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            Disclaimer
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              1. Informational Purpose Only
            </h2>
            <p>
              All calculators, converters, and text/developer utilities on Toolora are provided for
              general informational and productivity purposes. While we strive for mathematical and
              technical precision, we make no guarantees of completeness or suitability for regulated
              engineering, legal, or accounting filings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              2. Financial & Health Calculators
            </h2>
            <p>
              The Loan Calculator and Discount Calculator provide mathematical estimates and do not
              constitute financial, tax, or lending advice. Similarly, the BMI Calculator is a
              general statistical ratio and does not constitute medical advice; consult a licensed
              healthcare provider regarding health decisions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              3. File Processing Limitations
            </h2>
            <p>
              Browser-based PDF and image operations depend on your device's available RAM and
              browser capabilities. Always verify exported files before deleting originals.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
