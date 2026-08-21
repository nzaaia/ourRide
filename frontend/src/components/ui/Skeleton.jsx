import './ui-components.css';

export function Skeleton({ width = '100%', height = 14, radius = 8 }) {
  return (
    <div
      className="skeleton skeleton-el"
      style={{ '--sk-w': typeof width === 'number' ? `${width}px` : width, '--sk-h': typeof height === 'number' ? `${height}px` : height, '--sk-r': typeof radius === 'number' ? `${radius}px` : radius }}
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
      <div className="tile-body skeleton-tile-body">
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
    <div className="skeleton-list">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-list__row">
          <Skeleton width={48} height={48} radius={12} />
          <div className="skeleton-list__lines">
            <Skeleton width="70%" height={13} />
            <Skeleton width="45%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}
