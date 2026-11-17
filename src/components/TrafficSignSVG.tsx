import React from 'react';

export type SignCode =
  | 'P.123a'
  | 'P.124a'
  | 'W.207'
  | 'W.208'
  | 'W.235'
  | 'W.204'
  | 'P.130'
  | 'P.131a';

export const TrafficSignSVG: React.FC<{ code: SignCode; className?: string }> = ({
  code,
  className = 'h-24 w-24',
}) => {
  switch (code) {
    // P.123a: Cấm rẽ trái
    case 'P.123a':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển P.123a Cấm rẽ trái">
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
          <path
            d="M62 72 V44 Q62 34 52 34 H34"
            fill="none"
            stroke="#18181B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon points="24,34 38,24 38,44" fill="#18181B" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    // P.124a: Cấm quay đầu xe
    case 'P.124a':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển P.124a Cấm quay đầu">
          <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
          <path
            d="M62 72 V44 A14 14 0 0 0 34 44 V56"
            fill="none"
            stroke="#18181B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <polygon points="34,66 25,52 43,52" fill="#18181B" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    // W.207: Giao nhau với đường không ưu tiên
    case 'W.207':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển W.207 Giao nhau với đường không ưu tiên">
          <polygon
            points="50,10 92,84 8,84"
            fill="#FACC15"
            stroke="#DC2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <line x1="50" y1="36" x2="50" y2="74" stroke="#18181B" strokeWidth="9" strokeLinecap="round" />
          <line x1="34" y1="56" x2="66" y2="56" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // W.208: Giao nhau với đường ưu tiên (Tam giác lộn ngược)
    case 'W.208':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển W.208 Giao nhau với đường ưu tiên">
          <polygon
            points="8,18 92,18 50,90"
            fill="#FACC15"
            stroke="#DC2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
        </svg>
      );

    // W.235: Đường đôi
    case 'W.235':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển W.235 Đường đôi">
          <polygon
            points="50,10 92,84 8,84"
            fill="#FACC15"
            stroke="#DC2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Dải phân cách ở giữa phía trên */}
          <path d="M44 40 H56 V56 H44 Z" fill="#18181B" />
          <line x1="36" y1="42" x2="36" y2="74" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
          <line x1="64" y1="42" x2="64" y2="74" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    // W.204: Đường hai chiều
    case 'W.204':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển W.204 Đường hai chiều">
          <polygon
            points="50,10 92,84 8,84"
            fill="#FACC15"
            stroke="#DC2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Mũi tên lên bên phải */}
          <line x1="60" y1="74" x2="60" y2="46" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
          <polygon points="60,38 53,48 67,48" fill="#18181B" />
          {/* Mũi tên xuống bên trái */}
          <line x1="40" y1="40" x2="40" y2="68" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
          <polygon points="40,76 33,66 47,66" fill="#18181B" />
        </svg>
      );

    // P.130: Cấm dừng xe và đỗ xe (Nền xanh, viền đỏ, 2 gạch chéo chữ X)
    case 'P.130':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển P.130 Cấm dừng và đỗ xe">
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#DC2626" strokeWidth="9" />
          <line x1="21" y1="21" x2="79" y2="79" stroke="#DC2626" strokeWidth="9" strokeLinecap="round" />
          <line x1="79" y1="21" x2="21" y2="79" stroke="#DC2626" strokeWidth="9" strokeLinecap="round" />
        </svg>
      );

    // P.131a: Cấm đỗ xe (Nền xanh, viền đỏ, 1 gạch chéo)
    case 'P.131a':
      return (
        <svg viewBox="0 0 100 100" className={className} aria-label="Biển P.131a Cấm đỗ xe">
          <circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#DC2626" strokeWidth="9" />
          <line x1="21" y1="21" x2="79" y2="79" stroke="#DC2626" strokeWidth="9" strokeLinecap="round" />
        </svg>
      );
  }
};
