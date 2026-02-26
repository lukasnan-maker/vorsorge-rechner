"use client";

import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

/**
 * Monatliche Verzinsung, Einzahlung am Monatsende.
 * FV = initial*(1+i)^n + P * [((1+i)^n - 1)/i]
 */
function futureValueMonthly(params: {
  monthlyContribution: number;
  months: number;
  annualReturnPct: number;
  initial: number;
}) {
  const P = Math.max(0, params.monthlyContribution);
  const n = Math.max(0, Math.floor(params.months));
  const r = params.annualReturnPct / 100;
  const i = r / 12;

  const initial = Math.max(0, params.initial);

  if (n === 0) return initial;
  if (Math.abs(i) < 1e-12) return initial + P * n;

  const pow = Math.pow(1 + i, n);
  return initial * pow + P * ((pow - 1) / i);
}

export default function FruehstartRechner() {
  const [birthYear, setBirthYear] = useState<number>(2020);

  // Zwei Felder 6–18:
  const [monthlyState, setMonthlyState] = useState<number>(10); // vorausgefüllt
  const [monthlyPrivate, setMonthlyPrivate] = useState<number>(0);

  // Optional ab 18: nur privat
  const [continueAfter18, setContinueAfter18] = useState<boolean>(false);
  const [privateAfter18, setPrivateAfter18] = useState<number>(0);
  const [growToAge, setGrowToAge] = useState<number>(67);

  // Rendite
  const [annualReturnPct, setAnnualReturnPct] = useState<number>(6);

  const res = useMemo(() => {
    const by = clamp(Number(birthYear) || 0, 1900, 2100);

    const startAge = 6;
    const endAge = 18;

    const monthsContrib = (endAge - startAge) * 12; // 144
    const state = clamp(Number(monthlyState) || 0, 0, 10); // Staatlich max. 10
    const priv = clamp(Number(monthlyPrivate) || 0, 0, 100000);

    const totalMonthly_6_18 = state + priv;

    const r = clamp(Number(annualReturnPct) || 0, -50, 50);

    // Kapital bis 18 (staatlich + privat 6-18)
    const capitalAt18 = futureValueMonthly({
      monthlyContribution: totalMonthly_6_18,
      months: monthsContrib,
      annualReturnPct: r,
      initial: 0,
    });

    // Summen (ohne Rendite)
    const totalStatePaid = state * monthsContrib;
    const totalPrivatePaid_6_18 = priv * monthsContrib;

    // Optional Phase nach 18
    const targetAge = clamp(Number(growToAge) || endAge, endAge, 100);
    const extraMonths = continueAfter18 ? (targetAge - endAge) * 12 : 0;

    const privAfter = continueAfter18 ? clamp(Number(privateAfter18) || 0, 0, 100000) : 0;
    const totalPrivatePaid_after18 = privAfter * extraMonths;

    // Kapital bis Zielalter:
    // Phase 1: 6–18 Einzahlung (state+priv) -> capitalAt18
    // Phase 2: ab 18 bis Zielalter Einzahlung nur privAfter (falls aktiv)
    const capitalAtTarget = extraMonths
      ? futureValueMonthly({
          monthlyContribution: privAfter,
          months: extraMonths,
          annualReturnPct: r,
          initial: capitalAt18,
        })
      : capitalAt18;

    return {
      birthYear: by,
      startAge,
      endAge,
      startYear: by + startAge,
      endYear: by + endAge,
      monthsContrib,
      annualReturnPct: r,

      monthlyState: state,
      monthlyPrivate: priv,
      totalMonthly_6_18,

      totalStatePaid,
      totalPrivatePaid_6_18,

      continueAfter18,
      targetAge,
      extraMonths,
      privateAfter18: privAfter,
      totalPrivatePaid_after18,

      capitalAt18,
      capitalAtTarget,
    };
  }, [
    birthYear,
    monthlyState,
    monthlyPrivate,
    continueAfter18,
    privateAfter18,
    growToAge,
    annualReturnPct,
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">Frühstart-Rechner</h3>
          <p className="mt-1 text-sm text-neutral-600">Geburtsjahr, Beiträge & Rendite → Endkapital.</p>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">Geburtsjahr</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                value={res.birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value || 0))}
                className="w-40 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
              />
              <span className="text-sm text-neutral-600">z. B. 2020</span>
            </div>
          </div>

          {/* 6–18: zwei Felder */}
          <div className="mt-5 rounded-xl border bg-white p-4">
            <div className="text-sm font-medium text-neutral-900">Beiträge (6–18 Jahre)</div>
            <p className="mt-1 text-xs text-neutral-600">
              Hinweis: Der Staat zahlt nur <b>bis zu 10 € / Monat</b> und nur <b>bis zum 18. Lebensjahr</b>.
              Alles darüber ist privat.
            </p>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-neutral-700">Staatlich / Monat</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={res.monthlyState}
                    onChange={(e) => setMonthlyState(clamp(Number(e.target.value || 0), 0, 10))}
                    className="w-28 rounded-xl border px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-neutral-600">€</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-neutral-700">Privat / Monat</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={res.monthlyPrivate}
                    onChange={(e) => setMonthlyPrivate(clamp(Number(e.target.value || 0), 0, 100000))}
                    className="w-28 rounded-xl border px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-neutral-600">€</span>
                </div>
              </div>

              <div className="rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-700 flex items-center justify-between">
                <span>Summe (6–18) / Monat</span>
                <span className="font-semibold text-neutral-900">{formatEUR(res.totalMonthly_6_18)}</span>
              </div>
            </div>
          </div>

          {/* Ab 18: optional privat */}
          <div className="mt-5 rounded-xl border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-neutral-900">Ab 18 privat weiter besparen</div>
                <div className="text-xs text-neutral-600">
                  Hinweis: Ab 18 zahlt der Staat <b>nicht mehr</b>. Danach sind Einzahlungen <b>nur privat</b>.
                </div>
              </div>
              <button
                onClick={() => setContinueAfter18((v) => !v)}
                className={`h-8 w-14 rounded-full border p-1 transition ${
                  continueAfter18 ? "bg-neutral-900" : "bg-white"
                }`}
                aria-label="Weiter besparen Toggle"
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow-sm transition ${
                    continueAfter18 ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {continueAfter18 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm text-neutral-700">Privat ab 18 / Monat</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={res.privateAfter18}
                      onChange={(e) => setPrivateAfter18(clamp(Number(e.target.value || 0), 0, 100000))}
                      className="w-28 rounded-xl border px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-neutral-600">€</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm text-neutral-700">Bis Alter</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={res.targetAge}
                      onChange={(e) => setGrowToAge(clamp(Number(e.target.value || 67), 18, 100))}
                      className="w-28 rounded-xl border px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-neutral-600">Jahre</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rendite */}
          <div className="mt-5 rounded-xl border bg-white p-4">
            <div className="text-sm font-medium text-neutral-900">Rendite</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <label className="text-sm text-neutral-700">Rendite p.a.</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={res.annualReturnPct}
                  onChange={(e) => setAnnualReturnPct(clamp(Number(e.target.value || 0), -50, 50))}
                  className="w-28 rounded-xl border px-3 py-2 text-sm"
                />
                <span className="text-sm text-neutral-600">%</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-neutral-500">Rechnung mit monatlicher Verzinsung, Einzahlung am Monatsende.</p>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">Ergebnis</h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card title="Dauer 6–18" value={`${res.monthsContrib} Monate`} />
            <Card title="Staatlich (Summe)" value={formatEUR(res.totalStatePaid)} />
            <Card title="Privat 6–18 (Summe)" value={formatEUR(res.totalPrivatePaid_6_18)} />
          </div>

          {res.continueAfter18 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Card title="Dauer ab 18" value={`${res.extraMonths} Monate`} />
              <Card title="Privat ab 18 (Summe)" value={formatEUR(res.totalPrivatePaid_after18)} />
              <Card title="Zielalter" value={`${res.targetAge}`} />
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card title="Endkapital (bis 18)" value={formatEUR(res.capitalAt18)} />
            <Card
              title={res.continueAfter18 ? `Endkapital (bis Alter ${res.targetAge})` : "Endkapital (nur bis 18)"}
              value={formatEUR(res.capitalAtTarget)}
            />
          </div>

          <div className="mt-6 rounded-2xl border bg-neutral-50 p-5">
            <div className="text-sm font-semibold text-neutral-900">Zeitstrahl</div>
            <div className="mt-3 grid gap-2 text-sm text-neutral-700">
              <Line label={`Start (${res.startAge}. Geburtstag)`} value={`${res.startYear}`} />
              <Line label={`Ende staatlich (${res.endAge}. Geburtstag)`} value={`${res.endYear}`} />
              <Line label="Staatlich" value={`${formatEUR(res.monthlyState)} / Monat (bis 18)`} />
              <Line label="Privat (6–18)" value={`${formatEUR(res.monthlyPrivate)} / Monat`} />
              <Line label="Rendite" value={`${res.annualReturnPct} % p.a.`} />
              <Line
                label="Ab 18"
                value={res.continueAfter18 ? `${formatEUR(res.privateAfter18)} / Monat bis ${res.targetAge}` : "keine privaten Beiträge nach 18"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card(props: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-700">{props.title}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">{props.value}</div>
    </div>
  );
}

function Line(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
      <span className="text-sm text-neutral-700">{props.label}</span>
      <span className="text-sm font-semibold text-neutral-900">{props.value}</span>
    </div>
  );
}