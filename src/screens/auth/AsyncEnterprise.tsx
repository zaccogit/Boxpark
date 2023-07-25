import { useState, useContext, useEffect, useCallback } from "react";
import { ScreenContainer, Button, QRScanner } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { SVG } from "../../../assets";
import { RenderContext, AuthContext } from "../../contexts";
import Languages from "../../utils/Languages.json";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "expo-image";
import AsyncVitualPosModal from "../../components/AsyncVitualPosModal/AsyncVitualPosModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props extends StackScreenProps<any, any> {}

const width: number = Dimensions.get("window").width;

const AsyncEnterprise = ({ navigation }: Props) => {
  const { language, setLoader } = useContext(RenderContext);
  const { tokenTransaction, setChannelTypeId, setVirtualPosId, virtualPosId } =
    useContext(AuthContext);
  const [modal, setModal] = useState<boolean>(false);
  const [QRstate, setQRstate] = useState<string>("");

  const onSubmit = useCallback(async (tokenAuth: string) => {
    await AsyncStorage.setItem("asyncEnterprise", QRstate);
    navigation.push("Login");
  }, []);

  const readQR = async (QR?: string) => {
    if (QR) {
      setVirtualPosId(QR ? Number(QR) : 0);
      setQRstate(QR);
    }
  };
  useEffect(() => {
    setChannelTypeId(1);
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container} className="flex-grow relative">
        <Image source={SVG.LogoAlopos} style={{ width: 250, height: 100 }} />
        <Text style={[styles.text, styles.title]} className=" text-center">
          Bienvenido, En su primer ingreso debe sincronizar su dispositivo con
          el portal de negocio. Para esta operación es necesario que se
          encuentre logueado en nuestro portal y escanea el qr del negocio para
          afiliar un POS.
        </Text>
        <QRScanner setState={readQR} />
        <AsyncVitualPosModal
          isActive={modal}
          setIsActive={setModal}
          onSubmit={onSubmit}
        />
        <Button
          text={Languages[language].GENERAL.BUTTONS.textSubmit}
          disabled={!tokenTransaction && !virtualPosId}
          className=" absolute bottom-2"
          onPress={() => {
            tokenTransaction ? onSubmit("") : setModal(true);
          }}
        />
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    width,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default AsyncEnterprise;
