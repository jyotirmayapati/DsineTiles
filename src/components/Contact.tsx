import { useState } from 'react'
import { productsData } from '../data/products'
import { CONTACT, whatsappLink } from '../data/contact'

type Channel = 'whatsapp' | 'email'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', company: '', product: '', message: '' })
  const [sent, setSent] = useState<Channel | null>(null)
  const [missing, setMissing] = useState(false)

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  // The enquiry goes out through WhatsApp or email, already written, so nothing is lost
  const compose = () => {
    const lines = [`Hi, I'm ${form.name}${form.company ? ` from ${form.company}` : ''}.`]
    if (form.product) lines.push(`Product: ${form.product}`)
    if (form.phone) lines.push(`Phone: ${form.phone}`)
    return [...lines, '', form.message].join('\n')
  }

  const send = (channel: Channel) => {
    if (!form.name.trim() || !form.message.trim()) {
      setMissing(true)
      return
    }
    setMissing(false)
    const url = channel === 'whatsapp'
      ? whatsappLink(compose())
      : `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry${form.product ? `: ${form.product}` : ''}`)}&body=${encodeURIComponent(compose())}`
    window.open(url, channel === 'whatsapp' ? '_blank' : '_self')
    setSent(channel)
  }

  const lines = [
    { label: 'Call', value: CONTACT.phone, href: `tel:${CONTACT.phoneHref}` },
    { label: 'WhatsApp', value: CONTACT.phone, href: whatsappLink('Hi, I have a question about your products.') },
    { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: 'Visit the yard', value: CONTACT.address, href: CONTACT.mapUrl },
    { label: 'Hours', value: CONTACT.hours },
  ]

  return (
    <section id="contact" className="py-24 sm:py-32 bg-slab border-t border-formline">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl max-w-xl">Tell us what you're building</h2>
          <p className="mt-6 max-w-md text-lg text-aggregate">
            Send the site, the products and rough quantities. We reply with sizes, lead times and a price.
          </p>

          <dl className="mt-12 border-t border-formline">
            {lines.map((l) => (
              <div key={l.label} className="grid grid-cols-[7rem_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)] gap-4 py-4 border-b border-formline">
                <dt className="text-aggregate">{l.label}</dt>
                <dd className="min-w-0">
                  {l.href ? (
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-semibold underline decoration-formline decoration-2 underline-offset-4 hover:decoration-marking [overflow-wrap:anywhere]"
                    >
                      {l.value}
                    </a>
                  ) : (
                    <span className="font-semibold">{l.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send('whatsapp') }}
          className="bg-concrete border border-formline rounded-[4px] p-6 sm:p-8 space-y-5 self-start"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="c-name" className="field-label">Your name</label>
              <input id="c-name" name="name" value={form.name} onChange={set} autoComplete="name" aria-invalid={missing && !form.name.trim()} className="field" />
            </div>
            <div>
              <label htmlFor="c-phone" className="field-label">Phone <span className="font-normal text-aggregate">(optional)</span></label>
              <input id="c-phone" name="phone" type="tel" value={form.phone} onChange={set} autoComplete="tel" className="field" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="c-company" className="field-label">Company <span className="font-normal text-aggregate">(optional)</span></label>
              <input id="c-company" name="company" value={form.company} onChange={set} autoComplete="organization" className="field" />
            </div>
            <div>
              <label htmlFor="c-product" className="field-label">Product</label>
              <select id="c-product" name="product" value={form.product} onChange={set} className="field">
                <option value="">Not sure yet</option>
                {productsData.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
                <option value="Custom units">Custom units</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="c-message" className="field-label">About the project</label>
            <textarea
              id="c-message"
              name="message"
              rows={5}
              value={form.message}
              onChange={set}
              placeholder="Location, sizes, quantities, when you need them"
              aria-invalid={missing && !form.message.trim()}
              className="field resize-y"
            />
          </div>

          {missing && <p role="alert" className="text-sm text-red-600 dark:text-red-400">Add your name and a few words about the project.</p>}
          {sent && !missing && (
            <p role="status" className="text-sm">
              {sent === 'whatsapp' ? 'WhatsApp opened with your message. Press send there and we will reply.' : 'Your email app opened with the message. Press send there and we will reply.'}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" className="btn-mark">Send on WhatsApp</button>
            <button type="button" onClick={() => send('email')} className="btn-line">Send by email</button>
          </div>
        </form>
      </div>
    </section>
  )
}
