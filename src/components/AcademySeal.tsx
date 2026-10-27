/** Decorative, house-neutral school insignia. */
export default function AcademySeal({ className = '' }: { className?: string }) {
  return (
    <svg className={`academy-seal ${className}`} viewBox="0 0 100 120" fill="none" aria-hidden="true">
      <path d="M50 5 88 20v40c0 25-18 43-38 54C30 103 12 85 12 60V20Z" fill="currentColor" fillOpacity=".06" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 12 81 25v35c0 20-14 36-31 46-17-10-31-26-31-46V25Z" stroke="currentColor" strokeOpacity=".45" />
      <path d="M30 78V49l8-7 8 7v29m8 0V39l8-9 8 9v39M25 78h50M34 50v-9m28-3V25M38 60v6m24-16v6M47 78V65h7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m32 32 2-5 2 5 5 2-5 2-2 5-2-5-5-2Zm40-8 1-3 1 3 3 1-3 1-1 3-1-3-3-1Z" fill="currentColor" />
      <path d="M38 90h24m-18 5h12" stroke="currentColor" />
    </svg>
  );
}
