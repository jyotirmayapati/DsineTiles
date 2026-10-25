const STEPS = [
  { title: 'Consultation', body: 'Tell us about the site, the loads and the quantities you need.' },
  { title: 'Engineering', body: 'We design the units around your project and adapt sizes where the standard range does not fit.' },
  { title: 'Manufacturing', body: 'Units are cast in our Baripada yard to the agreed specification.' },
  { title: 'Installation', body: 'Our installation team places and joins the units on site.' },
]

const CAPABILITIES = [
  { title: 'Modern production', body: 'Up-to-date production for precise, consistent units.' },
  { title: 'Quality assurance', body: 'Testing and inspection so every product meets the required standards.' },
  { title: 'Quick to install', body: 'Prefabricated units go together fast, cutting time and labour on site.' },
  { title: 'Greener concrete', body: 'Eco-friendly processes and recyclable materials for greener construction.' },
  { title: 'Custom engineering', body: 'Units designed to your project when the standard range does not fit.' },
  { title: 'Expert installation', body: 'An experienced team to place and join units on site.' },
]

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 grid gap-14 lg:grid-cols-[1fr_1.35fr]">
        <div className="lg:sticky lg:top-28 self-start">
          <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">How a project runs</h2>
          <p className="mt-6 max-w-md text-lg text-aggregate">
            One team from the first drawing to the last unit on site, so nothing gets lost between design and delivery.
          </p>
        </div>

        <div>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-formline py-8">
                <span className="type-display text-3xl text-aggregate tabular">{i + 1}</span>
                <div>
                  <h3 className="type-wide text-2xl">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-aggregate">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="mt-16 type-wide text-xl">What you can count on</h3>
          <dl className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {CAPABILITIES.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold">{c.title}</dt>
                <dd className="mt-1 text-aggregate">{c.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
