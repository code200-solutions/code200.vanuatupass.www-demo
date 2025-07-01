import { Text, View } from 'react-native';

import Button from '@/components/Button/Button';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function Page() {
  return (
    <View className='flex flex-1'>
      <Header />
      <Content />
      <Footer />
    </View>
  );
}

function Content() {
  return (
    <View className='flex-1 items-center justify-center'>
      <View className='py-12 md:py-24 lg:py-32 xl:py-48'>
        <View className='px-4 md:px-6'>
          <View className='flex flex-col items-center gap-4 text-center'>
            <Text
              role='heading'
              className='native:text-5xl text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl'
            >
              Vanuatu Pass
            </Text>
            <Text
              role='heading'
              className='native:text-2xl sm:text-1xl text-center text-xl font-bold tracking-tighter md:text-2xl lg:text-3xl'
            >
              Client-side demo
            </Text>
            <Text className='mx-auto max-w-[700px] text-center text-lg text-gray-500 md:text-xl dark:text-gray-400'>
              Simple client illustrating a OAuth 2.0 CIBA Authentication
              workflow using Vanuatu Pass app.
            </Text>

            <View className='mt-8 flex flex-row gap-4'>
              <Button href='client'>Client</Button>
              <Button href='configuration'>Configuration</Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
