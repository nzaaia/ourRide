export function Skeleton({ width = '100%', height = 14, radius = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function BikeTileSkeleton() {
  return (
    <div className="bike-tile" aria-hidden="true">
      <div className="tile-media">
        <Skeleton width="100%" height="100%" radius={0} />
      </div>
      <div className="tile-body" style={{ gap: 8 }}>
        <Skeleton height={13} width="85%" />
        <Skeleton height={11} width="60%" />
        <Skeleton height={11} width="40%" />
        <Skeleton height={32} width="100%" radius={8} />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4, height = 64 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton width={48} height={48} radius={12} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton width="70%" height={13} />
            <Skeleton width="45%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}
