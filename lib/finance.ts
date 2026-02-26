// lib/finance.ts
export function futureValueMonthly(params: {
    monthlyContribution: number; // Einzahlung pro Monat (z.B. Eigen/12 oder Gesamt/12)
    months: number;              // Laufzeit in Monaten
    annualReturnPct: number;     // Rendite p.a. in %
    initial: number;             // Startkapital (optional)
  }) {
    const P = Math.max(0, params.monthlyContribution);
    const n = Math.max(0, Math.floor(params.months));
    const r = params.annualReturnPct / 100;
    const i = r / 12;
  
    const initial = Math.max(0, params.initial);
  
    if (n === 0) return initial;
  
    // Falls Rendite 0, simple Summe
    if (Math.abs(i) < 1e-12) {
      return initial + P * n;
    }
  
    // FV = initial*(1+i)^n + P * [((1+i)^n - 1)/i]
    const pow = Math.pow(1 + i, n);
    return initial * pow + P * ((pow - 1) / i);
  }