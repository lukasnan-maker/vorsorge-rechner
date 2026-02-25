"use client";

import AltersvorsorgeRechner from "@/components/AltersvorsorgeRechner";
import FruehstartRechner from "@/components/FruehstartRechner";

export default function OnePager() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-white">
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-neutral-900" />
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
              Vorsorge-Rechner
            </span>
          </a>

          <nav className="flex items-center gap-2 text-sm">
            <a href="#pav" className="rounded-full px-3 py-1.5 text-neutral-700 hover:bg-neutral-100">
              Altersvorsorgedepot
            </a>
            <a href="#fruehstart" className="rounded-full px-3 py-1.5 text-neutral-700 hover:bg-neutral-100">
              Frühstart-Rente
            </a>
            <a href="#faq" className="rounded-full px-3 py-1.5 text-neutral-700 hover:bg-neutral-100">
              FAQ
            </a>
          </nav>
        </div>
      </div>

      <div id="top" className="mx-auto max-w-6xl px-4 py-10">
        <header className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-neutral-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Onepager: Rechner + Erklärung + FAQ
            </div>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Staatliche Förderung für Altersvorsorge — in Sekunden berechnet
            </h1>

            <p className="mt-3 max-w-xl text-pretty text-neutral-600">
              Rechner für die beitragsproportionale Zulage (bis 1.800 €/Jahr) inkl. Kinderzulage und Berufseinsteigerbonus
              sowie ein Frühstart-Rente Abschnitt (10 €/Monat von 6 bis 18).
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#pav"
                className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800"
              >
                Zum Altersvorsorge-Rechner
              </a>
              <a
                href="#fruehstart"
                className="rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Zur Frühstart-Rente
              </a>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-neutral-900">Was du hier bekommst</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                Klarer Output: Eigenbeitrag, Zulagen, Gesamtbetrag, Förderquote
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                Transparent: „So wird gerechnet“ direkt auf der Seite
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                Onepager-Design: schnell, clean, mobilfreundlich
              </li>
            </ul>
            <div className="mt-4 rounded-xl border bg-neutral-50 p-3 text-xs text-neutral-600">
              Hinweis: Demo-Implementierung. Keine Steuer-/Rechts-/Anlageberatung.
            </div>
          </div>
        </header>

        <section id="pav" className="mt-12 scroll-mt-24">
          <SectionTitle
            kicker="pAV / Altersvorsorgedepot"
            title="Rechner: Eigenbeitrag → Grundzulage + Kinderzulage"
            desc="Bis 1.200 €/Jahr: 0,30 € je € (ab 2029: 0,35 €). Zusätzlich bis 1.800 €/Jahr: 0,20 € je €."
          />
          <AltersvorsorgeRechner />
        </section>

        <section id="fruehstart" className="mt-14 scroll-mt-24">
          <SectionTitle
            kicker="Frühstart-Rente"
            title="Rechner: Geburtsjahr → staatliche Einzahlungen"
            desc="10 € pro Monat vom 6. bis zum 18. Lebensjahr (= 12 Jahre → 1.440 € ohne Rendite)."
          />
          <FruehstartRechner />
        </section>

        <section id="faq" className="mt-14 scroll-mt-24">
          <SectionTitle
            kicker="FAQ"
            title="Häufige Fragen"
            desc="Kurz & verständlich – plus Rechenlogik als Grundlage."
          />

          <div className="grid gap-3 md:grid-cols-2">
            <FaqCard
              q="Was ändert sich ab 2029?"
              a="In der ersten Stufe (bis 1.200 € Eigenbeitrag/Jahr) steigt die Zulage von 0,30 € je € auf 0,35 € je €."
            />
            <FaqCard
              q="Warum max. 480 € bzw. 540 € Grundzulage?"
              a="Bei 1.800 € Eigenbeitrag: bis 2028 = 1.200×0,30 + 600×0,20 = 480 €. Ab 2029 = 1.200×0,35 + 600×0,20 = 540 €."
            />
            <FaqCard
              q="Wie wird die Kinderzulage berechnet?"
              a="Pro Kind: 0,25 € je € Eigenbeitrag bis 1.200 €/Jahr → maximal 300 € pro Kind und Jahr."
            />
            <FaqCard
              q="Ist das Steuerberatung?"
              a="Nein. Es ist eine Rechenhilfe auf Basis des von dir bereitgestellten Textes. Details können sich im Gesetzgebungsverfahren ändern."
            />
          </div>

          <div className="mt-10 rounded-2xl border bg-white p-6 text-sm text-neutral-600 shadow-sm">
            <div className="text-sm font-semibold text-neutral-900">Disclaimer</div>
            <p className="mt-2 max-w-3xl">
              Dieses Tool berechnet Zulagen und Einzahlungen ausschließlich nach den Regeln, die in deinem Text beschrieben sind.
              Es ersetzt keine Beratung und erhebt keinen Anspruch auf Vollständigkeit/Verbindlichkeit.
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t pt-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} Vorsorge-Rechner (Onepager)
        </footer>
      </div>
    </main>
  );
}

function SectionTitle(props: { kicker: string; title: string; desc: string }) {
  return (
    <div className="mb-6">
      <div className="text-sm font-medium text-neutral-700">{props.kicker}</div>
      <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
        {props.title}
      </h2>
      <p className="mt-2 max-w-3xl text-pretty text-sm text-neutral-600">{props.desc}</p>
    </div>
  );
}

function FaqCard(props: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-neutral-900">{props.q}</div>
      <div className="mt-2 text-sm text-neutral-700">{props.a}</div>
    </div>
  );
}