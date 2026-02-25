"use client";

import { useMemo, useState } from "react";

type YearMode = "2027_2028" | "from_2029";
type InputMode = "monthly" | "yearly";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function formatPct(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function calcZulagen(params: { eigenJahr: number; children: number; yearMode: YearMode; bonusUnder25: boolean }) {
  const E = Math.max(0, params.eigenJahr);
  const children = clamp(params.children, 0, 12);

  const rate1 = params.yearMode === "from_2029" ? 0.35 : 0.30;
  const rate2 = 0.20;
  const childRate = 0.25;

  const E1 = Math.min(E, 1200);
  const E2 = Math.min(Math.max(E - 1200, 0), 600);

  const Z1 = E1 * rate1;
  const Z2 = E2 * rate2;
  const base = Z1 + Z2;

  const childPer = Math.min(E, 1200) * childRate;
  const childTotal = children * childPer;

  const totalAnnual = base + childTotal;
  const totalIntoContract = E + totalAnnual;

  const bonusOneOff = params.bonusUnder25 ? 200 : 0;
  const fundingRate = E > 0 ? totalAnnual / E : 0;

  return {
    eigen: E,
    grundzulage: base,
    grundzulageStufe1: Z1,
    grundzulageStufe2: Z2,
    kinderzulageProKind: childPer,
    kinderzulageTotal: childTotal,
    zulageTotal: totalAnnual,
    totalIntoContract,
    fundingRate,
    bonusOneOff,
    cappedInfo: E > 1800,
  };
}

export default function AltersvorsorgeRechner() {
  const [inputMode, setInputMode] = useState<InputMode>("monthly");
  const [amount, setAmount] = useState<number>(100);
  const [yearMode, setYearMode] = useState<YearMode>("2027_2028");
  const [children, setChildren] = useState<number>(0);
  const [bonusUnder25, setBonusUnder25] = useState<boolean>(false);
  const [openHow, setOpenHow] = useState<boolean>(false);

  const eigenJahr = useMemo(() => {
    const a = Math.max(0, amount);
    return inputMode === "monthly" ? a * 12 : a;
  }, [amount, inputMode]);

  const res = useMemo(
    () => calcZulagen({ eigenJahr, children, yearMode, bonusUnder25 }),
    [eigenJahr, children, yearMode, bonusUnder25]
  );

  const eigenMonat = res.eigen / 12;
  const zulageMonat = res.zulageTotal / 12;
  const totalMonat = res.totalIntoContract / 12;

  return (
    <section className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Rechner</h2>
          <p className="mt-1 text-sm text-neutral-600">Eingaben ändern → Ergebnis aktualisiert sofort.</p>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">Eingabe</label>
            <div className="mt-2 flex rounded-xl border bg-neutral-50 p-1">
              <button
                onClick={() => setInputMode("monthly")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                  inputMode === "monthly" ? "bg-white shadow-sm" : "text-neutral-600"
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setInputMode("yearly")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                  inputMode === "yearly" ? "bg-white shadow-sm" : "text-neutral-600"
                }`}
              >
                Jährlich
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">
              {inputMode === "monthly" ? "Eigenbeitrag pro Monat" : "Eigenbeitrag pro Jahr"}
            </label>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                value={Number.isFinite(amount) ? amount : 0}
                onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, 100000))}
                className="w-40 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
              />
              <span className="text-sm text-neutral-600">{inputMode === "monthly" ? "€ / Monat" : "€ / Jahr"}</span>
            </div>

            <input
              type="range"
              min={0}
              max={inputMode === "monthly" ? 500 : 10000}
              step={inputMode === "monthly" ? 5 : 50}
              value={clamp(amount, 0, inputMode === "monthly" ? 500 : 10000)}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-3 w-full"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {inputMode === "monthly" ? (
                <>
                  {[25, 50, 100, 150].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className="rounded-full border bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm hover:bg-neutral-50"
                    >
                      {v} €
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {[300, 600, 1200, 1800].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className="rounded-full border bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm hover:bg-neutral-50"
                    >
                      {v} €
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">Förderjahr</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setYearMode("2027_2028")}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  yearMode === "2027_2028" ? "bg-neutral-900 text-white" : "bg-white text-neutral-800"
                }`}
              >
                2027–2028
                <div className={`mt-0.5 text-xs ${yearMode === "2027_2028" ? "text-neutral-200" : "text-neutral-500"}`}>
                  0,30 € / € bis 1.200
                </div>
              </button>
              <button
                onClick={() => setYearMode("from_2029")}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  yearMode === "from_2029" ? "bg-neutral-900 text-white" : "bg-white text-neutral-800"
                }`}
              >
                ab 2029
                <div className={`mt-0.5 text-xs ${yearMode === "from_2029" ? "text-neutral-200" : "text-neutral-500"}`}>
                  0,35 € / € bis 1.200
                </div>
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">Kinder</label>
            <p className="mt-1 text-xs text-neutral-500">
              Kinderzulage: 0,25 € pro € Eigenbeitrag bis 1.200 €/Jahr (= max. 300 €/Kind).
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setChildren((c) => clamp(c - 1, 0, 12))}
                className="h-10 w-10 rounded-xl border bg-white text-lg text-neutral-800 shadow-sm hover:bg-neutral-50"
              >
                –
              </button>
              <div className="min-w-12 text-center text-lg font-semibold">{children}</div>
              <button
                onClick={() => setChildren((c) => clamp(c + 1, 0, 12))}
                className="h-10 w-10 rounded-xl border bg-white text-lg text-neutral-800 shadow-sm hover:bg-neutral-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border bg-neutral-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-neutral-800">Berufseinsteigerbonus</div>
                <div className="text-xs text-neutral-600">Einmalig 200 € bei Abschluss vor 25.</div>
              </div>
              <button
                onClick={() => setBonusUnder25((v) => !v)}
                className={`h-8 w-14 rounded-full border p-1 transition ${
                  bonusUnder25 ? "bg-neutral-900" : "bg-white"
                }`}
                aria-label="Bonus Toggle"
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow-sm transition ${
                    bonusUnder25 ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {res.cappedInfo && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Hinweis: Für die Zulageberechnung werden nur Eigenbeiträge bis 1.800 €/Jahr berücksichtigt.
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Ergebnis</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Darstellung: {inputMode === "monthly" ? "monatlich + jährlich" : "jährlich + monatlich"}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-neutral-600">Förderquote</div>
              <div className="text-2xl font-semibold text-neutral-900">{formatPct(res.fundingRate)}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultCard title="Eigenbeitrag" value={formatEUR(res.eigen)} subtitle={`${formatEUR(eigenMonat)} / Monat`} />
            <ResultCard title="Staatliche Zulage" value={formatEUR(res.zulageTotal)} subtitle={`${formatEUR(zulageMonat)} / Monat`} />
            <ResultCard title="Gesamt im Vertrag" value={formatEUR(res.totalIntoContract)} subtitle={`${formatEUR(totalMonat)} / Monat`} />
            <ResultCard
              title="Einmaliger Bonus"
              value={res.bonusOneOff ? formatEUR(res.bonusOneOff) : "–"}
              subtitle={res.bonusOneOff ? "bei Abschluss vor 25" : "nicht ausgewählt"}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <BreakdownRow label="Grundzulage (gesamt)" value={formatEUR(res.grundzulage)} />
            <BreakdownRow label="Kinderzulage (gesamt)" value={formatEUR(res.kinderzulageTotal)} />

            <div className="rounded-xl border bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-900">Grundzulage – Aufschlüsselung</div>
              <div className="mt-3 space-y-2 text-sm text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>Bis 1.200 € × {yearMode === "from_2029" ? "0,35" : "0,30"}</span>
                  <span className="font-medium">{formatEUR(res.grundzulageStufe1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>1.200–1.800 € × 0,20</span>
                  <span className="font-medium">{formatEUR(res.grundzulageStufe2)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-neutral-50 p-4">
              <div className="text-sm font-medium text-neutral-900">Kinderzulage – pro Kind</div>
              <div className="mt-2 text-sm text-neutral-700">
                {children === 0 ? (
                  <span>Keine Kinder ausgewählt.</span>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Pro Kind</span>
                      <span className="font-medium">{formatEUR(res.kinderzulageProKind)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>Kinder ({children})</span>
                      <span className="font-medium">{formatEUR(res.kinderzulageTotal)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setOpenHow((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              <span>So wird gerechnet</span>
              <span className="text-neutral-500">{openHow ? "–" : "+"}</span>
            </button>
            {openHow && (
              <div className="mt-3 rounded-xl border bg-neutral-50 p-4 text-sm text-neutral-700">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Grundzulage ist beitragsproportional (bis 1.800 €/Jahr).</li>
                  <li>Bis 1.200 €/Jahr: {yearMode === "from_2029" ? "0,35" : "0,30"} € je € Eigenbeitrag.</li>
                  <li>1.200–1.800 €/Jahr: 0,20 € je € Eigenbeitrag.</li>
                  <li>Kinderzulage: 0,25 € je € bis 1.200 €/Jahr (max. 300 € pro Kind).</li>
                  <li>Bonus: optional 200 € einmalig (Abschluss vor 25).</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard(props: { title: string; value: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-700">{props.title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{props.value}</div>
      {props.subtitle && <div className="mt-1 text-sm text-neutral-500">{props.subtitle}</div>}
    </div>
  );
}

function BreakdownRow(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
      <span className="text-sm text-neutral-700">{props.label}</span>
      <span className="text-sm font-semibold text-neutral-900">{props.value}</span>
    </div>
  );
}