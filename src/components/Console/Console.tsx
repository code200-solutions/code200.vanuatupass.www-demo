import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { format } from 'date-fns';

import { useApp } from '@/store/app/hooks';

export default function Console() {
  // Redux props
  const { consoleLines } = useApp();

  // Component props
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom when new line added
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [consoleLines.length]);

  return (
    <View className='h-80 w-full bg-gray-900 p-2'>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        className='flex-1'
      >
        {consoleLines.map(({ text, timestamp }, index) => (
          <Text
            key={index}
            className='font-mono text-sm leading-relaxed text-gray-100'
            selectable={false}
          >
            [{format(timestamp, 'HH:mm:ss')}] {text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
