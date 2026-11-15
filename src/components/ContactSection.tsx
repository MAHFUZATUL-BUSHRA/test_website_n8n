import { useState, type FormEvent } from 'react';
import { AlertCircle, ArrowUpRight, Check, Copy, MessageSquare, Send } from 'lucide-react';
import { ENGINEER_PROFILE } from '../data/portfolioContext';

interface ContactSectionProps {
  onOpenChat: () => void;
}

const INQUIRY_TYPES = [
  'Staff+ Engineering Role',
  'Technical Architecture Advisory',
  'Systems Performance Audit',
  'Speaking or Open Source',
  'General Inquiry',
];

export function ContactSection({ onOpenChat }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [webhookWarning, setWebhookWarning] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(ENGINEER_PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in non-secure context; fallback ignored silently.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setWebhookWarning('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          inquiryType,
          message,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setStatus('error');
        setErrorMessage(payload.error || 'Unable to send your message. Please try again.');
        return;
      }

      setStatus('success');
      setReceiptId(payload.submissionId || '');
      if (payload.webhookDelivered === false && payload.webhookError) {
        setWebhookWarning(payload.webhookError);
      }
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch {
      setStatus('error');
      setErrorMessage('Network error while submitting the form. Please try again.');
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium text-[#2563EB]">Contact</p>
              <h2
                className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0A0B0D]"
                style={{ textWrap: 'balance' }}
              >
                Start a technical conversation.
              </h2>
              <p className="text-[15px] leading-relaxed text-zinc-600">
                {ENGINEER_PROFILE.availability} Send a brief outlining your team, system constraints, or role details.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500">Direct Email</p>
                  <a
                    href={`mailto:${ENGINEER_PROFILE.email}`}
                    className="font-mono text-sm font-medium text-[#0A0B0D] hover:text-[#2563EB] transition-colors"
                  >
                    {ENGINEER_PROFILE.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:border-zinc-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm font-medium text-zinc-700 pt-2">
                <a
                  href={ENGINEER_PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href={ENGINEER_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3">
              <p className="text-sm font-semibold text-[#0A0B0D]">
                Prefer quick Q&A about Clara&apos;s background?
              </p>
              <p className="text-xs leading-relaxed text-zinc-600">
                Ask the portfolio assistant about specific distributed systems projects, Rust/TypeScript depth, or engineering leadership experience.
              </p>
              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#0A0B0D] bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Portfolio Assistant</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
              {status === 'success' ? (
                <div className="py-10 space-y-5">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-[#0A0B0D]">
                      Message received
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-md">
                      Thank you for reaching out. Clara typically replies within one business day.
                    </p>
                    {receiptId && (
                      <p className="font-mono text-xs text-zinc-500 pt-1">
                        Reference ID: {receiptId}
                      </p>
                    )}
                    {webhookWarning && (
                      <div
                        role="alert"
                        className="mt-3 flex items-start gap-2.5 p-3.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                        <span>{webhookWarning}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setWebhookWarning('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#0A0B0D] bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-zinc-700"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-lg text-[#0A0B0D] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-zinc-700"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-lg text-[#0A0B0D] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-inquiry"
                        className="block text-xs font-medium text-zinc-700"
                      >
                        Inquiry Type
                      </label>
                      <select
                        id="contact-inquiry"
                        name="inquiryType"
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-lg text-[#0A0B0D] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                      >
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-company"
                        className="block text-xs font-medium text-zinc-700"
                      >
                        Organization (Optional)
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Cloud Inc."
                        className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-lg text-[#0A0B0D] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-zinc-700"
                    >
                      Project or Role Details
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share context on your engineering team, architecture challenge, or timeline..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] border border-zinc-200 rounded-lg text-[#0A0B0D] placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 resize-y"
                    />
                  </div>

                  {status === 'error' && errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3.5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-zinc-500">
                      Typical response within 24 hours.
                    </p>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
