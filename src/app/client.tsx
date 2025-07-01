import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import qs from 'qs';

import Button from '@/components/Button/Button';
import Console from '@/components/Console/Console';
import Header from '@/components/Header/Header';
import TextInput from '@/components/TextInput/TextInput';
import { BACKEND_BASEURL } from '@/config';
import { useApp } from '@/store/app/hooks';

export default function ClientScreen() {
  // Redux props
  const {
    authReqId,
    clientId,
    clientSecret,
    grantType,
    realm,
    templateId,
    appendToConsole,
    clearConsole,
    setAuthReqId,
  } = useApp();

  // Component props
  const [personIDNumber, setPersonIDNumber] = useState('145364');

  const [step, setStep] = useState(1);
  const [authRequestStatus, setAuthRequestStatus] = useState<
    'idle' | 'pending' | 'ok' | 'error'
  >('idle');
  const [pollRequestStatus, setPollRequestStatus] = useState<
    'idle' | 'pending' | 'ok' | 'pending approval' | 'error' | 'stopped'
  >('idle');

  const [isRequestValid, setIsRequestValid] = useState(false);
  const [requestValidTimerKey, setRequestValidTimerKey] = useState(0);
  const [pollRequestTimerKey, setPollRequestTimerKey] = useState(0);
  const [timerDuration, setTimerDuration] = useState(120);
  const [pollInterval, setPollInterval] = useState(5);
  const [lastPollResponse, setLastPollResponse] = useState('');

  // Effects
  useEffect(() => {
    setInterval(() => {});
  }, []);

  // Handlers
  const reset = useCallback(() => {
    setStep(1);
    setAuthRequestStatus('idle');
    setPollRequestStatus('idle');
    setIsRequestValid(false);
    setLastPollResponse('');
    clearConsole();
  }, [clearConsole]);

  const sendAuthRequest = useCallback(() => {
    reset();

    const url = new URL(
      `/realms/${realm}/protocol/openid-connect/ext/ciba/auth`,
      BACKEND_BASEURL,
    );

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const data = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      login_hint: personIDNumber,
      scope: 'openid',
      binding_message: templateId,
      is_consent_required: 'true',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };

    setAuthRequestStatus('pending');
    axios
      .request(config)
      .then((response) => {
        setAuthRequestStatus('ok');
        setStep(2);
        setRequestValidTimerKey((prev) => prev + 1); // restart timer
        setAuthReqId(response.data.auth_req_id);
        setTimerDuration(response.data.expires_in);
        setPollInterval(response.data.interval);
        setIsRequestValid(true);
        setPollRequestStatus('idle');

        appendToConsole(
          `Auth response received: ${JSON.stringify(response.data, null, 2)}`,
        );
      })
      .catch((err) => {
        if (err.isAxiosError && err.response?.data) {
          const data = err.response?.data;
          setAuthRequestStatus('error');
          appendToConsole(data);
          setIsRequestValid(false);
        } else {
          setAuthRequestStatus('error');
          setIsRequestValid(false);
          appendToConsole(err.message);
        }
      });
  }, [
    appendToConsole,
    clientId,
    clientSecret,
    personIDNumber,
    realm,
    reset,
    setAuthReqId,
    templateId,
  ]);

  const sendPollRequest = useCallback(() => {
    if (!isRequestValid) return;
    if (pollRequestStatus === 'pending') return;
    if (step >= 3) return;

    const url = new URL(
      `/realms/${realm}/protocol/openid-connect/token`,
      BACKEND_BASEURL,
    );

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const data = qs.stringify({
      grant_type: grantType,
      auth_req_id: authReqId,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };

    setPollRequestStatus('pending');
    setLastPollResponse('');

    axios
      .request(config)
      .then((response) => {
        setPollRequestStatus('ok');
        setStep(3);

        setLastPollResponse(JSON.stringify(response.data, null, 2));
        appendToConsole(
          `Final poll response received: ${JSON.stringify(response.data, null, 2)}`,
        );
        appendToConsole(
          `id_token: ${JSON.stringify(jwtDecode(response.data.id_token), null, 2)}`,
        );
      })
      .catch((err) => {
        if (err.isAxiosError && err.response?.data) {
          const data = err.response?.data;
          setLastPollResponse(JSON.stringify(data, null, 2));
          appendToConsole(
            `Poll response received: ${JSON.stringify(data, null, 2)}`,
          );

          if (data.error === 'access_denied') {
            setStep(4);
            setPollRequestStatus('stopped');
          } else {
            setPollRequestTimerKey((prev) => prev + 1); // restart timer
            setPollRequestStatus('pending approval');
          }
        } else {
          setPollRequestTimerKey((prev) => prev + 1); // restart timer
          setPollRequestStatus('error');
          appendToConsole(err.message);
        }
      });
  }, [
    appendToConsole,
    authReqId,
    clientId,
    clientSecret,
    grantType,
    isRequestValid,
    pollRequestStatus,
    realm,
    step,
  ]);

  return (
    <View className='flex flex-1'>
      <Header />

      {/* Content */}
      <View className='w-full flex-1 flex-col items-start justify-start gap-4'>
        {/* 
          //#region Step 1 
        */}
        <View className='flex w-full items-start bg-gray-300 py-2 pl-2'>
          <Text className='font-bold text-gray-700'>
            Step 1. Retrieve client Person ID Number
          </Text>
        </View>

        <View className='flex-row items-center px-2'>
          <Text className='w-1/4 text-gray-700'>Client ID</Text>
          <TextInput
            onChangeText={setPersonIDNumber}
            className='w-3/4 rounded border border-gray-300 px-2 py-1'
            value={personIDNumber}
          />
        </View>

        <View className='relative w-full flex-row items-center justify-center gap-8 px-2'>
          <Button
            title='Send authentication request'
            disabled={
              !clientId || !clientSecret || !templateId || !personIDNumber
            }
            className='bg-[#0d3890] dark:bg-[#0d3890]'
            titleClassName='text:white dark:text-white'
            onPress={sendAuthRequest}
          />
          {step <= 2 && (
            <View className='absolute right-2 flex-row gap-2'>
              {authRequestStatus === 'ok' ? (
                <>
                  <AntDesign name='checkcircle' size={24} color='#16A34A' />
                  <CountdownCircleTimer
                    key={requestValidTimerKey}
                    isPlaying
                    duration={timerDuration}
                    colors='#16A34A'
                    size={24}
                    strokeWidth={2}
                    onComplete={() => setIsRequestValid(false)}
                  >
                    {({ remainingTime }) => (
                      <Text className='text-xs'>{remainingTime}</Text>
                    )}
                  </CountdownCircleTimer>
                </>
              ) : authRequestStatus === 'error' ? (
                <MaterialIcons name='error' size={24} color='#DC2626' />
              ) : authRequestStatus === 'pending' ? (
                <ActivityIndicator size={'small'} />
              ) : null}
            </View>
          )}
        </View>

        {/* 
          //#region Step 2 
        */}
        {step >= 2 && (
          <View className='flex w-full items-start bg-gray-300 py-2 pl-2'>
            <Text className='font-bold text-gray-700'>
              Step 2. Confirm authorisation on Vanuatu Pass
            </Text>
          </View>
        )}

        {step === 2 && (
          <>
            <View className='flex-row items-center px-2'>
              <Text className='w-1/4 text-gray-700'>Poll interval</Text>
              <View className='w-3/4 flex-row items-center gap-2'>
                <TextInput
                  onChangeText={(text) => {
                    if (!isNaN(+text)) {
                      setPollInterval(+text);
                    }
                  }}
                  className='flex-1 rounded border border-gray-300 px-2 py-1'
                  value={pollInterval?.toString()}
                />
                {pollRequestStatus === 'ok' ? (
                  <AntDesign name='checkcircle' size={24} color='#16A34A' />
                ) : pollRequestStatus === 'pending approval' ? (
                  <AntDesign
                    name='warning'
                    size={24}
                    color='#fdba74'
                    onPress={() => setPollRequestStatus('stopped')}
                  />
                ) : pollRequestStatus === 'error' ||
                  pollRequestStatus === 'stopped' ? (
                  <MaterialIcons
                    name='error'
                    size={24}
                    color='#DC2626'
                    onPress={() => setPollRequestStatus('stopped')}
                  />
                ) : pollRequestStatus === 'pending' ? (
                  <ActivityIndicator size={'small'} />
                ) : null}
                {(pollRequestStatus === 'idle' ||
                  pollRequestStatus === 'pending approval' ||
                  pollRequestStatus === 'error') && (
                  <Pressable
                    disabled={!isRequestValid}
                    className='flex-row items-center gap-2'
                    onPress={sendPollRequest}
                  >
                    <Text className='text-xs text-gray-400'>Next poll in</Text>
                    <CountdownCircleTimer
                      key={pollRequestTimerKey}
                      isPlaying
                      duration={pollInterval}
                      colors='#111827'
                      size={24}
                      strokeWidth={2}
                      onComplete={sendPollRequest}
                    >
                      {({ remainingTime }) => (
                        <Text className='text-xs'>{remainingTime}</Text>
                      )}
                    </CountdownCircleTimer>
                  </Pressable>
                )}
              </View>
            </View>

            {lastPollResponse && (
              <>
                <Text className='pl-2 text-gray-700'>Last poll message</Text>
                <View className='-mt-2 w-[95%] self-center rounded-md bg-white p-4 dark:border-gray-700 dark:bg-gray-600'>
                  <Text className='font-mono text-sm text-gray-800 dark:text-gray-100'>
                    {lastPollResponse}
                  </Text>
                </View>
              </>
            )}
          </>
        )}

        {/* 
          //#region Step 3
        */}
        {step === 3 && (
          <>
            <View className='flex w-full items-start bg-gray-300 py-2 pl-2'>
              <Text className='font-bold text-gray-700'>
                Step 3. Do something with the auth data
              </Text>
            </View>
            <View className='flex w-full items-start pl-2'>
              <Text className='font-bold text-gray-700'>Access granted ✅</Text>
            </View>
            <View className='flex w-full items-start gap-2 pl-4'>
              <Text className='text-gray-700'>
                * Use Auth/Refresh token data to access dedicated endpoints
              </Text>
              <Text className='text-gray-700'>
                * Decode JWT id_token to retrieve user data
              </Text>
              <Text className='text-gray-700'>* ...</Text>
            </View>
          </>
        )}
      </View>

      {/* 
          //#region Step 4
        */}
      {step === 4 && (
        <View className='flex-1 flex-col'>
          <View className='flex w-full items-start bg-gray-300 py-2 pl-2'>
            <Text className='font-bold text-gray-700'>
              Step 4. Authentication was not granted
            </Text>
          </View>
          <View className='flex w-full items-start gap-2 py-2 pl-2'>
            <Text className='text-gray-700'>🤷‍♂️</Text>
          </View>
        </View>
      )}

      {/* Console */}
      <View className='h-20% w-full'>
        <Console />
      </View>

      {/* Reset button */}
      <Button
        title='Reset'
        disabled={!clientId || !clientSecret || !templateId || !personIDNumber}
        className='h-[60] rounded-t-none bg-[#139cea] dark:bg-[#139cea]'
        titleClassName='text:white dark:text-white text-xl font-bold'
        onPress={reset}
      />
    </View>
  );
}
