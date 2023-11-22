import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Screens } from "./src/screens";
import { useContext, useEffect } from "react";
import { AccountsContext, SesionContext } from "./src/contexts";
import { Button } from "react-native";
import { Image } from "expo-image";
import { Icons } from "./assets";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "./src/utils";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { sesion } = useContext(SesionContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
      initialRouteName="Init"
    >
      <Stack.Screen name="Init" component={Screens.InitScreen} />
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      {/* auth */}
      <Stack.Screen name="Login" component={Screens.LoginScreen} />
      <Stack.Screen
        name="TrustedDevice"
        component={Screens.TrustedDeviceScreen}
      />

      {/* Register */}
      <Stack.Screen name="Nacionality" component={Screens.NacionalityScreen} />
      <Stack.Screen name="QRRif" component={Screens.QRRifScreen} />
      <Stack.Screen name="Document" component={Screens.DocumentScreen} />
      <Stack.Screen name="Identity" component={Screens.IdentityScreen} />
      <Stack.Screen name="Contacts" component={Screens.ContactsScreen} />
      <Stack.Screen
        name="VerifyContacts"
        component={Screens.VerifyContactsScreen}
      />
      <Stack.Screen name="Selfie2Screen" component={Screens.Selfie2Screen} />
      <Stack.Screen name="CreatePassword" component={Screens.PasswordScreen} />
      <Stack.Screen
        name="RegisterSuccess"
        component={Screens.RegisterSuccessScreen}
      />
      {/* Onboarding */}
      <Stack.Screen
        name="RegisterSecurityQuestions"
        component={Screens.RegisterSecurityQuestionsScreen}
      />
      <Stack.Screen name="Onboarding" component={Screens.OnboardingScreen} />
      <Stack.Screen name="Address" component={Screens.AddressScreen} />
      <Stack.Screen
        name="PersonalInfo"
        component={Screens.PersonalInfoScreen}
      />
      <Stack.Screen
        name="CollectionsTypes"
        component={Screens.CollectionsTypesScreen}
      />
      <Stack.Screen name="DNII" component={Screens.DNIIScreen} />
      <Stack.Screen name="DNI" component={Screens.DNIScreen} />
      <Stack.Screen name="Selfie" component={Screens.SelfieScreen} />
      <Stack.Screen
        name="OnboardingSuccess"
        component={Screens.OnboardingSuccessScreen}
      />
      {/* RecoverPassword */}
      <Stack.Screen
        name="ResetPassword"
        component={Screens.ResetPasswordScreen}
      />
      <Stack.Screen name="VerifyToken" component={Screens.VerifyTokenScreen} />
      <Stack.Screen
        name="SecurityQuestions"
        component={Screens.SecurityQuestionsScreen}
      />
      <Stack.Screen
        name="ChangePassword"
        component={Screens.ChangePasswordScreen}
      />
      <Stack.Screen
        name="ResetPassSuccess"
        component={Screens.ResetPassSuccessScreen}
      />

      {sesion && (
        <Stack.Group>
          {/* Consolidate */}
          <Stack.Screen name="Dashboard" component={BottomTab} />

          <Stack.Screen name="Profile" component={Screens.ProfileScreen} />
          <Stack.Screen
            name="Transaction"
            component={Screens.TransactionScreen}
          />
          <Stack.Screen name="Refered" component={Screens.ReferedScreen} />
          {/* QrPayment */}
          <Stack.Screen name="QrPayment" component={Screens.QRPaymentScreen} />
          <Stack.Screen
            name="QrPaymentForm"
            component={Screens.QrPaymentFormScreen}
          />
          <Stack.Screen
            name="PreQrPayment"
            component={Screens.PreQRPaymenScreen}
          />
          <Stack.Screen
            name="QRPaymentSuccess"
            component={Screens.ReceiptQRPaymentScreen}
          />
          {/* Transfer */}
          <Stack.Screen name="Transfer" component={Screens.TransferScreen} />
          <Stack.Screen
            name="TransferForm"
            component={Screens.TransferFormScreen}
          />
          <Stack.Screen
            name="PreTransfer"
            component={Screens.PreTransferScreen}
          />
          <Stack.Screen
            name="TransferSuccess"
            component={Screens.ReceiptTransferScreen}
          />
          {/* AddAccount */}
          <Stack.Screen
            name="SelectBank"
            component={Screens.SelectBankScreen}
          />
          <Stack.Screen
            name="AddAccount"
            component={Screens.AddAccountScreen}
          />
          <Stack.Screen
            name="AddAccountSuccess"
            component={Screens.AddAccountSuccessScreen}
          />
          {/* Withdrawal */}
          <Stack.Screen
            name="SelectAccountWithdrawal"
            component={Screens.SelectAccountWithdrawalScreen}
          />
          <Stack.Screen
            name="WithdrawalForm"
            component={Screens.WithdrawalFormScreen}
          />
          <Stack.Screen
            name="WithdrawalValidationScreen"
            component={Screens.WithdrawalValidationScreen}
          />
          <Stack.Screen
            name="WithdrawalSuccess"
            component={Screens.WithdrawalSuccess}
          />
          {/* Recharge */}
          <Stack.Screen
            name="RechargeMethods"
            component={Screens.RechargeMethodScreen}
          />
          <Stack.Screen
            name="RechargeMobilePayment"
            component={Screens.RechargeMobilePaymentScreen}
          />
          <Stack.Screen
            name="RechargeButtonPayment"
            component={Screens.RechargeButtonPaymentScreen}
          />
          <Stack.Screen name="AllCards" component={Screens.AllCardScreen} />
          <Stack.Screen name="CardInfo" component={Screens.CardInfoScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Screens.DashboardScreen}
        options={{
          tabBarActiveTintColor: Colors.blackBackground,
          headerShown: false,
          headerShadowVisible: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Screens.TransactionScreen}
        options={{
          title: "Configuración",
          tabBarActiveTintColor: Colors.green,
          headerStyle: {
            backgroundColor: Colors.green,
          },
          headerTintColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Ionicons name="swap-horizontal" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Screens.OptionsScreen}
        options={{
          title: "Perfil",
          tabBarActiveTintColor: Colors.green,
          headerStyle: {
            backgroundColor: Colors.green,
          },
          headerTintColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default StackNavigator;
