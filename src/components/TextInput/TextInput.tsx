import { useMemo } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';

import { twMerge } from 'tailwind-merge';

export default function TextInput(props: TextInputProps) {
  const className = useMemo(
    () =>
      twMerge(
        'border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        !props.editable &&
          'text-gray-200 text-muted-foreground focus:outline-none focus-visible:ring-0 focus:border-none',
      ),
    [props.editable],
  );

  return <RNTextInput className={className} {...props} />;
}
