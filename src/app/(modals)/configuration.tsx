import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '@/components/Button/Button';
import TextInput from '@/components/TextInput/TextInput';
import { STORED_PROPERTY_PREFIX } from '@/config';
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
    setTemplateId,
  } = useApp();

  // Component props
  const [newRealm, setNewRealm] = useState('');
  const [newClientId, setNewClientId] = useState('');
  const [newClientSecret, setNewClientSecret] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('');

  // Effects
  // - Load conf from storage
  useEffect(() => {
    const loadConfig = async () => {
      // Read from secure store
      const storedRealm = await SecureStore.getItemAsync(
        `${STORED_PROPERTY_PREFIX}.realm`,
      );
      const storedClientId = await SecureStore.getItemAsync(
        `${STORED_PROPERTY_PREFIX}.clientId`,
      );
      const storedClientSecret = await SecureStore.getItemAsync(
        `${STORED_PROPERTY_PREFIX}.clientSecret`,
      );
      const storedTemplateId = await SecureStore.getItemAsync(
        `${STORED_PROPERTY_PREFIX}.templateId`,
      );

      // Apply
      if (storedRealm && storedRealm !== realm) {
        setRealm(storedRealm);
        console.log(
          `[Configuration.useEffect] Updating realm with value from SecureStore `,
          storedRealm,
        );
      }
      if (storedClientId && storedClientId !== clientId) {
        setClientId(storedClientId);
        console.log(
          `[Configuration.useEffect] Updating clientId with value from SecureStore `,
          storedClientId,
        );
      }
      if (storedClientSecret && storedClientSecret !== clientSecret) {
        setClientSecret(storedClientSecret);
        console.log(
          `[Configuration.useEffect] Updating clientSecret with value from SecureStore `,
          storedClientSecret,
        );
      }
      if (storedTemplateId && storedTemplateId !== clientSecret) {
        setTemplateId(storedTemplateId);
        console.log(
          `[Configuration.useEffect] Updating templateId with value from SecureStore `,
          storedTemplateId,
        );
      }
    };

    loadConfig().catch((err) => {
      console.error(`Unable to load config from storage`, err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // - Sync props
  useEffect(() => {
    if (realm !== newRealm) setNewRealm(realm);
    if (clientId !== newClientId) setNewClientId(clientId);
    if (clientSecret !== newClientSecret) setNewClientSecret(clientSecret);
    if (templateId !== newTemplateId) setNewTemplateId(templateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm, clientId, clientSecret, templateId]);

  // Handlers
  const saveConfiguration = useCallback(() => {
    setRealm(newRealm);
    setClientId(newClientId);
    setClientSecret(newClientSecret);
    setTemplateId(newTemplateId);
    router.back();
  }, [
    newClientId,
    newClientSecret,
    newRealm,
    newTemplateId,
    setClientId,
    setClientSecret,
    setRealm,
    setTemplateId,
  ]);

  return (
    <View className='absolute inset-0 z-50 items-center justify-start bg-white/70'>
      {/* Dismiss when tapping outside modal */}
      <Pressable className='absolute inset-0' onPress={() => router.back()} />

      {/* Modal content */}
      <View className='z-10 mt-[20%] w-fit max-w-[350] gap-4 self-center rounded-md bg-gray-100 p-6'>
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
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            onChangeText={setNewClientId}
            value={newClientId}
          />
        </View>

        {/* Client secret */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-700'>Keycloak Client Secret</Text>
          <TextInput
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            onChangeText={setNewClientSecret}
            value={newClientSecret}
          />
        </View>

        {/* Template id */}
        <View className='flex-row items-center space-x-4'>
          <Text className='w-2/5 text-gray-700'>Template id</Text>
          <TextInput
            className='w-3/5 rounded border border-gray-300 px-2 py-1'
            onChangeText={setNewTemplateId}
            value={newTemplateId}
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
