import React, {useState, useRef, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {Easing, withTiming, useSharedValue} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import Animated, {useAnimatedProps} from 'react-native-reanimated';
import { Colors } from '../../src/utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedStroked = props => {
  const [length, setLength] = useState(0);
  const ref = useRef(null);

  const strokeAnimation = useAnimatedProps(() => {
    return {strokeDashoffset: length - length * props.progress.value};
  });

  return (
    <AnimatedPath
      onLayout={() => setLength(ref.current.getTotalLength())}
      ref={ref}
      strokeDasharray={length}
      animatedProps={strokeAnimation}
      {...props}
    />
  );
};

const CheckAnimate = props => {
  const vWidth = 1400;
  const vHeight = 1400;
  const width = Dimensions.get('window').width - 64;
  const height = (width * vHeight) / vWidth;
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, {duration: 700, easing: Easing.linear});
  }, [progress]);
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={[-150, -150, vWidth, vHeight].join(' ')}
      {...props}>
      <AnimatedStroked
        d="m284.04 547.448 191.634 186.259 247.065-255.216 240.172-240.174"
        stroke={Colors.blackBackground}
        strokeWidth={75}
        strokeLinecap="round"
        strokeLinejoin="round"
        progress={progress}
      />
      <AnimatedStroked
        d="M830 131C321-204-204.5 441.5 158 871s1023.5 44 875.5-468.5"
        stroke={Colors.blackBackground}
        strokeWidth={75}
        strokeLinecap="round"
        strokeLinejoin="round"
        progress={progress}
      />
    </Svg>
  );
};

export default CheckAnimate;
