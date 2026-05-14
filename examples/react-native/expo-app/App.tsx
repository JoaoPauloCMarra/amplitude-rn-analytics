import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Identify, Types, identify, init, track } from 'amplitude-rn-analytics';

export default function App() {
  const [message, setMessage] = useState('Open up App.tsx to start working on your app!');

  useEffect(() => {
    let isMounted = true;
    void init('API_KEY', 'example_user_id', {
      logLevel: Types.LogLevel.Verbose,
    })
      .promise.then(() => track('test').promise)
      .then(() => identify(new Identify().set('react-native-test', 'yes')).promise)
      .then((result) => {
        if (isMounted) {
          setMessage(result.message || 'Amplitude example initialized');
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setMessage(String(error));
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});
