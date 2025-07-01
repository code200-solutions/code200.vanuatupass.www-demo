import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Provider as ReduxProvider } from 'react-redux';

import { BACKEND_BASEURL, ENVIRONMENT } from '@/config';
import { store as reduxStore } from '@/store/store';

console.log(Array(80).fill('-').join(''));
console.log(
  Array(32).fill('-').join(''),
  ' STARTING UP! ',
  Array(32).fill('-').join(''),
);
console.log(Array(80).fill('-').join(''));
console.log('ENVIRONMENT:', ENVIRONMENT);
console.log('BACKEND BASE URL:', BACKEND_BASEURL);

export default function Layout() {
  return (
    <ReduxProvider store={reduxStore}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name='home' options={{ headerShown: false }} />
          <Stack.Screen name='client' options={{ headerShown: false }} />
          <Stack.Screen
            name='(modals)/configuration'
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
              headerShown: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}
