import { useEffect, useMemo, useState } from "react";
import CalendarView from "../components/CalendarView";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function AdminDashboard() {
  const { t } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]);
  const [records, setRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [timingsInput, setTimingsInput] = useState("");
  const [timingsMessage, setTimingsMessage] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const [reservedSlots, setReservedSlots] = useState([]);
  const [reservationForm, setReservationForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [reservationMessage, setReservationMessage] = useState("");

  const load = () => {
    api.get("/appointments/admin/list").then((res) => setAppointments(res.data));
    api.get("/appointments/admin/events").then((res) => setEvents(res.data));
    api.get("/appointments/admin/records").then((res) => setRecords(res.data));
    api.get("/doctors").then((res) => {
      setDoctors(res.data);
      if (res.data[0]) {
        setSelectedDoctorId((current) => current || res.data[0]._id);
      }
    });
    api.get("/reserved-slots").then((res) => setReservedSlots(res.data));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = useMemo(() => {
    const today = new Date().toDateString();
    if (filter === "today") {
      return appointments.filter((a) => new Date(a.date).toDateString() === today);
    }
    if (filter === "completed") {
      return appointments.filter((a) => a.status === "completed");
    }
    return appointments.filter((a) => ["pending", "confirmed"].includes(a.status));
  }, [appointments, filter]);

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/admin/${id}/status`, { status });
    load();
  };

  useEffect(() => {
    const selectedDoctor = doctors.find((doctor) => doctor._id === selectedDoctorId);
    if (!selectedDoctor) return;
    setTimingsInput((selectedDoctor.availableTimings || []).join(", "));
  }, [doctors, selectedDoctorId]);

  const saveTimings = async () => {
    if (!selectedDoctorId) return;
    const availableTimings = timingsInput
      .split(",")
      .map((slot) => slot.trim())
      .filter(Boolean);

    try {
      await api.put(`/doctors/${selectedDoctorId}/timings`, { availableTimings });
      setTimingsMessage(t.timingsUpdated);
      load();
    } catch (_error) {
      setTimingsMessage(t.timingsUpdateFailed);
    }
  };

  const handleReservationChange = (event) => {
    const { name, value } = event.target;
    setReservationForm((prev) => ({ ...prev, [name]: value }));
  };

  const reserveSlot = async () => {
    if (!reservationForm.doctorId || !reservationForm.date || !reservationForm.time) {
      setReservationMessage(t.selectDateAndTime);
      return;
    }

    try {
      await api.post("/reserved-slots", {
        doctorId: reservationForm.doctorId,
        date: reservationForm.date,
        time: reservationForm.time,
        reason: reservationForm.reason || "Manually Reserved",
      });
      setReservationMessage(t.slotReserved);
      setReservationForm({ doctorId: reservationForm.doctorId, date: "", time: "", reason: "" });
      load();
    } catch (_error) {
      setReservationMessage(t.slotReservationFailed);
    }
  };

  const cancelReservation = async (id) => {
    try {
      await api.delete(`/reserved-slots/${id}`);
      setReservationMessage(t.reservationCancelled);
      load();
    } catch (_error) {
      setReservationMessage(t.cancelReservationFailed);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="section-title">{t.adminDashboard}</h1>
        <div className="flex gap-2">
          {[
            ["today", t.today],
            ["upcoming", t.upcoming],
            ["completed", t.completed],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm ${filter === value ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <CalendarView events={events} />

      <div className="glass-card p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.doctorTimeSlotManagement}</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{t.commaSeparatedHint}</p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <select className="input" value={selectedDoctorId} onChange={(event) => setSelectedDoctorId(event.target.value)}>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            value={timingsInput}
            onChange={(event) => setTimingsInput(event.target.value)}
            placeholder={t.commaSeparatedHint}
          />
          <button onClick={saveTimings} className="btn-primary whitespace-nowrap">
            {t.saveSlots}
          </button>
        </div>
        {timingsMessage ? <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{timingsMessage}</p> : null}
      </div>

      <div className="glass-card p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.manualReservation}</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          {t.selectDateAndTime}
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <select
            className="input"
            name="doctorId"
            value={reservationForm.doctorId}
            onChange={handleReservationChange}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            name="date"
            type="date"
            value={reservationForm.date}
            onChange={handleReservationChange}
          />
          <input
            className="input"
            name="time"
            type="time"
            value={reservationForm.time}
            onChange={handleReservationChange}
          />
          <input
            className="input"
            name="reason"
            type="text"
            placeholder={t.reason || "Reason"}
            value={reservationForm.reason}
            onChange={handleReservationChange}
          />
          <button onClick={reserveSlot} className="btn-primary whitespace-nowrap">
            {t.reserveSlot}
          </button>
        </div>
        {reservationMessage ? (
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{reservationMessage}</p>
        ) : null}
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.reservedTimeSlots}</h2>
        {reservedSlots.length > 0 ? (
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                <th className="py-2">{t.doctor}</th>
                <th className="py-2">{t.date}</th>
                <th className="py-2">{t.time}</th>
                <th className="py-2">{t.reason || "Reason"}</th>
                <th className="py-2">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {reservedSlots.map((slot) => (
                <tr key={slot._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">{slot.doctorId?.name || "Unknown"}</td>
                  <td className="py-2">{new Date(slot.date).toLocaleDateString()}</td>
                  <td className="py-2">{slot.time}</td>
                  <td className="py-2">{slot.reason}</td>
                  <td className="py-2">
                    <button
                      onClick={() => cancelReservation(slot._id)}
                      className="rounded bg-rose-500 px-2 py-1 text-white"
                    >
                      {t.cancelReservation}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">No reserved slots</p>
        )}
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.appointments}</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="py-2">{t.patient}</th>
              <th className="py-2">{t.doctor}</th>
              <th className="py-2">{t.date}</th>
              <th className="py-2">{t.time}</th>
              <th className="py-2">{t.status}</th>
              <th className="py-2">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((item) => (
              <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.doctorId?.name}</td>
                <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="py-2">{item.time}</td>
                <td className="py-2 capitalize">{item.status}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(item._id, "confirmed")} className="rounded bg-emerald-500 px-2 py-1 text-white">
                      {t.accept}
                    </button>
                    <button onClick={() => updateStatus(item._id, "rejected")} className="rounded bg-rose-500 px-2 py-1 text-white">
                      {t.reject}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.basicPatientRecords}</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="py-2">{t.name}</th>
              <th className="py-2">{t.email}</th>
              <th className="py-2">{t.phone}</th>
              <th className="py-2">{t.service}</th>
              <th className="py-2">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">{record.name}</td>
                <td className="py-2">{record.email}</td>
                <td className="py-2">{record.phone}</td>
                <td className="py-2">{record.service}</td>
                <td className="py-2 capitalize">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
