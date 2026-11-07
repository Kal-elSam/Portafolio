// Shared media queries. Motion is built only when the visitor allows it; the
// base markup and CSS are the complete static state for everyone else.
export const MQ_WIDE =
  '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
export const MQ_NARROW =
  '(max-width: 767px) and (prefers-reduced-motion: no-preference)';
export const MQ_ANY = '(prefers-reduced-motion: no-preference)';
