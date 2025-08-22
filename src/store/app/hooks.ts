import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { STORED_PROPERTY_PREFIX } from '@/config';

import { useStoreDispatch, useStoreSelector } from '../store';
import { actions as syncActions } from './slice';

export const useApp = () => {
  const dispatch = useStoreDispatch();
  const appState = useStoreSelector(({ app }) => app);

  // Sync hooks
  const setClientId = useCallback(
    (id: string) => {
      dispatch(syncActions.setClientId(id));

      if (Platform.OS !== 'web') {
        // Non blocking save to secure store
        SecureStore.setItemAsync(`${STORED_PROPERTY_PREFIX}.clientId`, id)
          .then(() => {
            console.log(
              `[useApp.setRealm] Saved clientId '${id}' into secure store`,
            );
          })
          .catch((err) => {
            console.error(
              `[useApp.setRealm] Unable to save clientId into the secure store`,
              err,
            );
          });
      }
    },
    [dispatch],
  );

  const setRealm = useCallback(
    (realm: string) => {
      dispatch(syncActions.setRealm(realm));

      if (Platform.OS !== 'web') {
        // Non blocking save to secure store
        SecureStore.setItemAsync(`${STORED_PROPERTY_PREFIX}.realm`, realm)
          .then(() => {
            console.log(
              `[useApp.setRealm] Saved realm '${realm}' into secure store`,
            );
          })
          .catch((err) => {
            console.error(
              `[useApp.setRealm] Unable to save realm into the secure store`,
              err,
            );
          });
      }
    },
    [dispatch],
  );

  const setClientSecret = useCallback(
    (secret: string) => {
      dispatch(syncActions.setClientSecret(secret));

      if (Platform.OS !== 'web') {
        // Non blocking save to secure store
        SecureStore.setItemAsync(
          `${STORED_PROPERTY_PREFIX}.clientSecret`,
          secret,
        )
          .then(() => {
            console.log(
              `[useApp.setRealm] Saved clientSecret '${secret}' into secure store`,
            );
          })
          .catch((err) => {
            console.error(
              `[useApp.setRealm] Unable to save clientSecret into the secure store`,
              err,
            );
          });
      }
    },
    [dispatch],
  );

  const setTemplateId = useCallback(
    (id: string) => {
      dispatch(syncActions.setTemplateId(id));

      if (Platform.OS !== 'web') {
        // Non blocking save to secure store
        SecureStore.setItemAsync(`${STORED_PROPERTY_PREFIX}.templateId`, id)
          .then(() => {
            console.log(
              `[useApp.setRealm] Saved templateId '${id}' into secure store`,
            );
          })
          .catch((err) => {
            console.error(
              `[useApp.setRealm] Unable to save templateId into the secure store`,
              err,
            );
          });
      }
    },
    [dispatch],
  );

  const setAuthReqId = useCallback(
    (id: string) => {
      dispatch(syncActions.setAuthReqId(id));
    },
    [dispatch],
  );

  const setGrantType = useCallback(
    (grantType: string) => {
      dispatch(syncActions.setGrantType(grantType));
    },
    [dispatch],
  );

  const appendToConsole = useCallback(
    (line: string | string[]) => {
      const timestamp = Date.now();
      dispatch(
        syncActions.appendToConsole(
          [].concat(line).map((text) => ({ timestamp, text })),
        ),
      );
    },
    [dispatch],
  );

  const clearConsole = useCallback(() => {
    dispatch(syncActions.clearConsole());
  }, [dispatch]);

  return {
    ...appState,

    // Reducers
    setRealm,
    setClientId,
    setClientSecret,
    setTemplateId,
    setAuthReqId,
    setGrantType,
    appendToConsole,
    clearConsole,
  };
};
