/**
 * PetMood Icon System
 * Cohesive SVG icon set — 22×22 viewBox, 1.75 stroke, round caps & joins.
 * All icons accept { size=22, color='currentColor', className='' }.
 * Warm companion aesthetic: fluid curves, no sharp corners.
 */

function Ico({ size = 22, color: _color = 'currentColor', className = '', children, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      aria-label={title}
      className={className}
    >
      {children}
    </svg>
  )
}

const S = 1.75 // default stroke width

// ─── Navigation ───────────────────────────────────────────────────────────────

export function IcoCamera({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="2" y="6" width="18" height="13" rx="3" stroke={color} strokeWidth={S} />
      <circle cx="11" cy="12.5" r="3.5" stroke={color} strokeWidth={S} />
      <path d="M7.5 6l1.5-2.5h4L14.5 6" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="9" r="1" fill={color} />
    </Ico>
  )
}

export function IcoGrid({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth={S} />
      <rect x="12" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth={S} />
      <rect x="3" y="12" width="7" height="7" rx="2" stroke={color} strokeWidth={S} />
      <rect x="12" y="12" width="7" height="7" rx="2" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoTrending({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 16L8 10L12 13L17 6" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6H13M17 6V10" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoHeart({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path
        d="M11 19C11 19 3 13.5 3 8C3 5.5 4.9 3.5 7.25 3.5C8.9 3.5 10.3 4.45 11 5.82C11.7 4.45 13.1 3.5 14.75 3.5C17.1 3.5 19 5.5 19 8C19 13.5 11 19 11 19Z"
        stroke={color} strokeWidth={S} strokeLinejoin="round"
      />
    </Ico>
  )
}

export function IcoClock({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <path d="M11 6.5V11L14 13.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoMoreDots({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="5.5" cy="11" r="1.5" fill={color} />
      <circle cx="11" cy="11" r="1.5" fill={color} />
      <circle cx="16.5" cy="11" r="1.5" fill={color} />
    </Ico>
  )
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export function IcoPlus({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 4v14M4 11h14" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoChevronLeft({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M13.5 5.5L8.5 11L13.5 16.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoChevronRight({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M8.5 5.5L13.5 11L8.5 16.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoChevronDown({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M5.5 8.5L11 13.5L16.5 8.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoShare({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M8 11L11 8M11 8L14 11M11 8V17" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoEdit({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M14.5 4.5L17.5 7.5L8 17H5v-3L14.5 4.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M12.5 6.5l3 3" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoTrash({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4.5 7h13M9 7V5h4v2M9 10.5v5M13 10.5v5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M5.5 7l.9 11.5a1 1 0 001 .9h7.2a1 1 0 001-.9L16.5 7" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoCheck({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4.5 11.5L9 16L17.5 6.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoX({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M6 6l10 10M16 6L6 16" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

// ─── Health & Medical ─────────────────────────────────────────────────────────

export function IcoStethoscope({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M7 3.5v5a5 5 0 0010 0v-5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8.5A6 6 0 0111 14.5v1a3.5 3.5 0 007 0v-1" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="18.5" cy="15" r="1.5" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoPill({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="5" y="9" width="12" height="4" rx="2" stroke={color} strokeWidth={S} />
      <path d="M11 9v4" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M5 11h6" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoSyringe({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M15.5 4L18 6.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M14 5.5L16.5 8" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M13 7L7 13l-2 4 4-2 6-6" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 9.5L12.5 12.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoThermometer({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M13 13.27V5a2 2 0 00-4 0v8.27a4 4 0 104 0z" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="16" r="1.5" fill={color} />
    </Ico>
  )
}

export function IcoShield({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 2.5L4 6v5c0 4.5 3.1 7.8 7 9 3.9-1.2 7-4.5 7-9V6L11 2.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M8.5 11L10.5 13L14 9" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoAlertCircle({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <path d="M11 7.5V12" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="11" cy="14.5" r="1" fill={color} />
    </Ico>
  )
}

export function IcoHeartPulse({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 11h3l2.5-5 3 9 2.5-6L16 11h3" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

// ─── Care & Nutrition ─────────────────────────────────────────────────────────

export function IcoBowl({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4 10.5c0 3.9 3.1 7 7 7s7-3.1 7-7H4z" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10.5h18" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M9 7c0-1.5 2-2.5 2-4" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoDroplets({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 3.5C11 3.5 5 9 5 13.5a6 6 0 0012 0C17 9 11 3.5 11 3.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M8 14.5a3 3 0 003-3" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoLeaf({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4 18.5C4 11.5 9 6 17.5 3.5c0 8-4 14-13.5 15z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M4 18.5L9 13" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoFlask({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M8.5 3.5v5.5l-4 8a1 1 0 00.9 1.5h11.2a1 1 0 00.9-1.5l-4-8V3.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 3.5h7" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M6.5 14.5h3" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

// ─── Activity & Play ─────────────────────────────────────────────────────────

export function IcoPlay({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <path d="M9 7.5l6.5 3.5L9 14.5V7.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoZap({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M13 3L5 13h6.5L9 19l10-10h-6.5L13 3z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoPawPrint({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <ellipse cx="11" cy="14" rx="3.5" ry="4.5" stroke={color} strokeWidth={S} />
      <circle cx="6.5" cy="9.5" r="1.75" stroke={color} strokeWidth={S} />
      <circle cx="15.5" cy="9.5" r="1.75" stroke={color} strokeWidth={S} />
      <circle cx="8.5" cy="6.5" r="1.5" stroke={color} strokeWidth={S} />
      <circle cx="13.5" cy="6.5" r="1.5" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoTarget({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <circle cx="11" cy="11" r="4.5" stroke={color} strokeWidth={S} />
      <circle cx="11" cy="11" r="1.5" fill={color} />
    </Ico>
  )
}

export function IcoDumbbell({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M7 7h8M7 15h8" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <rect x="4" y="6" width="3" height="10" rx="1.5" stroke={color} strokeWidth={S} />
      <rect x="15" y="6" width="3" height="10" rx="1.5" stroke={color} strokeWidth={S} />
      <path d="M2 9.5v3M20 9.5v3" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

// ─── Environment & Tracking ───────────────────────────────────────────────────

export function IcoHome({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 10L11 3L19 10V19H14.5V14.5h-7V19H3V10z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoMap({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 4.5L8.5 3l5 1.5 5.5-1.5V17.5L14 19l-5-1.5-5.5 1.5V4.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M8.5 3v16M14 4.5v15" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoCompass({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <path d="M13.5 8.5l-1.5 3.5-3.5 1.5 1.5-3.5 3.5-1.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <circle cx="11" cy="11" r="1" fill={color} />
    </Ico>
  )
}

export function IcoSun({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="4" stroke={color} strokeWidth={S} />
      <path d="M11 3v1.5M11 17.5V19M3 11h1.5M17.5 11H19M5.6 5.6l1 1M15.4 15.4l1 1M15.4 6.6l-1 1M5.6 16.4l1-1" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoMoon({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M18 13.5A8 8 0 018.5 4a8.5 8.5 0 100 14A8 8 0 0118 13.5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoStar({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 3l2.5 5 5.5.7-4 3.9.9 5.4-4.9-2.6-4.9 2.6.9-5.4L3 8.7l5.5-.7L11 3z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

// ─── Data & Logging ───────────────────────────────────────────────────────────

export function IcoClipboard({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="5" y="5" width="12" height="15" rx="2" stroke={color} strokeWidth={S} />
      <path d="M8.5 5V4a2.5 2.5 0 015 0v1" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M8 10h6M8 13h4" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoCalendar({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="3" y="5" width="16" height="15" rx="2" stroke={color} strokeWidth={S} />
      <path d="M3 10h16M8 5V3M14 5V3" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="7.5" cy="14" r="1" fill={color} />
      <circle cx="11" cy="14" r="1" fill={color} />
      <circle cx="14.5" cy="14" r="1" fill={color} />
    </Ico>
  )
}

export function IcoBook({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4 4.5A2.5 2.5 0 016.5 2H18v18H6.5a2.5 2.5 0 010-5H18" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15a2.5 2.5 0 012.5-2.5H18" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoFileText({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M5 4h8.5L17 7.5V19H5V4z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M13.5 4v3.5H17" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M8 11h6M8 14h4" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoBarChart({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4 18.5V14M9 18.5V9M14 18.5V11M19 18.5V6" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M2 18.5h18" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

// ─── People & Identity ────────────────────────────────────────────────────────

export function IcoUser({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="7.5" r="3.5" stroke={color} strokeWidth={S} />
      <path d="M3.5 20C3.5 16 6.9 13 11 13s7.5 3 7.5 7" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoUsers({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="8" cy="7.5" r="3" stroke={color} strokeWidth={S} />
      <path d="M2 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="15" cy="7.5" r="3" stroke={color} strokeWidth={S} />
      <path d="M15 13c1.8 0 3.3.8 4.4 2" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoPassport({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="4" y="3" width="14" height="17" rx="2" stroke={color} strokeWidth={S} />
      <circle cx="11" cy="10" r="3" stroke={color} strokeWidth={S} />
      <path d="M7 16h8M8 13.5h6" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

// ─── Specialty & Misc ─────────────────────────────────────────────────────────

export function IcoBrain({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 4.5c-1.5-1.5-4 .5-3.5 2.5C5 7.5 3.5 10 5 12c-.5 1.5 1 3 2.5 3H11" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 4.5c1.5-1.5 4 .5 3.5 2.5C17 7.5 18.5 10 17 12c.5 1.5-1 3-2.5 3H11" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 4.5V19" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M8 19h6" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoSparkles({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 3l1.5 4L16 8.5 12.5 11 14 15l-3-2.5L8 15l1.5-4L6 8.5 9.5 7 11 3z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M17.5 2v2M17.5 6V8M15.5 4H17.5M17.5 4h2" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M5 15v1.5M5 18.5V20M3.75 17H5M5 17h1.25" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoCamera2({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M7.5 5h7l1.5 2.5H18a1 1 0 011 1V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5a1 1 0 011-1h1.5L7 5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <circle cx="11" cy="12.5" r="3" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoScissors({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="6.5" cy="7.5" r="2.5" stroke={color} strokeWidth={S} />
      <circle cx="6.5" cy="15" r="2.5" stroke={color} strokeWidth={S} />
      <path d="M9 9L18.5 5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M9 13.5L18.5 18" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M9.5 11.25L19 11.25" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoWind({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 8h11a2 2 0 100-4" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M3 11.5h14a2.5 2.5 0 110 5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M3 15h8" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoWeight({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M5 6h12l1.5 12H3.5L5 6z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M8.5 6a2.5 2.5 0 015 0" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M7.5 12l1.5 2.5L11 10l2 5 1.5-3" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoCamera3({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 9h2.5L7 6.5h8L16.5 9H19a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V10a1 1 0 011-1z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <circle cx="11" cy="13.5" r="3" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoWaves({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 8c1.5 0 2.5 1.5 4 1.5S9.5 8 11 8s2.5 1.5 4 1.5S17.5 8 19 8" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M3 12c1.5 0 2.5 1.5 4 1.5S9.5 12 11 12s2.5 1.5 4 1.5S17.5 12 19 12" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M3 16c1.5 0 2.5 1.5 4 1.5S9.5 16 11 16s2.5 1.5 4 1.5S17.5 16 19 16" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoLayers({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M2 8l9-4.5L20 8l-9 4.5L2 8z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M2 13l9 4.5 9-4.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l9 4.5 9-4.5" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoLifeline({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M3 11h3l2.5-5 3 9 2.5-6L16 11h3" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoGauge({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M4 16a8 8 0 1114 0" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M9 12.5l2-1.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="11" cy="14" r="1.5" fill={color} />
    </Ico>
  )
}

export function IcoSprout({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M11 20V9" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M11 9C11 9 11 5 16 4c0 5-5 5-5 5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M11 13C11 13 11 9 6 8c0 5 5 5 5 5z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoLink({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M9 13.5a4.5 4.5 0 006.4.1l2.5-2.5A4.5 4.5 0 0011.5 4.7l-1.4 1.4" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M13 8.5a4.5 4.5 0 00-6.4-.1L4.1 11A4.5 4.5 0 0010.5 17.3l1.4-1.4" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoFireExtinguisher({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M9 7.5h4v12H9z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M13 9.5c2-1 4-.5 5 2" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="11" cy="5.5" r="2" stroke={color} strokeWidth={S} />
      <path d="M11 3.5V4.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
    </Ico>
  )
}

export function IcoBadgeCheck({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M9 3L7 5.5H4.5V8L2 11l2.5 3V16.5H7L9 19l3-1 3 1 2-2.5h2.5V14l2.5-3-2.5-3V5.5H15L13 3l-3 1-3-1z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <path d="M8 11l2 2 4-4" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoLeash({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="16.5" cy="6.5" r="2.5" stroke={color} strokeWidth={S} />
      <path d="M14 6.5C14 6.5 8 6.5 7 10.5C6 14.5 10 15 10 17.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="10" cy="18.5" r="1.5" stroke={color} strokeWidth={S} />
    </Ico>
  )
}

export function IcoPhoto({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <rect x="2.5" y="4" width="17" height="14" rx="2.5" stroke={color} strokeWidth={S} />
      <circle cx="8" cy="8.5" r="2" stroke={color} strokeWidth={S} />
      <path d="M2.5 14.5l4-4 3 3 3-3.5 5 4" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoSmile({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <circle cx="11" cy="11" r="8.5" stroke={color} strokeWidth={S} />
      <path d="M7.5 12.5c.8 1.5 2.3 2.5 3.5 2.5s2.7-1 3.5-2.5" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <circle cx="8" cy="9.5" r="1" fill={color} />
      <circle cx="14" cy="9.5" r="1" fill={color} />
    </Ico>
  )
}

export function IcoRefresh({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M18.5 9A7.5 7.5 0 116.5 5.5l3-2" stroke={color} strokeWidth={S} strokeLinecap="round" />
      <path d="M6.5 2v4h4" stroke={color} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Ico>
  )
}

export function IcoSave({ size, color = 'currentColor', className }) {
  return (
    <Ico size={size} color={color} className={className}>
      <path d="M5 3h10l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={color} strokeWidth={S} strokeLinejoin="round" />
      <rect x="8" y="3" width="6" height="5" rx="0.5" stroke={color} strokeWidth={S} />
      <rect x="6" y="13" width="10" height="7" rx="1" stroke={color} strokeWidth={S} />
    </Ico>
  )
}
