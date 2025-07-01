import { LinkProps, router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  Text,
  TextProps,
} from 'react-native';

import { twMerge } from 'tailwind-merge';

export type ButtonProps = React.PropsWithChildren<
  {
    href?: LinkProps['href'];
    title?: string;
    titleClassName?: TextProps['className'];
  } & PressableProps
>;
export default function Button({
  children,
  title,
  titleClassName,
  href = '',
  className: classNameProp,
  onPress: onPressProp,
  ...props
}: ButtonProps) {
  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      onPressProp?.(event);
      if (href) router.push(href);
    },
    [href, onPressProp],
  );

  return (
    <Pressable
      className={twMerge(
        'ios:shadow flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:ring-gray-950 active:bg-gray-400/90 disabled:pointer-events-none disabled:opacity-50 web:shadow web:focus-visible:outline-none web:focus-visible:ring-1 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300',
        classNameProp,
      )}
      onPress={onPress}
      {...props}
    >
      {typeof children === 'string' || !!title ? (
        <Text
          className={twMerge(
            titleClassName,
            props.disabled ? 'text-gray-400 dark:text-gray-400' : '',
          )}
        >
          {title ?? children}
        </Text>
      ) : React.isValidElement(children) && typeof children !== 'string' ? (
        children
      ) : null}
    </Pressable>
  );
}
