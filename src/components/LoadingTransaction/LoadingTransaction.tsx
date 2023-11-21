import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated, Easing} from 'react-native';
import {Colors} from '../../utils';
const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

interface Props{
  active: boolean
}

const LoadingTransaction = ({active}: Props) => {
  const smallCircle = useRef(new Animated.Value(0)).current;
  const mediumCircle = useRef(new Animated.Value(0)).current;
  const bigCircle = useRef(new Animated.Value(0)).current;
  const styleSmallCircle = smallCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg'],
  });
  const styleMediumCircle = mediumCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  const styleBigCircle = bigCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '-360deg'],
  });
  const animation = Animated.loop(
    Animated.parallel([
      Animated.timing(smallCircle, {
        toValue: 360,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(mediumCircle, {
        toValue: 360,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(bigCircle, {
        toValue: 360,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]),
    {
      iterations: 1000,
    },
  );
  useEffect(() => {
    if (active) {
      animation.start();
    } else {
      animation.stop();
    }
  }, [active]);

  if (!active) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerCircles}>
        <Animated.View
          style={[styles.circles, styles.bigCircle, {transform: [{rotate: styleBigCircle}]}]}></Animated.View>
        <Animated.View
          style={[styles.circles, styles.mediumCircle, {transform: [{rotate: styleMediumCircle}]}]}></Animated.View>
        <Animated.View
          style={[styles.circles, styles.smallCircle, {transform: [{rotate: styleSmallCircle}]}]}></Animated.View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCircles: {
    width: 80,
    height: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circles: {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 6,
  },
  bigCircle: {
    height: 80,
    width: 80,
    borderLeftColor: 'rgba(0,0,0,.009)',
    borderTopColor: Colors.green,
    borderBottomColor: 'rgba(0,0,0,.009)',
    borderRightColor: Colors.green,
    borderRadius: 40,
  },
  mediumCircle: {
    height: 60,
    width: 60,
    borderLeftColor: 'rgba(0,0,0,.009)',
    borderTopColor: 'rgba(0,0,0,.009)',
    borderBottomColor: Colors.blackBackground,
    borderRightColor: Colors.blackBackground,
    borderRadius: 30,
  },
  smallCircle: {
    height: 40,
    width: 40,
    borderLeftColor: Colors.black,
    borderTopColor: Colors.black,
    borderBottomColor: 'rgba(0,0,0,.009)',
    borderRightColor: 'rgba(0,0,0,.009)',
    borderRadius: 20,
  },
});

export default LoadingTransaction;
