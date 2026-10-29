import { lazy } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollStory from '../components/story/ScrollStory'
import type { SceneProps } from '../components/story/StoryScene'
import { RAIL_STAGES } from '../components/railway/stages'
import RailRange from '../components/railway/RailRange'
import { whatsappLink } from '../data/contact'

// three.js and the station load with this page only
const RailScene = lazy(async () => {
  const [{ default: StoryScene }, { default: def }] = await Promise.all([
    import('../components/story/StoryScene'),
    import('../components/railway/railStory'),
  ])
  return { default: (props: SceneProps) => <StoryScene def={def} {...props} /> }
})

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
          onPick={(element) => window.dispatchEvent(new CustomEvent('range:open', { detail: { id: element } }))}
          weather={{ label: 'Monsoon', caption: 'Monsoon: the U drain and box culvert carry the water away' }}
          intro={
            <>
              <h1 className="type-display text-[2.5rem] sm:text-6xl xl:text-[4rem] rise">Precast for the railways.</h1>
              <p className="mt-6 max-w-md text-lg text-aggregate rise rise-2">
                From the culvert under the line to the bridge over it, a station can be built from precast. Scroll to watch one come together, from bare ground to the first train.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 rise rise-3">
                <a href={enquire} target="_blank" rel="noopener noreferrer" className="btn-mark">Discuss a railway project</a>
                <a href="#range" className="btn-line">See every element</a>
              </div>
            </>
          }
        />

        <RailRange />

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
