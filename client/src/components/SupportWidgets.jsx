import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function SupportWidgets() {
  const { t, language } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const whatsappMessage = encodeURIComponent(
    language === "ur" ? "ہیلو ڈینٹل آٹومیشن، میں اپائنٹمنٹ بک کرنا چاہتا ہوں۔" : "Hello Dental Automation, I want to book an appointment."
  );
  const faqMap = {
    "clinic hours": t.faqClinicHours,
    pricing: t.faqPricing,
    emergency: t.faqEmergency,
    "کلینک اوقات": t.faqClinicHours,
    "قیمت": t.faqPricing,
    "ایمرجنسی": t.faqEmergency,
  };

  const sendMessage = async () => {
    if (!query.trim()) {
      setStatus(t.chatTypeFirst);
      return;
    }
    setStatus("");
    try {
      const { data } = await api.post("/support/messages", {
        name: name || "Guest",
        email,
        message: query,
      });
      setStatus(data.message);
      setQuery("");
    } catch (error) {
      setStatus(error?.response?.data?.message || t.chatSendFailed);
    }
  };

  const answer = faqMap[query.trim().toLowerCase()] || t.chatFallback;

  return (
    <>
      <a
        href={`https://wa.me/923001234567?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-4 z-40 rounded-full bg-emerald-500 px-4 py-3 text-xs font-semibold text-white shadow-lg sm:right-6 sm:text-sm"
      >
        {t.whatsappBooking}
      </a>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 z-50 rounded-full bg-sky-600 p-4 text-white shadow-xl sm:right-6"
        aria-label="Toggle chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
      {open && (
        <section className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:right-6 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="font-semibold">{t.chatTitle}</h4>
          <p className="mt-1 text-xs text-slate-500">{t.chatTry}</p>
          <div className="mt-3 grid gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.yourEmail} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.askQuestion}
            className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">{answer}</p>
          <button
            onClick={sendMessage}
            disabled={!query.trim()}
            className="mt-3 w-full rounded-xl bg-teal-500 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.sendToClinic}
          </button>
          {status ? <p className="mt-2 text-xs text-slate-500">{status}</p> : null}
        </section>
      )}
    </>
  );
}
