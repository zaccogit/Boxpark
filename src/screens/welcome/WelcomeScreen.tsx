import { useContext, useEffect, useRef, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import { RenderContext } from "../../contexts";
import {
  SlideItem,
  ScreenContainer,
  Button,
} from "../../components";
import { Colors } from "../../utils";
import { Images, SVG } from "../../../assets";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";

interface Props extends StackScreenProps<any, any> {}

interface Data {
  image: ReactNode;
  id: string;
  text: string;
}
const width: number = Dimensions.get("window").width;
const height: number = Dimensions.get("window").height;

const WelcomeScreen = ({ navigation }: Props) => {
  const { setFirstTime } = useContext(RenderContext);
  var currentIndexRef: number = useRef(0).current;
  const slideRef: any = useRef(null);
  const data: Data[] = [
    {
      id: "1",
      image: <SVG.Frame1/>,
      text: "El mejor punto de ventas.",
    },
    {
      id: "2",
      image:<SVG.Frame2/>,
      text: "Todos los cobros desde un mismo lugar.",
    },
    {
      id: "3",
      image: <SVG.Frame3/>,
      text: "Procesa pago sin intermediarios.",
    },
  ];

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
      <View
        style={{
          top: Platform.OS === "ios" ? 70 : 25,
          width: "100%",
        }}
      >
        <Text style={styles.title}>Bienvenidos a BoxParkApp</Text>
      </View>
      <Swiper height={ height * 0.7} pagingEnabled autoplay >
        {data.map(item => (<SlideItem key={item.id} image={item.image} text={item.text} />))}
      </Swiper>
      
      <View>
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
