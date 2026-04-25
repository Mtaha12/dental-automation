export function makeSvgPlaceholder(label, background = "#0ea5e9", accent = "#14b8a6") {
  const safeLabel = String(label || "Dental").slice(0, 28);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${background}"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" rx="40" fill="url(#g)"/>
      <circle cx="950" cy="140" r="160" fill="rgba(255,255,255,0.14)"/>
      <circle cx="220" cy="670" r="220" fill="rgba(255,255,255,0.12)"/>
      <text x="80" y="420" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="700">${safeLabel}</text>
      <text x="80" y="490" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="28">Dental Automation</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const fallbackImages = {
  doctor: makeSvgPlaceholder("Trusted Doctor", "#0f766e", "#0ea5e9"),
  service: makeSvgPlaceholder("Premium Dental Service", "#0ea5e9", "#14b8a6"),
  gallery: makeSvgPlaceholder("Smile Transformation", "#0891b2", "#14b8a6"),
};