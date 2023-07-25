import Toast, { BaseToast } from "react-native-toast-message";
import { Colors } from "../utils";

const ToastNotification = () => {
  const toastConfig = {
    /*
          Overwrite 'success' type,
          by modifying the existing `BaseToast` component
        */
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors.green, height: "auto" }}
        contentContainerStyle={{ padding: 15 }}
        text1Style={{
          fontSize: 20,
          fontFamily: "Dosis",
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "Dosis",
        }}
        text2NumberOfLines={10}
      />
    ),

    error: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors.danger, height: "auto" }}
        contentContainerStyle={{ padding: 15 }}
        text1Style={{
          fontSize: 20,
          fontFamily: "Dosis",
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "Dosis",
        }}
        text2NumberOfLines={10}
      />
    ),

    warning: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors.yellow, height: "auto" }}
        contentContainerStyle={{ padding: 15 }}
        text1Style={{
          fontSize: 20,
          fontFamily: "Dosis",
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "Dosis",
        }}
        text2NumberOfLines={10}
      />
    ),
  };
  return (
    <>
      <Toast config={toastConfig} />
    </>
  );
};

export default ToastNotification;
