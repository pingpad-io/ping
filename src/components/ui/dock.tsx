import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/src/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
  className?: string
  items: {
    icon?: LucideIcon
    customIcon?: React.ReactNode
    label: string
    onClick?: () => void
    customComponent?: React.ReactNode
  }[]
}

interface DockIconButtonProps {
  icon?: LucideIcon
  customIcon?: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
  customComponent?: React.ReactNode
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, customIcon, label, onClick, className, customComponent }, ref) => {
    if (customComponent) {
      return (
        <div className="w-full">
          {customComponent}
        </div>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-lg w-12 h-12 flex items-center justify-center",
          "hover:bg-secondary transition-colors",
          className
        )}
      >
        {customIcon ? (
          <div className="w-5 h-5 flex items-center justify-center">
            {customIcon}
          </div>
        ) : Icon ? (
          <Icon className="w-5 h-5 text-foreground" />
        ) : null}
        <span className={cn(
          "absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full",
          "px-2 py-1 rounded text-xs",
          "bg-popover text-popover-foreground",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity whitespace-nowrap pointer-events-none"
        )}>
          {label}
        </span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-center", className)}>
        <div className={cn(
          "flex flex-col items-center gap-2 p-2 rounded-2xl",
          "backdrop-blur-lg border shadow-lg",
          "bg-background/90 border-border",
          "hover:shadow-xl transition-shadow duration-300"
        )}>
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </div>
      </div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }