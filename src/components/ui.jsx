import { IcoChevronLeft } from './icons'

export function ConfidenceBadge({ confidence }) {
  const styles = {
    high: 'bg-secondary-container/80 text-secondary border border-secondary/10',
    medium: 'bg-amber-50 text-amber-900 border border-amber-200/60',
    low: 'bg-red-50 text-red-800 border border-red-200/50',
  }
  const labels = {
    high: 'Good read',
    medium: 'Fair read',
    low: 'Uncertain',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-caption font-semibold ${styles[confidence] ?? styles.medium}`}>
      {labels[confidence] ?? labels.medium}
    </span>
  )
}

export function MoodBadge({ feeling, size = 'md' }) {
  const { color, bg, label } = (() => {
    // lazy import pattern avoided — inline minimal fallback
    const lower = (feeling ?? '').toLowerCase()
    const map = [
      { keys: ['relaxed', 'calm', 'serene', 'cozy'], color: '#4a6549', bg: '#eef5ed' },
      { keys: ['happy', 'playful', 'joyful'], color: '#895200', bg: '#fdf3e8' },
      { keys: ['anxious', 'stressed', 'restless'], color: '#964735', bg: '#fceee9' },
      { keys: ['active', 'curious'], color: '#3d6a9e', bg: '#edf4fb' },
    ]
    for (const e of map) {
      if (e.keys.some((k) => lower.includes(k))) {
        return { ...e, label: feeling }
      }
    }
    return { color: '#895200', bg: '#fdf3e8', label: feeling ?? 'Unknown' }
  })()

  const sizes = {
    sm: 'text-caption px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size] ?? sizes.md}`}
      style={{ color, backgroundColor: bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

export function CatAvatar({ name, size = 'md', className = '' }) {
  const initial = (name ?? '?').charAt(0).toUpperCase()
  const sizes = {
    sm: 'w-8 h-8 text-sm rounded-xl',
    md: 'w-11 h-11 text-base rounded-2xl',
    lg: 'w-16 h-16 text-xl rounded-2xl',
    xl: 'w-16 h-16 text-2xl rounded-full',
  }
  return (
    <div
      className={`flex items-center justify-center font-semibold text-primary flex-shrink-0 bg-gradient-to-br from-primary-container/25 to-secondary-container/40 border border-border-subtle ${sizes[size] ?? sizes.md} ${className}`}
      aria-hidden
    >
      {initial}
    </div>
  )
}

export function CatChip({ name, active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pm-chip ${active ? 'pm-chip-active' : 'pm-chip-idle'} ${className}`}
    >
      <CatAvatar name={name} size="sm" className="!w-6 !h-6 !text-xs !rounded-lg" />
      {name}
    </button>
  )
}

export function PillButton({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ease-smooth active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/50 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-primary-container text-white shadow-card hover:brightness-105',
    ghost: 'border border-border bg-white text-on-surface-muted hover:bg-surface-container hover:text-on-surface',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default: 'pm-card p-6',
    lg: 'pm-card-lg p-6',
    inset: 'pm-card-inset p-5',
  }
  return (
    <div className={`${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, subLabel }) {
  return (
    <div className="pm-card px-4 py-3.5 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} color="#857464" />}
        <span className="pm-label">{label}</span>
      </div>
      <p className="text-lg font-semibold text-on-surface leading-none tracking-tight">{value}</p>
      {subLabel && <p className="text-caption text-on-surface-muted">{subLabel}</p>}
    </div>
  )
}

export function SectionLabel({ children, color = 'amber' }) {
  const colors = {
    amber: 'text-primary-container',
    sage: 'text-secondary',
  }
  return (
    <p className={`text-2xs font-semibold tracking-label uppercase mb-1.5 ${colors[color] ?? colors.amber}`}>
      {children}
    </p>
  )
}

export function PageHeader({ title, subtitle, left, right, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-4 ${className}`}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {left}
        <div className="min-w-0">
          {subtitle && <p className="text-caption text-on-surface-muted font-medium mb-0.5">{subtitle}</p>}
          {title && <h1 className="pm-title truncate">{title}</h1>}
        </div>
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  )
}

export function IconButton({ children, label, className = '', ...props }) {
  return (
    <button type="button" className={`pm-icon-btn ${className}`} aria-label={label} {...props}>
      {children}
    </button>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`rounded-xl bg-surface-container animate-pulse ${className}`} />
  )
}

export function SkeletonTimelineItem() {
  return (
    <div className="flex items-start gap-4">
      <div className="w-3 h-3 rounded-full bg-surface-container mt-2 flex-shrink-0 animate-pulse" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-2.5 w-16" />
        <div className="pm-card-inset px-4 py-3 h-14 animate-pulse" />
      </div>
    </div>
  )
}

export function BackButton({ onClick }) {
  return (
    <IconButton onClick={onClick} label="Go back">
      <IcoChevronLeft size={20} color="#1b1b1d" />
    </IconButton>
  )
}

export function StatChip({ label }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container border border-border-subtle text-caption font-medium text-on-surface-muted">
      {label}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center px-8 py-12 flex-1">
      <div className="w-14 h-14 rounded-2xl bg-surface-container border border-border-subtle flex items-center justify-center">
        {Icon && <Icon size={26} color="#857464" />}
      </div>
      <div>
        <p className="text-lg font-semibold text-on-surface tracking-tight">{title}</p>
        {description && <p className="text-sm text-on-surface-muted mt-1 leading-relaxed max-w-xs">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 px-6 py-3 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-200 ease-smooth shadow-card"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function ProgressStep({ label, status }) {
  const styles = {
    done: 'bg-secondary-container/50 text-secondary border border-secondary/10',
    active: 'bg-primary-container/12 text-on-surface border border-primary-container/20 shadow-sm',
    pending: 'text-on-surface-muted/40 border border-transparent',
  }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-smooth ${styles[status] ?? styles.pending}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
        status === 'done' ? 'bg-secondary text-white' :
        status === 'active' ? 'bg-primary-container text-white animate-pulse' :
        'bg-surface-container-high text-on-surface-muted'
      }`}>
        {status === 'done' ? '✓' : status === 'active' ? '·' : ''}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function ListRow({ icon: Icon, iconBg, title, subtitle, onClick, chevron = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-container/60 active:scale-[0.995] transition-all duration-150 ease-smooth border-b border-border-subtle last:border-0"
    >
      {Icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-border-subtle" style={{ background: iconBg ?? '#f0edef' }}>
          <Icon size={18} color="#524436" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface leading-snug tracking-tight">{title}</p>
        {subtitle && <p className="text-caption text-on-surface-muted mt-0.5">{subtitle}</p>}
      </div>
      {chevron && <span className="text-on-surface-muted/50">›</span>}
    </button>
  )
}

export function MoodDot({ feeling, size = 'md' }) {
  const { color, bg } = (() => {
    const lower = (feeling ?? '').toLowerCase()
    const map = [
      { keys: ['relaxed', 'calm', 'serene'], color: '#8ba888', bg: '#eef5ed' },
      { keys: ['happy', 'playful'], color: '#e89a3c', bg: '#fdf3e8' },
      { keys: ['anxious', 'stressed'], color: '#f3907a', bg: '#fceee9' },
      { keys: ['active', 'curious'], color: '#aed8f5', bg: '#edf4fb' },
    ]
    for (const e of map) {
      if (e.keys.some((k) => lower.includes(k))) return e
    }
    return { color: '#dcd9dc', bg: '#f0edef' }
  })()

  const sizes = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-9 h-9' }

  return (
    <div
      className={`${sizes[size] ?? sizes.md} rounded-full flex items-center justify-center transition-transform duration-200 ease-smooth`}
      style={{ backgroundColor: feeling ? bg : '#f0edef' }}
      title={feeling ?? 'No data'}
    >
      {feeling ? (
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-surface-container-high" />
      )}
    </div>
  )
}
