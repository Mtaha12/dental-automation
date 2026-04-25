export default function Testimonial({ item }) {
  return (
    <blockquote className="glass-card p-5">
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">"{item.quote}"</p>
      <footer className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</footer>
    </blockquote>
  );
}
