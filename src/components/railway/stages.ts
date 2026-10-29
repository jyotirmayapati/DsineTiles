import type { Stage } from '../story/stage'

// Story steps for the railway station. Index = stage number in railStory.
export const RAIL_STAGES: Stage[] = [
  {
    title: 'Prepare the formation',
    body: 'Before any rail goes down, the water is handled. A box culvert carries the stream under the line, a U drain runs between the tracks, and a cable trench is laid for signalling.',
    part: 'Culvert, drains and cable trench',
    links: [
      { label: 'Box culverts', productId: 'box-culverts', pick: 'box-culvert' },
      { label: 'U drains', productId: 'u-drains', pick: 'u-drain' },
      { label: 'Cable trench', productId: 'cable-trays', pick: 'cable-trench' },
    ],
  },
  {
    title: 'Lay the track',
    body: 'Ballast beds take precast sleepers at even spacing, the rails go down, and the line is marked with a km stone, a gradient post and a fouling mark.',
    part: 'Sleepers, rails and track markers',
  },
  {
    title: 'Build the platforms',
    body: 'Precast walls face the track and hold the platform fill. Coping with a yellow edge band caps them, tactile chequered tiles warn of the edge, and pavers finish the surface.',
    part: 'Platform walls, coping and paving',
    links: [
      { label: 'Platform walls', productId: 'retaining-walls', pick: 'platform-wall' },
      { label: 'Chequered tiles', productId: 'chequered-tiles', pick: 'tactile-tiles' },
      { label: 'Pavers', productId: 'pavers', pick: 'pavers' },
    ],
  },
  {
    title: 'Raise the sheds',
    body: 'Footings sit on the platform, precast columns go up, and cantilever beams carry the roof over waiting passengers.',
    part: 'Footings, columns and beams',
    links: [{ label: 'Precast beams', productId: 'precast-beams', pick: 'cantilever-beam' }],
  },
  {
    title: 'Build the station',
    body: 'Columns, beams and hollow-core roof slabs frame the station building, wall panels close it in, and the name boards go up.',
    part: 'Station building and name boards',
    links: [
      { label: 'Hollow-core slabs', productId: 'precast-slabs', pick: 'hollow-core' },
      { label: 'Precast beams', productId: 'precast-beams', pick: 'cantilever-beam' },
    ],
  },
  {
    title: 'Bridge the tracks',
    body: 'Piers rise on both platforms, precast girders span the tracks and hollow-core slabs form the deck. Precast stair flights bring passengers down to each platform.',
    part: 'Foot over bridge and staircases',
    links: [
      { label: 'Girders', productId: 'precast-beams', pick: 'girders' },
      { label: 'Deck slabs', productId: 'precast-slabs', pick: 'hollow-core' },
    ],
  },
  {
    title: 'Open the station',
    body: 'A precast picket fence marks the boundary, benches and lamps go in, and the first passengers walk onto the platforms.',
    part: 'Boundary, furniture and lighting',
    links: [
      { label: 'Fencing', productId: 'walls-and-fencing', pick: 'picket-fence' },
      { label: 'Benches', productId: 'furniture-and-decor', pick: 'bench' },
      { label: 'Lamp posts', productId: 'light-poles', pick: 'lamp-post' },
    ],
  },
  {
    title: 'Train arriving',
    body: 'The station is ready. Every element you have seen, from the culvert under the line to the bridge above it, is precast.',
    part: 'Arrival at platform 1',
  },
]
