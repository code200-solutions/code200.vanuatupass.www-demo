import { useCallback } from 'react';

import { useStoreDispatch, useStoreSelector } from '../store';
import { actions as syncActions } from './slice';

export const useApp = () => {
  const dispatch = useStoreDispatch();
  const appState = useStoreSelector(({ app }) => app);

  // Sync hooks
  const setClientId = useCallback(
    (id: string) => {
      dispatch(syncActions.setClientId(id));
    },
    [dispatch],
  );

  const setRealm = useCallback(
    (realm: string) => {
      dispatch(syncActions.setRealm(realm));
    },
    [dispatch],
  );

  const setClientSecret = useCallback(
    (secret: string) => {
      dispatch(syncActions.setClientSecret(secret));
    },
    [dispatch],
  );

  const setTemplateId = useCallback(
    (id: string) => {
      dispatch(syncActions.setTemplateId(id));
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
