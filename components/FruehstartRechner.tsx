"use client";

import { useMemo, useState } from "react";

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

export default function FruehstartRechner() {
  const [birthYear, setBirthYear] = useState<number>(2020);

  const res = useMemo(() => {
    const startYear = birthYear + 6;
    const endYear = birthYear + 18;

    const months = 12 * 12; // 12 Jahre
    const monthlyState = 10;
    const totalState = months * monthlyState; // 1440

    return { startYear, endYear, months, monthlyState, totalState };
  }, [birthYear]);

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">Frühstart-Rechner</h3>
          <p className="mt-1 text-sm text-neutral-600">Geburtsjahr eingeben → Einzahlungszeitraum & Summe.</p>

          <div className="mt-5">
            <label className="text-sm font-medium text-neutral-800">Geburtsjahr</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value || 0))}
                className="w-40 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
              />
              <span className="text-sm text-neutral-600">z. B. 2020</span>
            </div>

            <div className="mt-4 rounded-xl border bg-neutral-50 p-4 text-xs text-neutral-600">
              Annahme: 10 € pro Monat vom 6. bis zum 18. Lebensjahr (12 Jahre). Rendite ist hier nicht berücksichtigt.
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">Ergebnis</h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card title="Staatlich / Monat" value={formatEUR(res.monthlyState)} />
            <Card title="Dauer" value={`${res.months} Monate`} />
            <Card title="Summe (ohne Rendite)" value={formatEUR(res.totalState)} />
          </div>

          <div className="mt-6 rounded-2xl border bg-neutral-50 p-5">
            <div className="text-sm font-semibold text-neutral-900">Zeitstrahl</div>
            <div className="mt-3 grid gap-2 text-sm text-neutral-700">
              <Line label="Start (6. Geburtstag)" value={`${res.startYear}`} />
              <Line label="Ende (18. Geburtstag)" value={`${res.endYear}`} />
              <Line label="Einzahlung" value={`10 € monatlich`} />
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