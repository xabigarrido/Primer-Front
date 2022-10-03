import { configureStore } from '@reduxjs/toolkit'
import userStore from '../features/userStore'

export const store = configureStore({
  reducer: {
    userStore
  },
})
