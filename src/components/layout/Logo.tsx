import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

type LogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { box: "h-10 w-10", img: 40 },
  md: { box: "h-12 w-12", img: 48 },
  lg: { box: "h-20 w-20", img: 80 },
} as const;

export function Logo({
  href = "/",
  className,
  imageClassName,
  showText = true,
  priority = false,
  size = "sm",
}: LogoProps) {
  const dim = sizes[size];

  const mark = (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-white shadow-[0_0_20px_rgb(30_90_255_/_0.25)] ring-1 ring-white/20",
        dim.box,
        imageClassName,
      )}
    >
      <Image
        src="/logo.png"
        alt={`${site.name} logo`}
        width={dim.img}
        height={dim.img}
        className="h-full w-full object-cover"
        priority={priority}
      />
    </span>
  );

  const content = (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      {mark}
      {showText ? (
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-semibold leading-tight text-foreground sm:text-base">
            {site.shortName}
          </span>
          <span className="hidden truncate text-[11px] text-muted sm:block">
            Online Quran Academy
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="focus-ring group">
      {content}
    </Link>
  );
}
