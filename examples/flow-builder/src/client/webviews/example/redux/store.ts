import { configureStore } from '@reduxjs/toolkit'

import viewReducer from './view-slice'

export const store = configureStore({
  reducer: {
    view: viewReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
