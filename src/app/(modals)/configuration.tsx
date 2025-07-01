import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '@/components/Button/Button';
import TextInput from '@/components/TextInput/TextInput';
import { useApp } from '@/store/app/hooks';

export default function ConfigurationScreen() {
  // Redux props
  const {
    realm,
    clientId,
    clientSecret,
    grantType,
    templateId,
    setRealm,
    setClientId,
    setClientSecret,
  } = useApp();

  // Component props
  const [newRealm, setNewRealm] = useState('');
  const [newClientId, setNewClientId] = useState('');
  const [newClientSecret, setNewClientSecret] = useState('');

  // Effects
  useEffect(() => {
    if (realm !== newRealm) setNewRealm(realm);
    if (clientId !== newClientId) setNewClientId(clientId);
    if (clientSecret !== newClientSecret) setNewClientSecret(clientSecret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm, clientId, clientSecret]);

  // Handlers
  const saveConfiguration = useCallback(() => {
    setRealm(newRealm);
    setClientId(newClientId);
    setClientSecret(newClientSecret);
    router.back();
  }, [
    newClientId,
    newClientSecret,
    newRealm,
    setClientId,
    setClientSecret,
    setRealm,
  ]);

  return (
    <View className='absolute inset-0 z-50 items-center justify-start bg-white/70'>
      {/* Dismiss when tapping outside modal */}
      <Pressable className='absolute inset-0' onPress={() => router.back()} />

      {/* Modal content */}
      <View className='z-10 mt-[40%] w-fit max-w-[350] gap-4 self-center rounded-md bg-gray-100 p-6'>
        {/* Realm */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-700'>Keycloak Realm</Text>
          <TextInput
            onChangeText={setNewRealm}
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            value={newRealm}
          />
        </View>

        {/* Client ID */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-700'>Keycloak Client ID</Text>
          <TextInput
            onChangeText={setNewClientId}
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            value={newClientId}
          />
        </View>

        {/* Client secret */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-700'>Keycloak Client Secret</Text>
          <TextInput
            onChangeText={setNewClientSecret}
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            value={newClientSecret}
          />
        </View>

        {/* Template id */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-400'>Template id</Text>
          <TextInput
            editable={false}
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            value={templateId}
          />
        </View>

        {/* Grant type */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-400'>Grant type</Text>
          <TextInput
            editable={false}
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            value={grantType}
          />
        </View>
        <Button
          className='mt-16 bg-[#0d3890] dark:bg-[#0d3890]'
          titleClassName='text:white dark:text-white'
          onPress={saveConfiguration}
        >
          Save
        </Button>
      </View>
    </View>
  );
}
