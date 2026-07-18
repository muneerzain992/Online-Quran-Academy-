"use client";

import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  buildE164,
  filterDialCountries,
  parsePhoneValue,
  type DialCountry,
} from "@/lib/countries";
import { cn } from "@/lib/cn";

type PhoneInputProps = {
  label?: string;
  value: string;
  onChange: (e164: string) => void;
  onBlur?: () => void;
  error?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
};

type MenuPos = { top: number; left: number; width: number };

export function PhoneInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  name,
  required,
  placeholder,
}: PhoneInputProps) {
  const t = useTranslations("Forms.phone");
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState<DialCountry | null>(() =>
    value ? parsePhoneValue(value).country : null,
  );
  const [national, setNational] = useState(() =>
    value ? parsePhoneValue(value).national : "",
  );

  const numberPlaceholder = placeholder ?? t("selectFirst");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!value) {
      setCountry(null);
      setNational("");
      return;
    }
    const next = parsePhoneValue(value);
    if (next.country) setCountry(next.country);
    setNational(next.national);
  }, [value]);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(320, Math.max(260, window.innerWidth - 24));
    let left = r.left;
    if (left + width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - width - 12);
    }
    setPos({
      top: r.bottom + 6,
      left,
      width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
    const onScroll = () => updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
      setQuery("");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => searchRef.current?.focus(), 40);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const filtered = useMemo(() => filterDialCountries(query), [query]);

  const emit = (c: DialCountry | null, n: string) => {
    if (!c) {
      onChange("");
      return;
    }
    onChange(buildE164(c.dial, n));
  };

  const selectCountry = (c: DialCountry) => {
    setCountry(c);
    setOpen(false);
    setQuery("");
    emit(c, national);
  };

  const menu =
    mounted && open && pos
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={t("ariaList")}
            className="fixed z-[200] overflow-hidden rounded-xl border border-border bg-midnight shadow-2xl"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search")}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto overscroll-contain py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-muted">{t("noResults")}</li>
              ) : (
                filtered.map((c) => (
                  <li key={c.iso2}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={country?.iso2 === c.iso2}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectCountry(c)}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm hover:bg-royal/15",
                        country?.iso2 === c.iso2 && "bg-royal/10 text-sky",
                      )}
                    >
                      <span className="text-base" aria-hidden>
                        {c.flag}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-foreground">
                        {c.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-muted">
                        +{c.dial}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="space-y-1.5" ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {required ? <span className="text-sky"> *</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "flex rounded-xl border border-border bg-surface/50",
          error && "border-red-400/60",
          "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-royal",
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t("ariaCode")}
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-[7.75rem] shrink-0 items-center justify-between gap-1 rounded-s-xl border-e border-border px-2.5 py-2.5 text-sm text-foreground hover:bg-white/5"
        >
          {country ? (
            <>
              <span aria-hidden>{country.flag}</span>
              <span className="font-medium tabular-nums">+{country.dial}</span>
            </>
          ) : (
            <span className="text-muted">{t("code")}</span>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={country ? numberPlaceholder : t("selectFirst")}
          value={national}
          disabled={!country}
          onBlur={onBlur}
          onChange={(e) => {
            const n = e.target.value.replace(/[^\d\s]/g, "");
            setNational(n);
            emit(country, n);
          }}
          className="w-full rounded-e-xl bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {menu}

      <p className="text-[11px] text-muted">{t("hint")}</p>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
