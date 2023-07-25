import { useContext, useEffect, useRef, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Animated,
  View,
  FlatList,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import { RenderContext } from "../../contexts";
import {
  SlideItem,
  Paginator,
  ScreenContainer,
  Button,
} from "../../components";
import { Colors } from "../../utils";
import { Images, SVG } from "../../../assets";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "expo-image";

interface Props extends StackScreenProps<any, any> {}

interface Data {
  image: ReactNode;
  id: string;
  text: string;
}
const width: number = Dimensions.get("window").width;

const WelcomeScreen = ({ navigation }: Props) => {
  const { setFirstTime } = useContext(RenderContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  var currentIndexRef: number = useRef(0).current;
  const slideRef: any = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;
  const data: Data[] = [
    {
      id: "1",
      image: (
        <Image
          source={Images.PosPhone}
          contentFit="fill"
          style={{ width, height: "50%" }}
        />
      ),
      text: "El mejor punto de ventas.",
    },
    {
      id: "2",
      image: (
        <Image
          source={Images.MobilePaymen}
          contentFit="fill"
          style={{ width, height: "50%" }}
        />
      ),
      text: "Todos los cobros desde un mismo lugar.",
    },
    {
      id: "3",
      image: (
        <Image
          source={Images.Tienda}
          contentFit="fill"
          style={{ width, height: "50%" }}
        />
      ),
      text: "Procesa pago sin intermediarios.",
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
    currentIndexRef = viewableItems[0].index;
  }).current;

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );

  const scrollTo = () => {
    if (currentIndexRef < data.length - 1) {
      slideRef?.current?.scrollToIndex({ index: currentIndexRef + 1 });
    } else if (currentIndexRef === data.length - 1) {
      slideRef?.current?.scrollToIndex({ index: 0 });
    }
  };

  const change = async () => {
    try {
      await AsyncStorage.setItem("firsTime", "true");
      setFirstTime(true);
    } catch (err) {
      setFirstTime(true);
    }
  };

  useEffect(() => {
    setInterval(() => {
      scrollTo();
    }, 3000);
  }, []);
  useEffect(() => {
    change();
  }, []);

  return (
    <ScreenContainer>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled
        bounces={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlideItem image={item.image} text={item.text} />
        )}
        onScroll={onScroll}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slideRef}
        disableScrollViewPanResponder={true}
      />
      <View
        style={{
          position: "absolute",
          top: Platform.OS === "ios" ? 70 : 25,
          width: "100%",
        }}
      >
        <Text style={styles.title}>Bienvenidos a Zacco</Text>
      </View>
      <View className="absolute bottom-1">
        <Paginator items={data} currentIndex={currentIndex} />
        <View style={styles.containerButton}>
          <View style={{ width: "45%", alignItems: "center" }}>
            <Button
              text={"Ir al login"}
              onPress={() => {
                navigation.replace("Login");
              }}
            />
          </View>
          <View style={{ width: "45%", alignItems: "center" }}>
            <Button
              text={"Registrarse"}
              onPress={() => {
                navigation.replace("Nacionality");
              }}
              white={true}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "DosisSemiBold",
    fontSize: 32,
    color: Colors.black,
    textAlign: "center",
  },
  containerButton: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default WelcomeScreen;
