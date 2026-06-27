import { IcoAlertCircle } from '../components/icons'

export default function BaselineSummary({ baseline, unusual, catName }) {
  if (!baseline) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="pm-card-inset px-5 py-4 bg-secondary-container/25 border-secondary/10">
        <p className="pm-label text-secondary mb-2">
          Normal for {catName}
        </p>
        <p className="text-sm text-on-surface font-medium mb-0.5">
          Usually: <span className="text-secondary font-semibold">{baseline.topFeeling}</span>
          <span className="text-on-surface-muted font-normal"> ({baseline.topFeelingPct}% of reads)</span>
        </p>
        {baseline.topActivity && (
          <p className="text-sm text-on-surface-muted">
            Most seen doing: {baseline.topActivity}
          </p>
        )}
        <p className="text-caption text-on-surface-muted/70 mt-2 leading-snug">
          Pattern from {baseline.readCount} reads — individual moments vary widely.
        </p>
      </div>

      {unusual && (
        <div className="pm-card px-5 py-4 bg-amber-50/80 border-amber-200/60 fade-in">
          <div className="flex items-center gap-2 mb-2">
            <IcoAlertCircle size={16} color="#b45309" />
            <p className="pm-label text-amber-800">
              Unusual for {catName}
            </p>
          </div>
          <p className="text-sm text-amber-900 font-medium mb-1">
            {unusual.message}
          </p>
          <p className="text-caption text-amber-800/80 leading-snug">
            {unusual.caveat}
          </p>
        </div>
      )}
    </div>
  )
}
