import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: top }}>
      <View className='flex h-14 flex-row items-center justify-between px-4 lg:px-6'>
        <Text className={'text-center text-gray-300'}>v1.0.0</Text>
        <View className='flex flex-row gap-4 sm:gap-6'>
          <Link
            className='text-md font-medium hover:underline web:underline-offset-4'
            href='/'
          >
            Home
          </Link>
          <Link
            className='text-md font-medium hover:underline web:underline-offset-4'
            href='/client'
          >
            Client
          </Link>
          <Link
            className='text-md font-medium hover:underline web:underline-offset-4'
            href='/(modals)/configuration'
          >
            Configuration
          </Link>
        </View>
      </View>
    </View>
  );
}
