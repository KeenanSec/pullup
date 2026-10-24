import type { Category } from '@/lib/types';

/** Original geometric covers, rendered as vectors at every screen size. */
export function PlanArtwork({ category, className = '' }: { category: Category; className?: string }) {
  return (
    <svg className={`plan-artwork ${className}`} viewBox="0 0 600 400" fill="none" aria-hidden="true">
      {category === 'study' && <>
        <path d="M0 0h600v400H0z" fill="#B8ABF0" />
        {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${145 + i * 25} ${90 + i * 9}  ${340 + i * 25} ${90 + i * 9} ${455 - i * 25} ${310 - i * 9} ${260 - i * 25} ${310 - i * 9}Z`} stroke="#32255D" strokeWidth="2" />)}
        <circle cx="300" cy="200" r="43" fill="#32255D" />
        <path d="M300 180v40m-20-20h40" stroke="#B8ABF0" strokeWidth="2" />
      </>}
      {category === 'sports' && <>
        <path d="M0 0h600v400H0z" fill="#EF967B" />
        <g stroke="#5B2A1D" strokeWidth="2">
          {[150, 125, 100, 75, 50].map(r => <circle key={r} cx="300" cy="200" r={r} />)}
          <path d="M150 200h300M300 50v300" />
        </g>
        <circle cx="375" cy="125" r="38" fill="#5B2A1D" />
        <path d="m363 137 24-24m-22 0h22v22" stroke="#EF967B" strokeWidth="2" />
      </>}
      {category === 'food' && <>
        <path d="M0 0h600v400H0z" fill="#BAD2AC" />
        {[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx="300" cy={130 + i * 31} rx="130" ry="48" stroke="#304A2B" strokeWidth="2" />)}
        <ellipse cx="300" cy="130" rx="130" ry="48" fill="#304A2B" />
        <circle cx="300" cy="130" r="23" fill="#BAD2AC" />
        <path d="M294 130h12m-6-6v12" stroke="#304A2B" strokeWidth="2" />
      </>}
      {category === 'hangout' && <>
        <path d="M0 0h600v400H0z" fill="#91B5DC" />
        <g stroke="#1C3659" strokeWidth="2">
          <circle cx="255" cy="160" r="100" /><circle cx="345" cy="160" r="100" />
          <circle cx="255" cy="240" r="100" /><circle cx="345" cy="240" r="100" />
        </g>
        <path d="M300 149c17 14 31 32 37 51-6 19-20 37-37 51-17-14-31-32-37-51 6-19 20-37 37-51Z" fill="#1C3659" />
        <circle cx="300" cy="200" r="9" fill="#91B5DC" />
      </>}
      <path d="M24 32h18m-9-9v18M558 368h18m-9-9v18" stroke="currentColor" strokeWidth="1" opacity=".5" />
    </svg>
  );
}
