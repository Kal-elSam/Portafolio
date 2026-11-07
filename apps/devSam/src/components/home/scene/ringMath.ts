// Layout of the ring. Pure functions.
//
// Panels sit on a circle around the viewer. The panel in front is enlarged by a
// smooth focus profile f(d), where d is the distance in slots from the front;
// positions along the arc integrate that profile, so neighbours always make
// room for the enlarged panel and never overlap it. The integral has a closed
// form, so the ring's circumference (and radius) is constant while it turns.

const SIG2 = 0.6;
const FOCUS_K = 1.95;

/** Abramowitz-Stegun 7.1.26: max error 1.5e-7. */
const erf = (x: number) => {
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
};

/** Focus profile: 1 far away, FOCUS_K at the front. */
export const focus = (d: number) =>
  1 + (FOCUS_K - 1) * Math.exp((-d * d) / SIG2);

/** Integral of the profile from 0 to d (signed). */
const arcOf = (d: number) =>
  d +
  (FOCUS_K - 1) * ((Math.sqrt(Math.PI * SIG2) / 2) * erf(d / Math.sqrt(SIG2)));

export type Layout = {
  count: number;
  /** Slot-space centre of every panel. */
  centers: number[];
  /** Slot-space circumference. */
  total: number;
  /** World radius of the ring. */
  radius: number;
  /** Slot coordinate of the front for a float panel index. */
  slotAt: (pos: number) => number;
  /** Signed slot distance of panel i from slot coordinate c, wrapped. */
  offset: (i: number, c: number) => number;
  /** World arc length for a slot distance. */
  arc: (d: number) => number;
};

export const makeLayout = (slotWidths: number[], unit: number): Layout => {
  const count = slotWidths.length;
  const centers: number[] = [];
  let acc = 0;
  slotWidths.forEach((w) => {
    centers.push(acc + w / 2);
    acc += w;
  });
  const total = acc;
  const radius = (unit * arcOf(total / 2)) / Math.PI;

  const slotAt = (pos: number) => {
    const k = Math.floor(pos);
    const frac = pos - k;
    const i = ((k % count) + count) % count;
    const turns = (k - i) / count;
    const a = centers[i] + turns * total;
    const b =
      i + 1 < count
        ? centers[i + 1] + turns * total
        : centers[0] + (turns + 1) * total;
    return a + (b - a) * frac;
  };

  const offset = (i: number, c: number) => {
    let d = centers[i] - (((c % total) + total) % total);
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return {
    count,
    centers,
    total,
    radius,
    slotAt,
    offset,
    arc: (d) => unit * arcOf(d),
  };
};
