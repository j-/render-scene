import { Reducer } from 'redux';
import { isActionReset } from './actions';

export interface RootReducerState {
  isPlaying: boolean;
}

export const DEFAULT_STATE: RootReducerState = {
  isPlaying: false,
};

export const reducer: Reducer<RootReducerState> = (state = DEFAULT_STATE, action) => {
  if (isActionReset(action)) {
    return DEFAULT_STATE;
  }

  return state;
};

export default reducer;

export const isPlaying = (state: RootReducerState) => state.isPlaying;
