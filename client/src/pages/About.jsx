import { useApp } from "../context/AppContext";

export default function About() {
  const { t } = useApp();
  return (
    <section className="space-y-6">
      <article className="glass-card grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-8">
        <div>
          <h1 className="section-title">{t.about} {t.brand}</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            {t.aboutDescription}
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80"
          alt="Modern dental treatment room"
          className="h-64 w-full rounded-2xl object-cover md:h-72"
        />
      </article>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-sky-50 p-4 dark:bg-slate-800">
          <h3 className="font-semibold">{t.medicalReliability}</h3>
          <p className="mt-2 text-sm">{t.medicalReliabilitySub}</p>
        </div>
        <div className="rounded-2xl bg-teal-50 p-4 dark:bg-slate-800">
          <h3 className="font-semibold">{t.premiumExperience}</h3>
          <p className="mt-2 text-sm">{t.premiumExperienceSub}</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-4 dark:bg-slate-800">
          <h3 className="font-semibold">{t.modernTechnology}</h3>
          <p className="mt-2 text-sm">{t.modernTechnologySub}</p>
        </div>
      </div>
    </section>
  );
}
