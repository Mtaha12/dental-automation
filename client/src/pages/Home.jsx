import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import ServiceCard from "../components/ServiceCard";
import Testimonial from "../components/Testimonial";
import { beforeAfter, services, testimonials } from "../utils/mockData";
import { useApp } from "../context/AppContext";
import api from "../utils/api";
import { fallbackImages } from "../utils/imageFallbacks";

export default function Home() {
  const { t } = useApp();
  const [slide, setSlide] = useState(0);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data.slice(0, 2)))
      .catch(() => setDoctors([]));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % beforeAfter.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-20">
      <section className="hero-grid rounded-3xl px-6 py-14 md:px-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="badge">{t.premiumClinicBadge}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 md:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-slate-700 dark:text-slate-300">
            {t.heroSub}
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/book" className="btn-primary">
              {t.book}
            </Link>
            <a href="tel:+923001234567" className="btn-soft">
              {t.emergency}
            </a>
          </div>
        </motion.div>
        <AppointmentForm services={services} />
      </section>

      <section>
        <h2 className="section-title">{t.ourServices}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass-card p-5">
          <p className="text-3xl font-bold text-sky-600">12k+</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t.statTreatments}</p>
        </article>
        <article className="glass-card p-5">
          <p className="text-3xl font-bold text-teal-600">4.9/5</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t.statReviews}</p>
        </article>
        <article className="glass-card p-5">
          <p className="text-3xl font-bold text-cyan-600">ISO-grade</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{t.statIso}</p>
        </article>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">{t.meetDentist}</h2>
          <Link to="/doctors" className="text-sm font-semibold text-sky-600">
            {t.viewAllDoctors}
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {doctors.map((doctor) => (
            <article key={doctor._id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row">
              <img
                src={doctor.image || fallbackImages.doctor}
                alt={doctor.name}
                className="h-28 w-28 rounded-2xl object-cover"
                onError={(event) => {
                  event.currentTarget.src = fallbackImages.doctor;
                }}
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{doctor.name}</h3>
                <p className="text-sm text-teal-600">{doctor.specialization}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{doctor.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl bg-white/70 p-6 md:grid-cols-2 dark:bg-slate-900/40">
        <div>
          <h2 className="section-title">{t.beforeAfter}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{t.beforeAfterSub}</p>
          <div className="mt-5 flex gap-2">
            {beforeAfter.map((_img, index) => (
              <button
                key={index}
                onClick={() => setSlide(index)}
                className={`h-2.5 w-10 rounded-full ${slide === index ? "bg-sky-600" : "bg-slate-300"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={beforeAfter[slide] || fallbackImages.gallery}
            alt="Dental transformation"
            className="h-72 w-full rounded-2xl object-cover"
            onError={(event) => {
              event.currentTarget.src = fallbackImages.gallery;
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/55 to-transparent p-4 text-white">
            <p className="text-sm font-medium">{t.caseLabel} {slide + 1}: {t.smileOutcome}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">{t.patientTestimonials}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Testimonial key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-sky-600 to-teal-500 p-6 text-white">
        <h2 className="text-2xl font-bold">{t.emergencyCare}</h2>
        <p className="mt-2">{t.emergencySub}</p>
        <a href="tel:+923001234567" className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-semibold text-sky-700">
          {t.callNow} +92 300 1234567
        </a>
      </section>
    </div>
  );
}
