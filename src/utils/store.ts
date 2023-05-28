import { Action, configureStore } from "@reduxjs/toolkit";

export interface State {
  currentThread: string;
}

interface SetCurrentThreadAction extends Action {
  type: "SET_CURRENT_THREAD";
  payload: string;
}

type ActionTypes = SetCurrentThreadAction;

export const DEFAULT_THREAD_ID = "5cfda833-5000-439c-ad21-bf0dc05c88a0"

const initialState: State = {
  currentThread: DEFAULT_THREAD_ID
};

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case "SET_CURRENT_THREAD":
      return { ...state, currentThread: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer,
});
