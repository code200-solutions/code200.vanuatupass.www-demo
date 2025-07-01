import { useDispatch, useSelector } from 'react-redux';

import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { ENVIRONMENT } from '@/config';

import appSlice from './app/slice';
import { listenerMiddleware } from './listenerMiddlewares';

const rootReducer = combineReducers({
  // Slice reducers
  app: appSlice.reducer,
});

// Example of using thunk for network actions
// https://medium.com/@ozantekindev/async-operations-in-redux-with-the-redux-toolkit-thunk-e7d024cbf875
const store = configureStore({
  devTools: ENVIRONMENT !== 'production',
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { warnAfter: 128 },
    }).prepend(listenerMiddleware.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useStoreDispatch = useDispatch.withTypes<AppDispatch>();
export const useStoreSelector = useSelector.withTypes<RootState>();

export { store, listenerMiddleware as storeListener };
