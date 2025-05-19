import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98] shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.98] shadow-sm hover:shadow-md",
        outline:
          "border-2 border-input bg-background/60 hover:bg-accent/60 hover:text-accent-foreground active:scale-[0.98]",
        secondary:
          "bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-[0.98] shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent/60 hover:text-accent-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
        success: "bg-green-500/10 text-green-600 hover:bg-green-500/20 active:scale-[0.98] shadow-sm hover:shadow-md",
        warning: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 active:scale-[0.98] shadow-sm hover:shadow-md",
        info: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 active:scale-[0.98] shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
