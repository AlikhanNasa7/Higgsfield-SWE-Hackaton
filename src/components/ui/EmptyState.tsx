import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Icon && (
          <div className="w-16 h-16 rounded-2xl glass mx-auto flex items-center justify-center">
            <Icon className="w-8 h-8 text-muted" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-text">{title}</p>
          {description && <p className="text-xs text-muted mt-1 max-w-sm mx-auto">{description}</p>}
        </div>
        {action && <div className="pt-2">{action}</div>}
      </motion.div>
    </div>
  )
}
