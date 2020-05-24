const PI = Math.PI;
const TAU = PI * 2;

export interface Curve {
  /**
   * Given a time (between 0 and 1) returns a value (between 0 and 1).
   * @param t Time value between 0 and 1
   */
  (t: number): number;
}

export const easeInOut: Curve = (t) => t * t * (3 - 2 * t);

export const clip: Curve = (t) => Math.min(Math.max(0, t), 1);

export const pulse = (peaks: number): Curve => (t) => {
  t = clip(t);
  if (t > 1 / peaks) return 0;
  return Math.sin(-PI / 2 + t * TAU * peaks) * 0.5 + 0.5;
};

export const phase = (curve: Curve, amount: number): Curve => (t) => {
  amount %= 1;
  amount += 1;
  amount %= 1;
  if (t < (1 - amount)) return curve(t + amount);
  else return curve(t - (1 - amount));
};

export const multiply = (curve: Curve, amount: number): Curve => (t) => curve(t) * amount;

export const sin: Curve = (t) => Math.sin(t * TAU) * 0.5 + 0.5;
export const cos: Curve = (t) => Math.cos(t * TAU) * 0.5 + 0.5;
