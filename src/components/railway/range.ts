import type { ViewerModelId } from '../viewer3d/modelIds'
import type { Params } from '../viewer3d/types'

// Every precast element in the station, grouped by the stage that builds it.
// Each has a close-up from the station model (/images/railway/<id>-light|dark.webp);
// pin is where the element sits in that image, in % from the left and top.
export interface RangeItem {
  id: string
  name: string
  note: string // one line, on the card
  about: string // a few lines, in the detail panel
  pin: [number, number]
  model: ViewerModelId // 3D model shown in the detail panel
  preset?: Params // its starting options
  productId?: string // catalogue product, when we make it as standard
}

export const RAIL_RANGE: { stage: number; items: RangeItem[] }[] = [
  {
    stage: 0,
    items: [
      { id: 'box-culvert', name: 'Box culverts', note: 'Carry streams and storm water under the line.', about: 'Square precast sections laid end to end to carry a stream, nala or storm drain under the formation. Joints are sealed on site and the line is built over them.', pin: [50, 50], model: 'box-culverts', productId: 'box-culverts' },
      { id: 'u-drain', name: 'U drains', note: 'Drain the formation between the tracks.', about: 'Open channels laid between and beside the tracks to take rainwater off the formation, so the ballast and subgrade stay dry. Covers can be added where people walk.', pin: [50, 50], model: 'u-drains', productId: 'u-drains' },
      { id: 'cable-trench', name: 'Cable trenches', note: 'Protect signalling and power cables beside the line.', about: 'Precast troughs with removable covers that carry signalling, telecom and power cables along the line, protected but easy to reach for maintenance.', pin: [50, 50], model: 'cable-trays', productId: 'cable-trays' },
    ],
  },
  {
    stage: 1,
    items: [
      { id: 'sleepers', name: 'Concrete sleepers', note: 'Hold the rails to gauge on the ballast.', about: 'Prestressed concrete sleepers hold the two rails at the right gauge and spread train loads into the ballast. They are laid at even spacing along the track.', pin: [50, 50], model: 'rail-sleepers' },
      { id: 'km-stone', name: 'Km stones', note: 'Mark the distance along the line.', about: 'Marks the distance along the line, so crews and drivers can locate any point on the route. Painted white with the kilometre number on both faces.', pin: [50, 50], model: 'rail-km-stone' },
      { id: 'gradient-post', name: 'Gradient posts', note: 'Show the gradient where it changes.', about: 'Placed where the gradient of the line changes, showing the new gradient to drivers and maintenance staff.', pin: [50, 61.8], model: 'rail-gradient-post' },
      { id: 'fouling-mark', name: 'Fouling marks', note: 'Mark the clearance point where two tracks meet.', about: 'Set between two converging tracks at the point beyond which a vehicle on one track would foul the other. Painted in black and white bands.', pin: [50, 50], model: 'rail-fouling-mark' },
    ],
  },
  {
    stage: 2,
    items: [
      { id: 'platform-wall', name: 'Platform walls', note: 'Face the track and hold back the platform fill.', about: 'Precast wall units on the track face of the platform. They hold back the platform fill and give a straight, true edge at the right distance from the track.', pin: [49.8, 52.2], model: 'retaining-walls', productId: 'retaining-walls' },
      { id: 'coping', name: 'Platform coping', note: 'Caps the platform edge, with the yellow warning band.', about: 'Caps the top of the platform wall with an overhanging nose. The yellow band painted along it warns passengers to keep back from the edge.', pin: [50, 50], model: 'rail-coping' },
      { id: 'tactile-tiles', name: 'Tactile chequered tiles', note: 'Warn passengers they are near the edge.', about: 'Raised-pattern tiles laid behind the platform edge. Passengers, including those with low vision, can feel them underfoot and know the edge is close.', pin: [50, 50], model: 'chequered-tiles', productId: 'chequered-tiles' },
      { id: 'pavers', name: 'Pavers', note: 'A hard-wearing surface for the platform.', about: 'Interlocking pavers make a hard-wearing platform surface that is quick to lay and easy to lift and relay for cable or drain work.', pin: [50, 50], model: 'pavers', productId: 'pavers' },
    ],
  },
  {
    stage: 3,
    items: [
      { id: 'shed-footing', name: 'Shed footings', note: 'Spread the column loads into the platform.', about: 'Pad footings set into the platform, each taking one shed column and spreading its load into the fill below.', pin: [50, 50], model: 'rail-shed-footing' },
      { id: 'column', name: 'Precast columns', note: 'Carry the shed and station roofs.', about: 'Columns stand on the footings and carry the shed and station roofs.', pin: [50, 50], model: 'rail-column' },
      { id: 'cantilever-beam', name: 'Cantilever beams', note: 'Hold the shed roof out over the platform.', about: 'Beams fixed to the column heads reach out over the platform, so passengers are sheltered without extra posts near the edge.', pin: [34.7, 47], model: 'precast-beams', productId: 'precast-beams' },
    ],
  },
  {
    stage: 4,
    items: [
      { id: 'hollow-core', name: 'Hollow-core slabs', note: 'Span the station roof without props.', about: 'Hollow-core slabs span between the station beams to form the roof, and between bridge girders to form the deck. The cores keep them light.', pin: [52.6, 41.6], model: 'precast-slabs', productId: 'precast-slabs' },
      { id: 'wall-panels', name: 'Wall panels', note: 'Close in the station building.', about: 'Storey-height wall panels close in the station building, cast with openings for windows and doors.', pin: [50, 50], model: 'rail-wall-panel' },
      { id: 'name-board', name: 'Name boards', note: 'The station name on precast posts.', about: 'The station name in black on yellow, on a precast board between precast posts. Placed at both ends of each platform.', pin: [50, 66], model: 'rail-name-board' },
    ],
  },
  {
    stage: 5,
    items: [
      { id: 'fob', name: 'Foot over bridge', note: 'Piers, deck and parapets, all precast.', about: 'A foot over bridge built entirely from precast: piers on the platforms, girders across the tracks, a hollow-core deck, parapet panels and stairs.', pin: [50, 50], model: 'rail-fob' },
      { id: 'girders', name: 'Bridge girders', note: 'Span the tracks between the piers.', about: 'Precast girders span the tracks between the bridge piers and carry the deck slabs above.', pin: [50, 50], model: 'precast-beams', productId: 'precast-beams' },
      { id: 'staircase', name: 'Staircases', note: 'Stair flights and landings down to each platform.', about: 'Precast stair flights with a mid landing take passengers from the bridge deck down to each platform.', pin: [50, 50], model: 'rail-staircase' },
    ],
  },
  {
    stage: 6,
    items: [
      { id: 'picket-fence', name: 'Picket boundary walls', note: 'Mark and secure the station boundary.', about: 'Precast posts and pickets on a plinth mark the station boundary and keep people off the line, while staying open to view.', pin: [50, 50], model: 'rail-picket-fence', productId: 'walls-and-fencing' },
      { id: 'bench', name: 'Benches', note: 'Seating for the platforms and concourse.', about: 'Precast concrete benches for platforms and concourses. Heavy enough to stay put, with nothing to rust or rot.', pin: [50, 50], model: 'furniture-and-decor', preset: { item: 'bench' }, productId: 'furniture-and-decor' },
      { id: 'lamp-post', name: 'Lamp posts', note: 'Light the platforms and approaches.', about: 'Precast lamp posts light the platforms and approaches, matching the rest of the station\'s concrete.', pin: [50, 50], model: 'light-poles', preset: { style: 'post', lit: true }, productId: 'light-poles' },
    ],
  },
]
