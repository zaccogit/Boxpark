import { Button, ScreenContainer } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import useTransactionsState from "../../contexts/transactions/TransactionsState";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../../utils";
import { SVG } from "../../../assets";
import { useEffect } from "react";

interface Props extends StackScreenProps<any, any> {}

const width: number = Dimensions.get("window").width;

function SuccesPaymentScreen({ navigation }: Props) {
  const {
    ProcessPaymentScanningRequest,
    UserCardData,
    ResetProcessPaymentScanningRequest,
    ResetUserCardData,
  } = useTransactionsState();

  useEffect(() => {
    console.log(ProcessPaymentScanningRequest);
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.container} className=" h-full relative">
        <Text style={[styles.text, styles.title]} className="text-center">
          {"Transaccion Exitosa"}
        </Text>
        <SVG.CheckAnimateSVG />
        <View className=" w-2/4 h-1/4 justify-center">
          <Text style={styles.text}>Nombre : {UserCardData.nameUser}</Text>
          <Text style={styles.text}>
            Monto : {ProcessPaymentScanningRequest.amount}
          </Text>
          <Text style={styles.text}>
            Ref Code : {ProcessPaymentScanningRequest.ref}
          </Text>
        </View>
        <Button
          className=" absolute bottom-0"
          text={"Siguente"}
          onPress={() => {
            ResetProcessPaymentScanningRequest();
            ResetUserCardData();
            navigation.navigate("Dashboard");
          }}
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

export default SuccesPaymentScreen;
