interface TrustRatingRingProps {
  percent: number;
  level: string;
  nextLevel: string;
  size?: number;
}

export function TrustRatingRing({ percent, level, nextLevel, size = 168 }: TrustRatingRingProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#F4F5F7" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EF3124"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[26px] font-bold text-ink">{percent}%</span>
          <span className="text-caption text-text-secondary">до «{nextLevel}»</span>
        </div>
      </div>
      <p className="mt-3 text-card-title text-ink">{level}</p>
    </div>
  );
}
