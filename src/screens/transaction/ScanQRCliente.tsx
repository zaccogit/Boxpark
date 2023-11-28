import { useState, useContext, useCallback, useEffect } from "react";
import { ScreenContainer, Button, QRScanner, Input } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { RenderContext, AuthContext, EndPointsInterface } from "../../contexts";
import Languages from "../../utils/Languages.json";
import { StackScreenProps } from "@react-navigation/stack";
import Env from "../../../enviroments.json";
import { Method } from "../auth/LoginScreen";
import { GetHeader, ToastCall } from "../../utils/GeneralMethods";
import useTransactionsState from "../../contexts/transactions/TransactionsState";
import { HttpService } from "../../services";

interface Props extends StackScreenProps<any, any> {}

const width: number = Dimensions.get("window").width;

export interface Bank {
  id: number;
  name: string;
  abaCode: string;
  swiftCode: string;
  imgsrc: string;
  country: Country;
}

export interface Country {
  id: number;
  name: string;
  shortName: string;
  code: string;
  alternativeName: string;
}

export interface tokenBankReq {
  rifNumber: string;
  codeBank: string;
}
interface ItemSelect {
  label: string;
  value: number | string;
}

export interface Response {
  codeResponse: string;
  message: string;
  error: string;
}

const ScanQRCliente = ({ navigation }: Props) => {
  const { language, setLoader } = useContext(RenderContext);
  const { endPoints, tokenBP, tokenGateway } = useContext(AuthContext);
  const { UserCardData, setUserCardData } = useTransactionsState();
  const { ProcessPaymentScanningRequest, setProcessPaymentScanningRequest } =
    useTransactionsState();
  const [Bank, setBank] = useState<ItemSelect[]>([]);
  const [BankSelect, setBankSelect] = useState<ItemSelect[]>([]);
  const [Amount, setAmount] = useState<string>("");

  const getBanks = async () => {
    try {
      const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API"
      )?.vale.trim()as string;
      const url: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_URL"
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_METHOD"
      )?.vale as Method;
      const headers = GetHeader(tokenGateway, "application/json");
      const response: Bank[] = await HttpService(
        method,
        host,
        url,
        {},
        headers,
        setLoader
      );

      if (!response) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.RequestInformationError,
          language
        );
        return;
      }

      const data = response.map((ele) => {
        return { value: ele.abaCode, label: ` ${ele.name} (${ele.abaCode})` };
      });

      setBank(data);
    } catch (err) {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.GeneralError,
        language
      );
    }
  };

  const onSubmit = async (tokenAuth: string) => {
    try {
      const host: string = Env.HOST_TRANSACTION;
      const url: string = "/api/ukpies/keyValidation/";
      const method: Method = "post";
      const headers = GetHeader(tokenBP, "application/json");
      let req = {
        key: tokenAuth,
      };

      const response = await HttpService(
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
      setUserCardData(response.userCard);
      /* Submit(response.userCard.numberDocument, response.userCard.code_bank); */
      setProcessPaymentScanningRequest({
        ...ProcessPaymentScanningRequest,
        token_bank: "123456",
        amount: Amount,
      });
      navigation.push("ValidationPaymentScreen");
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.RequestError,
        language
      );
    }
  };
  const Submit = async (numberDocument: string, code_bank: string) => {
    try {
      const host: string = Env.HOST_TRANSACTION;
      const url: string = "/api/credit-cards/tokenBank";
      const method: Method = "post";
      const headers = GetHeader(tokenBP, "application/json");
      let req = {
        rifNumber: numberDocument,
        codeBank: code_bank,
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
      setProcessPaymentScanningRequest({
        ...ProcessPaymentScanningRequest,
        token_bank: response.message,
        amount: Amount,
      });
      navigation.push("ValidationPaymentScreen");
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.RequestError,
        language
      );
    }
  };

  const readQR = async (QR?: string) => {
    if (QR) {
      await onSubmit(QR);
    }
  };

  const change2 = useCallback(
    (value: string | number, key: string | number) => {
      setProcessPaymentScanningRequest({
        ...ProcessPaymentScanningRequest,
        [key]: value,
      });
    },
    [ProcessPaymentScanningRequest]
  );

  useEffect(() => {
    console.log(tokenBP, tokenGateway);
    getBanks();
  }, []);

  return (
    <ScreenContainer>
      <View className="flex-grow relative justify-evenly items-center px-4 w-full">
        <Text style={styles.title}>Escanea el còdigo QR del cliente</Text>
        <Text style={styles.text} className="text-center">
          El primer paso para iniciar el pago es escanear el còdigo QR del
          cliente
        </Text>

        <QRScanner setState={readQR} />
        <View style={[styles.containerWidth]}>
          <Text style={styles.text}>{"Monto a cobrar"}</Text>
          <Input
            placeholder={"0.00"}
            value={Amount}
            onChangeText={(e: string) => {
              setAmount(e);
            }}
            maxLength={20}
            keyboardType="number-pad"
          />
        </View>
        <Button
          text={Languages[language].GENERAL.BUTTONS.textBack}
          className=" absolute bottom-0"
          onPress={() => {
            navigation.goBack();
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
  logo: {
    width: 200,
    height: 115,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 18,
  },
  title: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 24,
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

export default ScanQRCliente;
