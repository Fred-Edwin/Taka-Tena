import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  } | ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-stone-400" />
      </div>

      <h3 className="text-lg font-semibold text-stone-950 mb-2">
        {title}
      </h3>

      <p className="text-stone-600 max-w-md mb-6">
        {description}
      </p>

      {action && (
        typeof action === 'object' && 'label' in action && 'onClick' in action ? (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        ) : action
      )}
    </div>
  )
}