import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useApp } from "../context/AppContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { setUser, t } = useApp();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const { data } = await api.post("/users/login", { email: form.email, password: form.password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setMessage("Admin authenticated successfully.");
      navigate("/admin");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <section className="mx-auto max-w-lg glass-card p-8">
      <h1 className="section-title">{t.loginTitle}</h1>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{t.loginSub}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input className="input text-slate-900 dark:text-slate-100" name="email" type="email" placeholder={t.email} value={form.email} onChange={handleChange} required />
        <input className="input text-slate-900 dark:text-slate-100" name="password" type="password" placeholder={t.password} value={form.password} onChange={handleChange} required />
        <button className="btn-primary w-full" type="submit">
          {t.login}
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{message}</p>}
    </section>
  );
}
