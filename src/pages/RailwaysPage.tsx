import { lazy } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollStory from '../components/story/ScrollStory'
import type { SceneProps } from '../components/story/StoryScene'
import { RAIL_STAGES } from '../components/railway/stages'
import { whatsappLink } from '../data/contact'

// three.js and the station load with this page only
const RailScene = lazy(async () => {
  const [{ default: StoryScene }, { default: def }] = await Promise.all([
    import('../components/story/StoryScene'),
    import('../components/railway/railStory'),
  ])
  return { default: (props: SceneProps) => <StoryScene def={def} {...props} /> }
})

// Elements shown in the station. Items with a product page link to it; the rest are enquiries.
const RANGE: { group: string; items: { name: string; note: string; productId?: string }[] }[] = [
  {
    group: 'Track and formation',
    items: [
      { name: 'Box culverts', note: 'Carry streams and drains under the line.', productId: 'box-culverts' },
      { name: 'U drains', note: 'Between tracks and along the formation.', productId: 'u-drains' },
      { name: 'Cable trenches', note: 'For signalling and power cables.', productId: 'cable-trays' },
      { name: 'Sleepers', note: 'Precast concrete sleepers for the track.' },
      { name: 'Km stones', note: 'Line distance markers.' },
      { name: 'Gradient posts', note: 'Gradient markers beside the line.' },
      { name: 'Fouling marks', note: 'Clearance markers between converging tracks.' },
    ],
  },
  {
    group: 'Platforms',
    items: [
      { name: 'Platform walls', note: 'Precast retaining walls on the track face.', productId: 'retaining-walls' },
      { name: 'Platform coping', note: 'Edge units with the yellow warning band.' },
      { name: 'Tactile chequered tiles', note: 'Warning strip behind the platform edge.', productId: 'chequered-tiles' },
      { name: 'Pavers', note: 'Hard-wearing platform surface.', productId: 'pavers' },
    ],
  },
  {
    group: 'Structures',
    items: [
      { name: 'Shed footings and columns', note: 'Bases and columns for platform sheds.' },
      { name: 'Beams and girders', note: 'Shed cantilevers and bridge girders.', productId: 'precast-beams' },
      { name: 'Hollow-core slabs', note: 'Station roofs and bridge decks.', productId: 'precast-slabs' },
      { name: 'Foot over bridges', note: 'Piers, girders, deck and parapets.' },
      { name: 'Staircases', note: 'Precast stair flights and landings.' },
    ],
  },
  {
    group: 'Station',
    items: [
      { name: 'Name and signage boards', note: 'Precast boards on precast posts.' },
      { name: 'Picket boundary walls', note: 'Station and yard boundaries.', productId: 'walls-and-fencing' },
      { name: 'Benches', note: 'Platform and concourse seating.', productId: 'furniture-and-decor' },
      { name: 'Lamp posts', note: 'Platform and approach lighting.', productId: 'light-poles' },
    ],
  },
]

const enquire = whatsappLink("Hi, I'd like to discuss precast elements for a railway project.")

export default function RailwaysPage() {
  return (
    <>
      <Navigation />
      <main>
        <ScrollStory
          id="station"
          stages={RAIL_STAGES}
          Scene={RailScene}
          idlePart="Bare formation"
          intro={
            <>
              <h1 className="type-display text-[2.5rem] sm:text-6xl xl:text-[4rem] rise">Precast for the railways.</h1>
              <p className="mt-6 max-w-md text-lg text-aggregate rise rise-2">
                From the culvert under the line to the bridge over it, a station can be built from precast. Scroll to watch one come together, from bare ground to the first train.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 rise rise-3">
                <a href={enquire} target="_blank" rel="noopener noreferrer" className="btn-mark">Discuss a railway project</a>
                <a href="#range" className="btn-line">See the railway range</a>
              </div>
            </>
          }
        />

        <section id="range" className="py-24 sm:py-32 border-t border-formline">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-end">
              <h2 className="type-display text-4xl sm:text-5xl lg:text-6xl">The railway range</h2>
              <p className="text-lg text-aggregate max-w-lg lg:justify-self-end">
                Elements for stations, platforms and track, cast to your drawings. Ask about anything you see in the station above.
              </p>
            </div>
            <div className="mt-14 grid gap-12 sm:grid-cols-2 xl:grid-cols-4">
              {RANGE.map((g) => (
                <div key={g.group}>
                  <h3 className="type-wide text-xl border-b border-formline pb-3">{g.group}</h3>
                  <dl className="mt-5 space-y-5">
                    {g.items.map((it) => (
                      <div key={it.name}>
                        <dt className="font-semibold">
                          {it.productId ? (
                            <Link to={`/products/${it.productId}`} className="underline decoration-marking decoration-2 underline-offset-4 hover:decoration-graphite">
                              {it.name}
                            </Link>
                          ) : (
                            it.name
                          )}
                        </dt>
                        <dd className="mt-0.5 text-aggregate">{it.note}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-formline bg-slab">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8 py-20 grid gap-8 lg:grid-cols-[1fr_auto] items-end">
            <div>
              <h2 className="type-display text-3xl sm:text-4xl lg:text-5xl">Working on a station or a line?</h2>
              <p className="mt-4 max-w-xl text-lg text-aggregate">
                Send the drawings and quantities. We reply with what we can cast, lead times and a price.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={enquire} target="_blank" rel="noopener noreferrer" className="btn-mark">Discuss on WhatsApp</a>
              <Link to="/#contact" className="btn-line">Send an enquiry</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
