/**
 * BaselineSummary — shown in HistoryScreen once MIN_READS_FOR_BASELINE reads exist.
 * Displays the "normal for her" baseline and any "unusual for her" signal.
 * All signals include humble caveats — this is not a diagnostic tool.
 */
export default function BaselineSummary({ baseline, unusual, catName }) {
  if (!baseline) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Normal baseline card */}
      <div className="bg-secondary-container/30 rounded-2xl px-5 py-4">
        <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
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
        <p className="text-[11px] text-on-surface-muted/60 mt-2 leading-snug">
          Pattern from {baseline.readCount} reads — individual moments vary widely.
        </p>
      </div>

      {/* Unusual signal — shown only when a divergence is detected */}
      {unusual && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">⚠️</span>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
              Unusual for {catName}
            </p>
          </div>
          <p className="text-sm text-amber-900 font-medium mb-1">
            {unusual.message}
          </p>
          <p className="text-[11px] text-amber-700/70 leading-snug">
            {unusual.caveat}
          </p>
        </div>
      )}
    </div>
  )
}
