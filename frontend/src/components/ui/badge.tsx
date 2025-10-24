import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success text-success-foreground shadow-[0_0_10px_hsl(var(--success)/0.3)]",
        trust: "border-accent/30 bg-accent/10 text-accent shadow-[0_0_15px_hsl(var(--accent)/0.2)]",
        gold: "border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200 shadow-[0_0_15px_#fbbf24/0.3]",
        silver: "border-slate-300/30 bg-gradient-to-r from-slate-400/20 to-gray-400/20 text-slate-200 shadow-[0_0_15px_#cbd5e1/0.3]",
        bronze: "border-orange-400/30 bg-gradient-to-r from-orange-600/20 to-orange-500/20 text-orange-200 shadow-[0_0_15px_#fb923c/0.3]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
