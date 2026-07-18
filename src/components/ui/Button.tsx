import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-royal text-white shadow-[0_0_24px_rgb(30_90_255_/_0.35)] hover:bg-royal/90",
  secondary:
    "glass text-foreground hover:border-sky/40 hover:bg-white/10",
  ghost: "text-muted hover:bg-white/5 hover:text-foreground",
  gold: "bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25",
} as const;

const sizes = {
  sm: "px-3 py-2 text-xs rounded-lg",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
} as const;

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
