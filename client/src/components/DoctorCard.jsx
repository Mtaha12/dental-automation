import { fallbackImages } from "../utils/imageFallbacks";
import { useApp } from "../context/AppContext";

export default function DoctorCard({ doctor }) {
  const { t } = useApp();
  return (
    <article className="glass-card p-5">
      <img
        src={doctor.image || fallbackImages.doctor}
        alt={doctor.name}
        className="h-52 w-full rounded-xl object-cover"
        onError={(event) => {
          event.currentTarget.src = fallbackImages.doctor;
        }}
      />
      <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{doctor.name}</h3>
      <p className="text-teal-600">{doctor.specialization}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.experience}: {doctor.experience}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{doctor.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {doctor.availableTimings?.map((slot) => (
          <span key={slot} className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-800 dark:bg-slate-700 dark:text-slate-100">
            {slot}
          </span>
        ))}
      </div>
    </article>
  );
}
