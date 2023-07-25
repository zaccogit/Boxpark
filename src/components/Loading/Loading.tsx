import { useRef, useEffect, useContext } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import { Colors } from "../../utils";
import { RenderContext } from "../../contexts";
const width: number = Dimensions.get("window").width;
const height: number = Dimensions.get("window").height;

const Loading = () => {
  const { loader } = useContext(RenderContext);
  const smallCircle = useRef(new Animated.Value(0)).current;
  const mediumCircle = useRef(new Animated.Value(0)).current;
  const bigCircle = useRef(new Animated.Value(0)).current;
  const styleSmallCircle = smallCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "-360deg"],
  });
  const styleMediumCircle = mediumCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });
  const styleBigCircle = bigCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "-360deg"],
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
    }
  );
  useEffect(() => {
    if (loader) {
      animation.start();
    } else {
      animation.stop();
    }
  }, [loader]);

  if (!loader) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerCircles}>
        <Animated.View
          style={[
            styles.circles,
            styles.bigCircle,
            { transform: [{ rotate: styleBigCircle }] },
          ]}
        ></Animated.View>
        <Animated.View
          style={[
            styles.circles,
            styles.mediumCircle,
            { transform: [{ rotate: styleMediumCircle }] },
          ]}
        ></Animated.View>
        <Animated.View
          style={[
            styles.circles,
            styles.smallCircle,
            { transform: [{ rotate: styleSmallCircle }] },
          ]}
        ></Animated.View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    width,
    backgroundColor: "rgba(0,0,0,.2)",
    zIndex: 9999,
    elevation: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  containerCircles: {
    width: 200,
    height: 200,
    position: "relative",
  },
  circles: {
    position: "absolute",
    borderStyle: "solid",
    borderWidth: 10,
  },
  bigCircle: {
    height: 150,
    width: 150,
    borderLeftColor: "rgba(0,0,0,.009)",
    borderTopColor: Colors.green,
    borderBottomColor: "rgba(0,0,0,.009)",
    borderRightColor: Colors.green,
    top: 100 - 75,
    left: 100 - 75,
    borderRadius: 75,
  },
  mediumCircle: {
    height: 130,
    width: 130,
    borderLeftColor: "rgba(0,0,0,.009)",
    borderTopColor: "rgba(0,0,0,.009)",
    borderBottomColor: Colors.blackBackground,
    borderRightColor: Colors.blackBackground,
    top: 100 - 65,
    left: 100 - 65,
    borderRadius: 65,
  },
  smallCircle: {
    height: 110,
    width: 110,
    borderLeftColor: Colors.white,
    borderTopColor: Colors.white,
    borderBottomColor: "rgba(0,0,0,.009)",
    borderRightColor: "rgba(0,0,0,.009)",
    top: 100 - 55,
    left: 100 - 55,
    borderRadius: 55,
  },
});

export default Loading;
