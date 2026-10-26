// One step of a scroll story: the copy beside the 3D model while that stage assembles
export interface Stage {
  title: string
  body: string
  part: string
  links?: { label: string; productId: string }[]
}
