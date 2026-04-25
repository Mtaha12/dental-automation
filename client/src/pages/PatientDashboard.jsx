import { useEffect, useState } from "react";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function PatientDashboard() {
  const { t } = useApp();
  const [me, setMe] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);

  const load = () => {
    api.get("/users/me").then((res) => setMe(res.data));
    api.get("/appointments/mine/records").then((res) => setAppointments(res.data));
    api.get("/support/messages/me").then((res) => setSupportMessages(res.data)).catch(() => setSupportMessages([]));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="section-title">{t.myRecords}</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          {me ? `${me.name} • ${me.email}` : t.loadingProfile}
        </p>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.appointmentHistory}</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="py-2">{t.service}</th>
              <th className="py-2">{t.doctor}</th>
              <th className="py-2">{t.date}</th>
              <th className="py-2">{t.time}</th>
              <th className="py-2">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">{item.service}</td>
                <td className="py-2">{item.doctor}</td>
                <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                <td className="py-2">{item.time}</td>
                <td className="py-2 capitalize">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card overflow-x-auto p-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.supportMessages}</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left dark:border-slate-700">
              <th className="py-2">{t.message}</th>
              <th className="py-2">{t.status}</th>
              <th className="py-2">{t.reply}</th>
            </tr>
          </thead>
          <tbody>
            {supportMessages.map((item) => (
              <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">{item.message}</td>
                <td className="py-2 capitalize">{item.status}</td>
                <td className="py-2">{item.reply || t.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
