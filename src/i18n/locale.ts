"use server";

import { cookies } from "next/headers";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";

export async function getUserLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(localeCookieName)?.value;
  return isLocale(raw) ? raw : defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  const store = await cookies();
  store.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
