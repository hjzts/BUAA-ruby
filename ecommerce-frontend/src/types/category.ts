export interface Category {
  id: number
  name: string
  description: string
  icon_url: string
  parent_id: number | null
  position: number
  children?: Category[]
}
