import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Colors } from "../../utils";
import { Icons, Fonts } from "../../../assets";
import { RenderContext } from "../../contexts";
import { ToastCall } from "../../utils/GeneralMethods";
interface Props {
  setState?: (e: string | undefined) => void;
}

const width: number = Dimensions.get("window").width;

const QRScanner = ({ setState }: Props) => {
  const { language } = useContext(RenderContext);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    setScanned(true);
    if (setState) setState(data);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setScanned(false);
      }}
    >
      <View style={scanned ? styles.scanner : styles.scanner2}>
        {hasPermission && (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            {scanned && (
              <View
                style={[
                  scanned ? styles.scanner : styles.scanner2,
                  { backgroundColor: Colors.white },
                ]}
              >
                <Image
                  source={Icons.TouchID}
                  style={styles.icon}
                  resizeMode="cover"
                />
                <Text style={styles.text}>
                  {language === "ES" ? "¡Presiona aquí!" : "¡Touch here!"}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
      <View
        style={{
          position: "absolute",
          width: 12,
          height: "75%",
          left: -10,
          top: "15%",
          backgroundColor: Colors.white,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: "75%",
          height: 12,
          left: "15%",
          top: -10,
          backgroundColor: Colors.white,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: "110%",
          height: 12,
          left: "0%",
          bottom: -5,
          backgroundColor: Colors.white,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 12,
          height: "75%",
          right: -10,
          top: "15%",
          backgroundColor: Colors.white,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 8,
    borderColor: Colors.blackBackground,
    borderRadius: 20,
    position: "relative",
    width: width * 0.7,
    height: width * 0.7,
    marginVertical: 10,
    overflow: "hidden",
  },
  scanner: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanner2: {
    width: "100%",
    height: "170%",
    overflow: "hidden",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "40%",
    height: "40%",
  },
  text: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: "DosisSemiBold",
  },
});
export default QRScanner;
