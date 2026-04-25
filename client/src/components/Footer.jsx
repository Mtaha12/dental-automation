import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-gradient-to-r from-white/90 via-sky-50/70 to-teal-50/70 py-10 text-sm text-slate-700 dark:border-slate-700 dark:from-slate-950/70 dark:via-slate-900/50 dark:to-slate-900/60 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.brand}</h4>
          <p className="mt-2">{t.footerTagline}</p>
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.clinicHours}</h4>
          <p className="mt-2">{t.monSatHours}</p>
          <p>{t.sundayEmergency}</p>
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.quickLinks}</h4>
          <ul className="mt-2 space-y-1">
            <li><Link to="/services" className="hover:text-sky-600">{t.services}</Link></li>
            <li><Link to="/doctors" className="hover:text-sky-600">{t.doctors}</Link></li>
            <li><Link to="/book" className="hover:text-sky-600">{t.book}</Link></li>
            <li><Link to="/contact" className="hover:text-sky-600">{t.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t.emergency}</h4>
          <p className="mt-2">+92 300 1234567</p>
          <p>hello@savioradental.com</p>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-slate-200/70 px-4 pt-4 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
        {year} {t.brand}. {t.allRightsReserved}
      </p>
    </footer>
  );
}
