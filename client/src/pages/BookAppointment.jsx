import { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import CalendarView from "../components/CalendarView";
import { services } from "../utils/mockData";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function BookAppointment() {
  const { t } = useApp();
  const [events, setEvents] = useState([]);

  const loadEvents = () => {
    api
      .get("/appointments/events")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <AppointmentForm services={services} onBooked={loadEvents} />
      <div>
        <h1 className="section-title">{t.appointmentCalendar}</h1>
        <p className="mb-4 mt-2 text-slate-600 dark:text-slate-300">{t.appointmentCalendarSub}</p>
        <CalendarView events={events} />
      </div>
    </section>
  );
}
