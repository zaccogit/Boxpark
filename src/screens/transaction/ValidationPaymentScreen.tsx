import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, ScreenContainer } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import useTransactionsState from "../../contexts/transactions/TransactionsState";
import Env from "../../../enviroments.json";
import { AuthContext, RenderContext, SesionContext } from "../../contexts";
import { Method } from "../auth/LoginScreen";
import { GetHeader, ToastCall } from "../../utils/GeneralMethods";
import { HttpService } from "../../services";
import Languages from "../../utils/Languages.json";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../../utils";
import { Image } from "expo-image";
import { Images } from "../../../assets";
import AuthTokenTransacction from "../../components/AuthTokenTransacction/AuthTokenTransacction";

interface Props extends StackScreenProps<any, any> {}

const width: number = Dimensions.get("window").width;

function ValidationPaymentScreen({ navigation }: Props) {
  const { ProcessPaymentScanningRequest, UserCardData } =
    useTransactionsState();
  const [Modal, setModal] = useState<boolean>(false);
  const { tokenBP, channelTypeId, setChannelTypeId } = useContext(AuthContext);
  const { language, setLoader } = useContext(RenderContext);
  const { sesion } = useContext(SesionContext);
  const disabled = useCallback(() => {
    const { amount } = ProcessPaymentScanningRequest;
    return !amount;
  }, [ProcessPaymentScanningRequest]);

  const onSubmit = useCallback(
    async (tokenAuth: string) => {
      try {
        const host: string = Env.HOST_TRANSACTION;
        const url: string = "/api/transactions/processPaymentScanning";
        const method: Method = "post";
        const headers = GetHeader(tokenBP, "application/json");
        let req = {
          country: "VE",
          reason: "",
          amount: ProcessPaymentScanningRequest.amount,
          loteNumber: sesion?.loteNumber,
          operatorId: sesion?.operatorId,
          virtualPosId: sesion?.virtualPosId,
          posId: sesion?.posId,
          idCard: UserCardData.idCard,
          numberPhone: UserCardData.phone,
          token_bank: ProcessPaymentScanningRequest.token_bank,
        };
        console.log(req);
        const response: Response = await HttpService(
          method,
          host,
          url,
          req,
          headers,
          setLoader
        );
        if (!response) {
          ToastCall(
            "error",
            Languages[language].GENERAL.ERRORS.RequestError,
            language
          );
          return;
        }
        navigation.navigate("SuccesPaymentScreen");
      } catch (err) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.RequestError,
          language
        );
      }
    },
    [ProcessPaymentScanningRequest, sesion, UserCardData, language, tokenBP]
  );
  useEffect(() => {
    if (!channelTypeId) setChannelTypeId(1);
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container} className=" h-full relative">
        <Text style={[styles.text, styles.title]} className="text-center">
          {
            "A continuaciòn, La informaciòn del cliente al que se le esta realizando el cobro. "
          }
        </Text>
        <Image
          source={Images.AmountScreen}
          className="w-2/5 h-1/5 rounded-xl my-2"
        />
        <View className=" w-2/4 h-1/4 justify-center">
          <Text style={styles.text}>Nombre : {UserCardData.nameUser}</Text>
          <Text style={styles.text}>
            Monto : {ProcessPaymentScanningRequest.amount}
          </Text>
        </View>

        <AuthTokenTransacction
          isActive={Modal}
          setIsActive={setModal}
          onSubmit={onSubmit}
        />

        <Button
          className=" absolute bottom-0"
          text={"Siguente"}
          onPress={() => {
            setModal(true);
          }}
          disabled={disabled()}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    width,
  },
  logo: {
    width: 200,
    height: 115,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  containerRow: {
    flexDirection: "row",
  },
  containerWidth: {
    width: "100%",
  },
  buttonRender: {
    width: "auto",
    paddingHorizontal: 20,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
  },
  line: {
    width: "40%",
    height: 0,
    borderBottomWidth: 1,
  },
  circle: {
    width: 8,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
  },
  colorFormat: {
    borderStyle: "solid",
    borderColor: "#898989",
  },
  containerButtons: {
    justifyContent: "center",
  },
});

export default ValidationPaymentScreen;
