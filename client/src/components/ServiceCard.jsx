import { Link } from "react-router-dom";
import { fallbackImages } from "../utils/imageFallbacks";
import { useApp } from "../context/AppContext";

export default function ServiceCard({ service }) {
  const { t, language } = useApp();

  const serviceContentMap = {
    "Teeth Whitening": { title: t.teethWhitening, description: t.teethWhiteningDesc },
    "Root Canal Therapy": { title: t.rootCanalTherapy, description: t.rootCanalTherapyDesc },
    "Dental Implants": { title: t.dentalImplants, description: t.dentalImplantsDesc },
    "Braces & Aligners": { title: t.bracesAligners, description: t.bracesAlignersDesc },
  };

  const localizedService = serviceContentMap[service.title] || {
    title: service.title,
    description: service.description,
  };

  const localizedDuration = language === "ur" ? String(service.duration || "").replace("min", "منٹ") : service.duration;

  return (
    <article className="glass-card overflow-hidden">
      <img
        src={service.image || fallbackImages.service}
        alt={localizedService.title}
        className="h-52 w-full object-cover"
        onError={(event) => {
          event.currentTarget.src = fallbackImages.service;
        }}
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{localizedService.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{localizedService.description}</p>
        <p className="mt-2 text-sm">{t.duration}: {localizedDuration}</p>
        <p className="text-sm">{t.price}: {service.price}</p>
        <Link to="/book" className="mt-4 inline-block rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white">
          {t.bookNow}
        </Link>
      </div>
    </article>
  );
}
