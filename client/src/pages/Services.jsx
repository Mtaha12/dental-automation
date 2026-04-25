import ServiceCard from "../components/ServiceCard";
import { services } from "../utils/mockData";
import { useApp } from "../context/AppContext";

export default function Services() {
  const { t } = useApp();
  return (
    <section className="space-y-6">
      <article className="glass-card grid gap-6 p-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="section-title">{t.ourServices}</h1>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{t.chooseTreatment}</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=1200&q=80"
          alt="Dental tools prepared for treatment"
          className="h-64 w-full rounded-2xl object-cover md:h-72"
        />
      </article>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}
