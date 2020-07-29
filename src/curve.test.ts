import { ident, double, quadruple, square, cube } from './curve';

describe('ident()', () => {
  it('returns the input', () => {
    expect(ident(0)).toBe(0);
    expect(ident(0.2)).toBe(0.2);
    expect(ident(0.4)).toBe(0.4);
    expect(ident(0.6)).toBe(0.6);
    expect(ident(0.7)).toBe(0.7);
    expect(ident(0.8)).toBe(0.8);
  });
});

describe('double()', () => {
  it('doubles the input', () => {
    expect(double(0)).toBe(0);
    expect(double(1)).toBe(2);
    expect(double(2)).toBe(4);
    expect(double(3)).toBe(6);
  });
});

describe('quadruple()', () => {
  it('quadruples the input', () => {
    expect(quadruple(0)).toBe(0);
    expect(quadruple(1)).toBe(4);
    expect(quadruple(2)).toBe(8);
    expect(quadruple(3)).toBe(12);
  });
});

describe('square()', () => {
  it('squares the input', () => {
    expect(square(0)).toBe(0);
    expect(square(1)).toBe(1);
    expect(square(2)).toBe(4);
    expect(square(3)).toBe(9);
  });
});

describe('cube()', () => {
  it('cubes the input', () => {
    expect(cube(0)).toBe(0);
    expect(cube(1)).toBe(1);
    expect(cube(2)).toBe(16);
    expect(cube(3)).toBe(81);
  });
});
