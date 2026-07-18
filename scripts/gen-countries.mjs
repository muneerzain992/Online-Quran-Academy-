import fs from "fs";
import path from "path";
import os from "os";

const src = path.join(os.tmpdir(), "countries.json");
const d = JSON.parse(fs.readFileSync(src, "utf8"));
const rows = [];

for (const c of d) {
  const root = c.idd?.root;
  const suffixes = c.idd?.suffixes;
  if (!root || !suffixes?.length) continue;
  const name = c.name?.common || c.name?.official;
  const iso2 = c.cca2;
  const flag = c.flag || "";
  if (!name || !iso2) continue;

  // One primary dial code per country/territory (SIM-style)
  const dial = `${root}${suffixes[0]}`.replace(/\+/g, "");
  rows.push({ iso2, name, dial, flag });
}

const seen = new Set();
const unique = [];
for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  if (seen.has(r.iso2)) continue;
  seen.add(r.iso2);
  unique.push(r);
}

const out = `export type DialCountry = {
  iso2: string;
  name: string;
  /** Digits only, no leading + */
  dial: string;
  flag: string;
};

/** Full ITU/E.164 country calling codes (SIM-style picker). */
export const dialCountries: DialCountry[] = ${JSON.stringify(unique, null, 2)};

/** Longest dial-code match first so +971 beats +9, etc. */
const byDialLength = [...dialCountries].sort(
  (a, b) => b.dial.length - a.dial.length,
);

export function findCountryByIso(iso2: string) {
  return dialCountries.find((c) => c.iso2 === iso2) ?? null;
}

export function parsePhoneValue(value: string): {
  country: DialCountry | null;
  national: string;
} {
  const digits = value.replace(/\\D/g, "");
  if (!digits) {
    return { country: null, national: "" };
  }
  for (const c of byDialLength) {
    if (digits.startsWith(c.dial)) {
      return { country: c, national: digits.slice(c.dial.length) };
    }
  }
  return { country: null, national: digits };
}

export function buildE164(dial: string, national: string) {
  const n = national.replace(/\\D/g, "").replace(/^0+/, "");
  return n ? \`+\${dial}\${n}\` : \`+\${dial}\`;
}

export function filterDialCountries(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return dialCountries;
  const qDigits = q.replace(/\\D/g, "");
  return dialCountries.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.iso2.toLowerCase().includes(q)) return true;
    if (qDigits && c.dial.includes(qDigits)) return true;
    if (q.startsWith("+") && c.dial.startsWith(q.slice(1))) return true;
    return false;
  });
}
`;

const dest = path.join(process.cwd(), "src", "lib", "countries.ts");
fs.writeFileSync(dest, out);
console.log(`Wrote ${unique.length} countries to ${dest}`);
