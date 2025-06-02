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
    variant?: "default" | "secondary" | "primary"
  }[]
}

interface DockIconButtonProps {
  icon?: LucideIcon
  customIcon?: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
  customComponent?: React.ReactNode
  variant?: "default" | "secondary" | "primary"
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, customIcon, label, onClick, className, customComponent, variant = "default" }, ref) => {
    if (customComponent) {
      return (
        <div className="w-full">
          {customComponent}
        </div>
      );
    }

    const variantClasses = {
      default: "hover:bg-secondary",
      secondary: "bg-secondary hover:bg-primary hover:text-primary-foreground",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-lg w-12 h-12 flex items-center justify-center",
          "transition-colors",
          variantClasses[variant],
          className
        )}
      >
        {customIcon ? (
          <div className="w-5 h-5 flex items-center justify-center">
            {customIcon}
          </div>
        ) : Icon ? (
          <Icon className="w-5 h-5" />
        ) : null}
        <span className={cn(
          "absolute px-2 py-1 rounded text-xs",
          "-top-12 left-1/2 -translate-x-1/2 sm:-left-2 sm:top-1/2 sm:-translate-y-1/2 sm:-translate-x-full",
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
          "flex items-center gap-2 p-2 rounded-2xl w-full",
          "flex-row justify-around sm:flex-col sm:justify-center sm:w-auto",
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