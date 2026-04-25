import { Link, NavLink, useNavigate } from "react-router-dom";
import { MoonStar, Sun, Languages, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/doctors", "Doctors"],
  ["/book", "Book"],
  ["/contact", "Contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, language, setLanguage, t, user, setUser } = useApp();
  const navigate = useNavigate();

  const labels = {
    Home: t.home,
    About: t.about,
    Services: t.services,
    Doctors: t.doctors,
    Book: t.book,
    Contact: t.contact,
    Admin: t.admin,
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/75 backdrop-blur-xl dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-wide text-sky-600">
          {t.brand}
        </Link>

        <nav className="hidden gap-5 md:flex">
          {links.map(([path, label]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-teal-600" : "text-slate-700 dark:text-slate-200"}`
              }
            >
              {labels[label]}
            </NavLink>
          ))}
          {user?.role === "admin" ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-teal-600" : "text-slate-700 dark:text-slate-200"}`
              }
            >
              {t.admin}
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "en" ? "ur" : "en")}
            className="rounded-full border border-slate-300 p-2"
            aria-label="Toggle language"
          >
            <Languages size={16} />
          </button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full border border-slate-300 p-2"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <MoonStar size={16} /> : <Sun size={16} />}
          </button>
          {user ? (
            <button onClick={logout} className="rounded-full bg-slate-900 px-4 py-2 text-xs text-white">
              {t.logout}
            </button>
          ) : (
            <Link to="/login" className="rounded-full bg-sky-600 px-4 py-2 text-xs text-white">
              {t.login}
            </Link>
          )}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-slate-300 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-700">
          <div className="grid gap-2">
            {links.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm ${isActive ? "bg-sky-100 text-sky-800 dark:bg-slate-700 dark:text-slate-100" : "text-slate-700 dark:text-slate-200"}`
                }
              >
                {labels[label]}
              </NavLink>
            ))}
            {user?.role === "admin" ? (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                {t.admin}
              </NavLink>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
