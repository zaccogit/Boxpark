import {
  Modal as ModalComponent,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import Button from "../Button/Button";
import { Colors } from "../../utils";

interface Props {
  active: boolean;
  children?: any;
  onClose?: () => void;
  onSubmit?: () => void;
  disabledButton?: boolean;
  disableCloseButton?: boolean;
}

const Modal = ({
  active,
  onClose,
  onSubmit,
  disabledButton,
  children,
  disableCloseButton,
}: Props) => {
  return (
    <ModalComponent animationType="fade" transparent visible={active}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
          {!disableCloseButton && (
            <TouchableOpacity
              style={styles.cancelButtonModal}
              onPress={() => {
                onClose && onClose();
              }}
            >
              <Text
                style={{
                  fontFamily: "DosisExtraBold",
                  fontSize: 24,
                  color: Colors.white,
                }}
              >
                X
              </Text>
            </TouchableOpacity>
          )}
          <View style={{ width: "30%", position: "absolute", bottom: 30 }}>
            <Button
              onPress={() => {
                onSubmit ? onSubmit() : null;
              }}
              text={"Ok"}
              styleButton={{ marginBottom: 0 }}
              disabled={disabledButton}
            />
          </View>
        </View>
      </View>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.5)",
  },
  modalView: {
    width: "90%",
    minHeight: 150,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 90,
    alignItems: "center",
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  cancelButtonModal: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.danger,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
  },
});

export default Modal;
