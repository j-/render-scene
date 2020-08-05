import React from 'react';
import CurveGraph from './CurveGraph';
import { ident, easeInOut, range, loop, pulse, phase, sin, cos, multiply, square, cube } from './curve';

export default {
  title: 'CurveGraph',
  component: CurveGraph,
};

export const Ident = () => <CurveGraph curve={ident} />;
export const EaseInOut = () => <CurveGraph curve={easeInOut} />;

export const Range0109 = () => <CurveGraph curve={range(0.1, 0.9)} />;
Range0109.story = { name: 'Range from 0.1 to 0.9' }

export const Range0506 = () => <CurveGraph curve={range(0.5, 0.6)} />;
Range0506.story = { name: 'Range from 0.5 to 0.6' }

export const Loop1 = () => <CurveGraph curve={loop(1)} />;
export const Loop2 = () => <CurveGraph curve={loop(2)} />;
export const Loop3 = () => <CurveGraph curve={loop(3)} />;

export const Pulse1 = () => <CurveGraph curve={pulse(1)} />;
export const Pulse2 = () => <CurveGraph curve={pulse(2)} />;
export const Pulse3 = () => <CurveGraph curve={pulse(3)} />;

export const PhaseIdent02 = () => <CurveGraph curve={phase(ident, 0.2)} />;
PhaseIdent02.story = { name: 'Phase ident 0.2' }

export const PhaseIdent05 = () => <CurveGraph curve={phase(ident, 0.5)} />;
PhaseIdent05.story = { name: 'Phase ident 0.5' }

export const PhasePulse2025 = () => <CurveGraph curve={phase(pulse(2), -0.25)} />;
PhasePulse2025.story = { name: 'Phase pulse(2) -0.25' }

export const Sin = () => <CurveGraph curve={sin} />;
export const Cos = () => <CurveGraph curve={cos} />;

export const Square = () => <CurveGraph curve={square} />;
export const Cube = () => <CurveGraph curve={cube} />;

export const Multiply2 = () => <CurveGraph curve={multiply(2)} />;
