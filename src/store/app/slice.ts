import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  REALM,
  UNSAFE_CLIENT_ID,
  UNSAFE_CLIENT_SECRET,
  UNSAFE_TEMPLATE_ID,
} from '@/config';

import type { AppState, ConsoleLineEntry } from './types';
const initialState: AppState = {
  // CIBA parameters
  realm: REALM,
  clientId: UNSAFE_CLIENT_ID,
  clientSecret: UNSAFE_CLIENT_SECRET,
  templateId: UNSAFE_TEMPLATE_ID,
  authReqId: '',
  grantType: 'urn:openid:params:grant-type:ciba',
  // Console
  consoleLines: [{ text: '🚀 Console ready...', timestamp: Date.now() }],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setRealm(state, action: PayloadAction<string>) {
      state.realm = action.payload;
    },

    setClientId(state, action: PayloadAction<string>) {
      state.clientId = action.payload;
    },

    setClientSecret(state, action: PayloadAction<string>) {
      state.clientSecret = action.payload;
    },

    setTemplateId(state, action: PayloadAction<string>) {
      state.templateId = action.payload;
    },

    setAuthReqId(state, action: PayloadAction<string>) {
      state.authReqId = action.payload;
    },

    setGrantType(state, action: PayloadAction<string>) {
      state.grantType = action.payload;
    },

    appendToConsole(state, action: PayloadAction<ConsoleLineEntry[]>) {
      state.consoleLines.push(...action.payload);
    },

    clearConsole(state) {
      state.consoleLines = initialState.consoleLines;
    },
  },
});

export const { actions, getInitialState, name, reducer } = appSlice;
export default {
  reducer: appSlice.reducer,
  asyncInitActions: [],
};
