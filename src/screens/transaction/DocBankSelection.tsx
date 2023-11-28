import { useState, useContext, useEffect, useCallback } from "react";
import { ScreenContainer, Input, Button, Select } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { HttpService } from "../../services";
import { RenderContext, AuthContext, EndPointsInterface } from "../../contexts";
import Languages from "../../utils/Languages.json";
import { StackScreenProps } from "@react-navigation/stack";
import { ToastCall, GetHeader } from "../../utils/GeneralMethods";
import Env from "../../../enviroments.json";
import { Method } from "../auth/LoginScreen";
import useTransactionsState from "../../contexts/transactions/TransactionsState";

interface Props extends StackScreenProps<any, any> {}

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
const initialState = {
  rifNumber: "",
  codeBank: "",
};
interface ItemSelect {
  label: string;
  value: number | string;
}

export interface Response {
  codeResponse: string;
  message: string;
  error: string;
}

const width: number = Dimensions.get("window").width;

function DocBankSelection({ navigation }: Props) {
  const { language, setLoader } = useContext(RenderContext);
  const { endPoints, tokenBP, tokenTransaction } = useContext(AuthContext);
  const { ProcessPaymentScanningRequest, setProcessPaymentScanningRequest } =
    useTransactionsState();
  const [Bank, setBank] = useState<ItemSelect[]>([]);
  const [credentials, setCredentials] = useState<tokenBankReq>(initialState);

  const getBanks = async () => {
    try {
      const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API"
      )?.vale as string;
      const url: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_URL"
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_METHOD"
      )?.vale as Method;
      const headers = GetHeader(tokenTransaction, "application/json");
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

  const Submit = async () => {
    try {
      const host: string = Env.HOST_TRANSACTION;
      const url: string = "/api/credit-cards/tokenBank";
      const method: Method = "post";
      const headers = GetHeader(tokenBP, "application/json");
      let req = credentials;
      req.rifNumber = "V" + req.rifNumber.trim().toLowerCase();
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
      });
      navigation.navigate("ScanQRCliente");
    } catch (err) {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.RequestError,
        language
      );
    }
  };

  const change = useCallback(
    (value: string | number, key: string | number) => {
      setCredentials({
        ...credentials,
        [key]: value,
      });
    },
    [credentials]
  );
  const change2 = useCallback(
    (value: string | number, key: string | number) => {
      setProcessPaymentScanningRequest({
        ...ProcessPaymentScanningRequest,
        [key]: value,
      });
    },
    [credentials]
  );

  const disabled = useCallback(() => {
    const { codeBank, rifNumber } = credentials;
    return (
      !codeBank.length &&
      rifNumber.length >= 8 &&
      !ProcessPaymentScanningRequest.amount.length
    );
  }, [credentials]);

  useEffect(() => {
    getBanks();
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container} className=" h-full relative">
        <View className="flex-grow justify-center">
          <Text style={[styles.text, styles.title]} className="text-center">
            {"Cedula y Banco"}
          </Text>
          <View style={[styles.containerWidth, { marginTop: 20 }]}>
            <Text style={styles.text}>{"Cedula"}</Text>
            <Input
              placeholder={"0000000"}
              value={credentials.rifNumber}
              onChangeText={(e: string) => {
                change(e, "rifNumber");
              }}
              maxLength={20}
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{"Banco"}</Text>
            <Select
              items={Bank}
              setState={change}
              name={"codeBank"}
              value={credentials.codeBank}
            />
          </View>
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{"Monto a cobrar"}</Text>
            <Input
              placeholder={"0.00"}
              value={ProcessPaymentScanningRequest.amount}
              onChangeText={(e: string) => {
                change2(e, "amount");
              }}
              maxLength={20}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Button
          className=" absolute bottom-0"
          text={"Siguente"}
          onPress={() => {
            Submit();
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
    fontSize: 16,
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

export default DocBankSelection;
