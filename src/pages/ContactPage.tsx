import { CheckCircle2, Mail, Send } from 'lucide-react';
import React, { useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Tool Suggestion');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();

    if (cleanName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (cleanMsg.length < 10) {
      setError('Please write a message of at least 10 characters.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  const mailtoHref = `mailto:support@toolora.app?subject=${encodeURIComponent(
    `[Toolora] ${topic} from ${name.trim() || 'User'}`
  )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

  return (
    <>
      <SeoHead
        title="Contact Us – Feedback & Support | Toolora"
        description="Reach out to the Toolora team to suggest a new online tool, report a bug, or ask a question about our browser utilities."
        canonicalPath="/contact"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contact Us
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Have feedback, a bug report, or a request for a new utility? Send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            {submitted ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                      Inquiry Prepared
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Thank you, {name.trim()}. Because Toolora is a static client-side web app
                      without a backend mail server, click below to open this formatted message in
                      your default email client or reset the form.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Open in Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Compose Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white"
                  >
                    <option>Tool Suggestion</option>
                    <option>Bug Report</option>
                    <option>Privacy Question</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question or feature idea..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <p role="alert" className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Prepare Message</span>
                </button>
              </form>
            )}
          </div>

          <aside className="md:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-5">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Direct Email
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                For partnership inquiries, bug reports, or legal requests, email:
              </p>
              <a
                href="mailto:support@toolora.app"
                className="mt-2 inline-block font-mono text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                support@toolora.app
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
