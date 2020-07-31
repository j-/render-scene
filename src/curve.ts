const PI = Math.PI;
const TAU = PI * 2;

export interface Curve {
  /**
   * Given a time (between 0 and 1) returns a value (between 0 and 1).
   * @param t Time value between 0 and 1
   */
  (t: number): number;
}

export const compose = (...fns: Curve[]): Curve => (t: number) => fns.reduceRight((mem, fn) => fn(mem), t)

export const easeInOut: Curve = (t) => t * t * (3 - 2 * t);

export const clip: Curve = (t) => Math.min(Math.max(0, t), 1);

export const range = (min: number, max: number): Curve => (t) => {
  if (t > max) return 1;
  if (t < min) return 0;
  return (t - min) / (max - min);
};

export const loop = (times: number): Curve => (t) => t * times % 1;

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

export const sin: Curve = (t) => Math.sin(t * TAU) * 0.5 + 0.5;
export const cos: Curve = (t) => Math.cos(t * TAU) * 0.5 + 0.5;

export const ident: Curve = (t) => t;
export const square: Curve = (t) => t ** 2;
export const cube: Curve = compose(square, square);

export const multiply = (amount: number): Curve => (t) => t * amount;

export const double: Curve = multiply(2);
export const quadruple: Curve = compose(double, double);
