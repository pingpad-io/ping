import { configureStore, type Action } from "@reduxjs/toolkit";

export interface State {
  currentThreadId: string;
  currentThreadName: string;
}

interface SetCurrentThreadAction extends Action {
  type: "SET_CURRENT_THREAD";
  payload: { name: string; id: string };
}

type ActionTypes = SetCurrentThreadAction;

export const GLOBAL_THREAD_ID = "5cfda833-5000-439c-ad21-bf0dc05c88a0";

const initialState: State = {
  currentThreadId: GLOBAL_THREAD_ID,
  currentThreadName: "global",
};

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case "SET_CURRENT_THREAD":
      return {
        ...state,
        currentThreadName: action.payload.name,
        currentThreadId: action.payload.id,
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer,
});
