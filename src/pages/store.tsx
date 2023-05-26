import { Thread } from '@prisma/client'
import { configureStore, Action } from '@reduxjs/toolkit'

// Define types
export interface State {
  currentThread: Thread | null
}

interface SetCurrentThreadAction extends Action {
  type: 'SET_CURRENT_THREAD'
  payload: Thread
}

type ActionTypes = SetCurrentThreadAction

const initialState: State = {
  currentThread: null
}

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case 'SET_CURRENT_THREAD':
      return { ...state, currentThread: action.payload }
    default:
      return state
  }
}

const store = configureStore({
  reducer
})

export default store