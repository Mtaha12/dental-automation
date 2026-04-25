import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function Doctors() {
  const { t } = useApp();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <article className="glass-card grid gap-6 p-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="section-title">{t.meetDentist}</h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{t.doctorCareSub}</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80"
          alt="Dental team consultation"
          className="h-64 w-full rounded-2xl object-cover md:h-72"
        />
      </article>
      <div className="grid gap-6 md:grid-cols-2">
        {loading ? <LoadingSkeleton /> : doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)}
      </div>
    </section>
  );
}
