import { MaterialType, Unit } from "@prisma/client"
import { Trash2, Cpu, TreePine, Hammer } from "lucide-react"

// Image upload constants
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGES_PER_LISTING = 2
export const MAX_IMAGE_WIDTH = 800

// Form validation constants
export const MAX_TITLE_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 500

// Material type options with icons and labels
export const MATERIAL_TYPE_OPTIONS = [
  {
    value: MaterialType.PLASTIC,
    label: "Plastic",
    description: "Bottles, containers, packaging",
    icon: Trash2,
  },
  {
    value: MaterialType.ORGANIC,
    label: "Organic",
    description: "Food waste, garden waste, compost",
    icon: TreePine,
  },
  {
    value: MaterialType.CONSTRUCTION,
    label: "Construction",
    description: "Concrete, wood, metal, tiles",
    icon: Hammer,
  },
  {
    value: MaterialType.EWASTE,
    label: "E-waste",
    description: "Electronics, phones, computers",
    icon: Cpu,
  },
] as const

// Unit options
export const UNIT_OPTIONS = [
  {
    value: Unit.KG,
    label: "Kilograms (kg)",
  },
  {
    value: Unit.TONNES,
    label: "Tonnes",
  },
  {
    value: Unit.PIECES,
    label: "Pieces",
  },
  {
    value: Unit.LITERS,
    label: "Liters",
  },
  {
    value: Unit.BAGS,
    label: "Bags",
  },
] as const

// User type labels
export const USER_TYPE_LABELS = {
  INDIVIDUAL: "Individual",
  BUSINESS: "Business",
  RECYCLER: "Recycler",
  ARTISAN: "Artisan",
  MANUFACTURER: "Manufacturer",
} as const