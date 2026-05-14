import {useCallback, useEffect, useMemo} from 'react';
import type {JSX} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {Identify, Types, identify, init, track} from 'amplitude-rn-analytics';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
    }),
    [isDarkMode],
  );
  const contentStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? '#030712' : '#ffffff',
    }),
    [isDarkMode],
  );
  const textStyle = useMemo(
    () => ({
      color: isDarkMode ? '#f9fafb' : '#111827',
    }),
    [isDarkMode],
  );

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      Toast.show({
        type,
        text1: type === 'success' ? 'Amplitude Response' : 'Amplitude Error',
        text2: message,
      });
    },
    [],
  );

  useEffect(() => {
    void init('API_KEY', 'example_user_id', {
      logLevel: Types.LogLevel.Verbose,
    }).promise.catch((error: unknown) => {
      showToast(String(error), 'error');
    });
  }, [showToast]);

  const trackEventAndShowToast = useCallback(
    async (eventName: string) => {
      try {
        const result = await track(eventName).promise;
        showToast(result.message || `Tracked ${eventName}`);
      } catch (error) {
        showToast(String(error), 'error');
      }
    },
    [showToast],
  );

  const trackIdentifyAndShowToast = useCallback(async () => {
    try {
      const result = await identify(
        new Identify().set('react-native-test', 'yes'),
      ).promise;
      showToast(result.message || 'Identify tracked');
    } catch (error) {
      showToast(String(error), 'error');
    }
  }, [showToast]);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.content}>
        <View style={[styles.panel, contentStyle]}>
          <Text style={[styles.title, textStyle]}>Test Amplitude App</Text>
          <Button
            title="Track Event"
            onPress={() => void trackEventAndShowToast('test_event')}
          />
          <Button
            title="Track Identify"
            onPress={() => void trackIdentifyAndShowToast()}
          />
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  panel: {
    gap: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
