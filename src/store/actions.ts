import { Action } from 'redux';

export const ACTION_RESET = 'RESET';

export interface ActionReset extends Action<typeof ACTION_RESET> { }

export const isActionReset = (action: Action): action is ActionReset => (
  action.type === ACTION_RESET
);

export const reset = (): ActionReset => ({
  type: ACTION_RESET,
});
