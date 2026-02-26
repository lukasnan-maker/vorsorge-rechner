"use client";

import { useMemo, useState } from "react";

function formatEUR(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function RenditeRechner() {
  const [startkapital, setStartkapital] = useState<number>(0);
  const [monatlich, setMonatlich] = useState<number>(100);
  const [jahre, setJahre] = useState<number>(30);
  const [rendite, setRendite] = useState<number>(6); // % p.a.

  const result = useMemo(() => {
    const years = clamp(Number(jahre) || 0, 0, 80);
    const r = clamp(Number(rendite) || 0, -50, 50) / 100;
    const start = Math.max(0, Number(startkapital) || 0);
    const monthly = Math.max(0, Number(monatlich) || 0);

    // monatliche Verzinsung (effektiv, aus Jahresrendite abgeleitet)
    const rm = Math.pow(1 + r, 1 / 12) - 1;
    const months = years * 12;

    let balance = start;
    let paidIn = start;

    const yearlyRows: Array<{ year: number; endValue: number; paidIn: number }> = [];

    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + rm);      // Verzinsung
      balance += monthly;                // Einzahlung am Monatsende
      paidIn += monthly;

      if (m % 12 === 0) {
        yearlyRows.push({ year: m / 12, endValue: balance, paidIn });
      }
    }

    const profit = balance - paidIn;

    return {
      endValue: balance,
      paidIn,
      profit,
      yearlyRows,
    };
  }, [startkapital, monatlich, jahre, rendite]);

  return (
    <section className="rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Rendite-Rechner</h2>
        <p className="text-sm text-neutral-600">
          Simuliere deinen Depotwert mit Zinseszins. (Hinweis: Modellrechnung, keine Garantie.)
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-neutral-800">Startkapital (€)</span>
          <input
            type="number"
            inputMode="decimal"
            className="h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            value={startkapital}
            onChange={(e) => setStartkapital(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-neutral-800">Monatliche Einzahlung (€)</span>
          <input
            type="number"
            inputMode="decimal"
            className="h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            value={monatlich}
            onChange={(e) => setMonatlich(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-neutral-800">Laufzeit (Jahre)</span>
          <input
            type="number"
            inputMode="numeric"
            className="h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            value={jahre}
            onChange={(e) => setJahre(Number(e.target.value))}
            min={0}
            max={80}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-neutral-800">Rendite (% p.a.)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            className="h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
            value={rendite}
            onChange={(e) => setRendite(Number(e.target.value))}
            min={-50}
            max={50}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs font-medium text-neutral-500">Endwert</div>
          <div className="mt-1 text-2xl font-semibold text-neutral-900">{formatEUR(result.endValue)}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs font-medium text-neutral-500">Einzahlungen gesamt</div>
          <div className="mt-1 text-2xl font-semibold text-neutral-900">{formatEUR(result.paidIn)}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-xs font-medium text-neutral-500">Zinseszins / Gewinn</div>
          <div className="mt-1 text-2xl font-semibold text-neutral-900">{formatEUR(result.profit)}</div>
        </div>
      </div>

      <details className="mt-5">
        <summary className="cursor-pointer text-sm font-medium text-neutral-800">
          Jahresübersicht anzeigen
        </summary>

        <div className="mt-3 overflow-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-neutral-50 text-neutral-700">
              <tr>
                <th className="px-4 py-2 text-left">Jahr</th>
                <th className="px-4 py-2 text-right">Einzahlungen</th>
                <th className="px-4 py-2 text-right">Wert am Jahresende</th>
              </tr>
            </thead>
            <tbody>
              {result.yearlyRows.map((row) => (
                <tr key={row.year} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{row.year}</td>
                  <td className="px-4 py-2 text-right">{formatEUR(row.paidIn)}</td>
                  <td className="px-4 py-2 text-right">{formatEUR(row.endValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}