import { lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsData } from '../../data/products'
import ScrollStory from '../story/ScrollStory'
import type { SceneProps } from '../story/StoryScene'
import { STAGES } from './stages'

// three.js and the scene load as soon as the home page renders, while the hero copy animates in
const SiteScene = lazy(async () => {
  const [{ default: StoryScene }, { default: def }] = await Promise.all([import('../story/StoryScene'), import('./siteStory')])
  return { default: (props: SceneProps) => <StoryScene def={def} {...props} /> }
})

export default function AssemblySection() {
  const navigate = useNavigate()
  return (
    <ScrollStory
      id="top"
      stages={STAGES}
      Scene={SiteScene}
      idlePart="Clean ground, set out"
      // On load the ground is set out by itself (string lines and pegs); footings and everything after wait for scroll
      introProgress={0.28}
      intro={
        <>
          <h1 className="type-display text-[2.5rem] sm:text-6xl xl:text-[4rem] rise">Precast, from footing to finish.</h1>
          <p className="mt-6 max-w-md text-lg text-aggregate rise rise-2">
            We cast drains, culverts, beams, slabs, walls, pavers and blocks in Baripada, Odisha. Scroll to watch a site go up from them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 rise rise-3">
            <a href="#contact" className="btn-mark">Get a quote</a>
            <button onClick={() => navigate('/products')} className="btn-line">
              Browse {productsData.length} products
            </button>
          </div>
        </>
      }
    />
  )
}
