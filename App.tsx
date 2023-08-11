/// <reference types="nativewind/types" />
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StackNavigator from "./StackNavigator";
import AppMultiContext from "./AppMultiContext";
import {
  RenderState,
  SesionState,
  AuthState,
  RegisterState,
  AccountsState,
  RecoverPasswordState,
} from "./src/contexts";
import { Loading } from "./src/components";
import ToastNotification from "./src/components/ToastNotification";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { useCallback, useEffect } from "react";
import { TransactionsStateProvider } from "./src/contexts/transactions/TransactionsState";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Dosis: require("./assets/fonts/Nexa-Regular.otf"),
    DosisLight: require("./assets/fonts/Nexa-Light.otf"),
    DosisExtraLight: require("./assets/fonts/Nexa-ExtraLight.otf"),
    DosisMedium: require("./assets/fonts/Nexa-Medium.otf"),
    DosisSemiBold: require("./assets/fonts/Nexa-SemiBold.otf"),
    DosisBold: require("./assets/fonts/Nexa-Bold.otf"),
    DosisExtraBold: require("./assets/fonts/Nexa-ExtraBold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const ContextProviders = [
    <RenderState />,
    <AuthState />,
    <RegisterState />,
    <RecoverPasswordState />,
    <SesionState />,
    <AccountsState />,
    <TransactionsStateProvider />,
  ];

  return (
    <View onLayout={onLayoutRootView} className="flex-grow">
      <AppMultiContext providers={ContextProviders}>
        <SafeAreaProvider>
          <Loading />
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
          <ToastNotification />
        </SafeAreaProvider>
      </AppMultiContext>
    </View>
  );
}
