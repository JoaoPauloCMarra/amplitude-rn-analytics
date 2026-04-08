import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {useEffect} from 'react';
import {identify, Identify, init, track, Types} from 'amplitude-rn-analytics';

export default function App() {
  useEffect(() => {
    (async () => {
        await init('API_KEY', 'example_user_id', {
            logLevel: Types.LogLevel.Verbose,
        }).promise;
        track('test');
        await identify(new Identify().set('react-native-test', 'yes')).promise;
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
