import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Button,
} from 'react-native';
import Constants from 'expo-constants';
import toast, { useToaster } from 'react-hot-toast/headless';




const Toast = ({ t, updateHeight, offset }) => {

  // Animations for enter and exit
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const posAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
    }).start();
  }, [fadeAnim, t.visible]);

  useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
    }).start();
  }, [posAnim, offset, t.visible]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: 'center',
        opacity: fadeAnim,
        transform: [
          {
            translateY: posAnim,
          },
        ],
      }}>
      <View
        onLayout={(event) =>
          updateHeight(event.nativeEvent.layout.height)
        }
        style={{
          margin: Constants.statusBarHeight + 10,
          backgroundColor: 'green',
          width: 150,
          borderRadius: '30px',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,

        }}
        key={t.id}>
        <Text>{t.icon} </Text>
        <Text
          style={{
            color: '#fff',
            padding: 4,
            flex: 1,
            textAlign: 'center',
          }}>
          {t.message}
        </Text>
      </View>
    </Animated.View>
  );
};

const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          t={t}
          updateHeight={(height) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>React Hot Toast</Text>

        <Button
          title="Create Toast"
          onPress={() => {
            toast('Hello Native', {
              icon: '🔥',
            });
          }}
        />

      <Notifications />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
