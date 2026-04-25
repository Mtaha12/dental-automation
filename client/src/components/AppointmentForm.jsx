import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  service: "Teeth Whitening",
  doctorId: "",
  date: "",
  time: "",
};

export default function AppointmentForm({ services = [], onBooked }) {
  const { t } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/doctors").then((res) => {
      setDoctors(res.data);
      if (res.data[0]) {
        setForm((prev) => ({ ...prev, doctorId: res.data[0]._id }));
      }
    });
  }, []);

  useEffect(() => {
    if (!form.doctorId || !form.date) {
      setSlots([]);
      setForm((prev) => ({ ...prev, time: "" }));
      return;
    }
    api
      .get("/appointments/slots", { params: { doctorId: form.doctorId, date: form.date } })
      .then((res) => {
        setSlots(res.data);
        setForm((prev) => {
          const hasSelectedSlot = res.data.some((slot) => slot.available && slot.time === prev.time);
          if (hasSelectedSlot) return prev;
          const firstAvailable = res.data.find((slot) => slot.available);
          return { ...prev, time: firstAvailable?.time || "" };
        });
      })
      .catch(() => {
        setSlots([]);
        setForm((prev) => ({ ...prev, time: "" }));
      });
  }, [form.doctorId, form.date]);

  const selectableSlots = useMemo(() => slots.filter((slot) => slot.available), [slots]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/appointments", form);
      setMessage(t.bookingSuccess);
      onBooked?.(data);
      setForm((prev) => ({ ...emptyForm, doctorId: prev.doctorId }));
    } catch (error) {
      setMessage(error?.response?.data?.message || t.bookingFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.quickBooking}</h3>
      <input className="input" name="name" value={form.name} onChange={handleChange} placeholder={t.name} required />
      <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder={t.email} required />
      <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder={t.phone} required />
      <select className="input text-slate-900 dark:text-slate-100" name="service" value={form.service} onChange={handleChange}>
        {(services.length ? services : [{ title: t.generalCheckup }]).map((service) => {
          const serviceKeyMap = {
            "Teeth Whitening": t.teethWhitening,
            "Root Canal Therapy": t.rootCanalTherapy,
            "Dental Implants": t.dentalImplants,
            "Braces & Aligners": t.bracesAligners,
          };
          const displayTitle = serviceKeyMap[service.title] || service.title;
          return (
            <option key={service.title} value={service.title}>
              {displayTitle}
            </option>
          );
        })}
      </select>
      <select
        className="input text-slate-900 dark:text-slate-100"
        name="doctorId"
        value={form.doctorId}
        onChange={handleChange}
        required
        disabled={!doctors.length}
      >
        {!doctors.length ? <option value="">{t.loadingDoctors}</option> : null}
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.name} ({doctor.specialization})
          </option>
        ))}
      </select>
      <input className="input text-slate-900 dark:text-slate-100" name="date" type="date" value={form.date} onChange={handleChange} required />
      <select className="input text-slate-900 dark:text-slate-100" name="time" value={form.time} onChange={handleChange} required>
        <option value="">{form.date ? t.noTimeSlotsAvailable : t.selectDateFirst}</option>
        {selectableSlots.map((slot) => (
          <option key={slot.time} value={slot.time}>
            {slot.time}
          </option>
        ))}
      </select>
      <button disabled={loading || !form.doctorId || !form.time} className="btn-primary w-full" type="submit">
        {loading ? t.booking : t.bookAppointmentBtn}
      </button>
      {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
    </form>
  );
}
