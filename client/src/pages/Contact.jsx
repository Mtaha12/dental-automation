import { useApp } from "../context/AppContext";

export default function Contact() {
  const { t } = useApp();
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="glass-card p-6">
        <h1 className="section-title">{t.contactHero}</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">{t.contactSub}</p>
        <p className="mt-4 text-slate-700 dark:text-slate-300">{t.addressLine}</p>
        <p className="text-slate-700 dark:text-slate-300">+92 300 1234567</p>
        <p className="text-slate-700 dark:text-slate-300">hello@savioradental.com</p>
        <img
          src="https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&w=1200&q=80"
          alt="Front desk at modern dental clinic"
          className="mt-5 h-56 w-full rounded-2xl object-cover"
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="tel:+923001234567" className="inline-block rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white">
            {t.emergencyContact}
          </a>
          <a
            href="https://wa.me/923001234567?text=Hello%20Saviora%20Dental%2C%20I%20need%20an%20appointment"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white"
          >
            {t.whatsappBooking}
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
        <iframe
          title="Clinic Location"
          src="https://maps.google.com/maps?q=Lahore%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="h-[420px] w-full md:h-full md:min-h-[520px]"
          loading="lazy"
        />
      </div>
    </section>
  );
}
