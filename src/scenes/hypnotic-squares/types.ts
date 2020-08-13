export interface Box extends Array<number> {
  length: 4;
  /** x */
  0: number;
  /** y */
  1: number;
  /** width */
  2: number;
  /** height */
  3: number;
}

export interface Boxes extends Array<Box> { }

export interface Point extends Array<number> {
  length: 2;
  /** x  */
  0: number;
  /** y  */
  1: number;
}

export interface Points extends Array<Point> { }
