import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Platform,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { Button } from "..";
import { Colors } from "../../utils";
import { Icons, Fonts } from "../../../assets";
import { SesionContext } from "../../contexts";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { AntDesign } from '@expo/vector-icons';

interface Props {
  items?: Items[];
  lengthText?: number;
  value: string | number;
  style?: ViewStyle;
  styleText?: TextStyle;
  styleIcons?: ImageStyle;
  name: string;
  setState: (e: string | number, l: string | number) => void;
}

interface Items {
  value: string | number;
  label: string;
}

const Select = ({
  items,
  lengthText,
  value,
  setState,
  style,
  styleText,
  styleIcons,
  name,
}: Props) => {
  const itemsSelect: Items[] = items || [
    { value: "1", label: "Prueba" },
    { value: "2", label: "Prueba2" },
  ];
  const [selected, setSelected] = useState(itemsSelect[0]?.value);
  const [label, setLabel] = useState(itemsSelect[0]?.label);
  const [modal, setModal] = useState(false);
  const stylesComp = styleIcons ? [styles.icon, styleIcons] : [styles.icon];
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  useEffect(() => {
    setLabel(itemsSelect[0]?.label);
  }, [itemsSelect]);

  const getLabel = () => {
    if (value) {
      const newLabel = itemsSelect.find((item) => value === item.value)
        ?.label as string;
      return lengthText
        ? newLabel?.length > lengthText
          ? newLabel?.substring(0, lengthText || 20) + "..."
          : newLabel
        : newLabel;
    } else {
      return lengthText
        ? label?.length > lengthText
          ? label.substring(0, lengthText || 20) + "..."
          : label
        : label;
    }
  };
  const picker = (
    <Picker
      selectedValue={value ? value : selected}
      onValueChange={(item, index) => {
        setLabel(itemsSelect[index].label);
        setSelected(item);
        setState(item, name);
      }}
      itemStyle={[styles.itemSelect, styleText]}
      style={styles.select}
      dropdownIconColor={"rgba(0,0,0,.3)"}
    >
      {itemsSelect.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => {
          sesion && restartTimerSesion();
          Platform.OS === "ios" && setModal(true);
        }}
      >
        <Text style={[styles.text, styleText]}>{getLabel()}</Text>
        <AntDesign name="down" size={20} color="black" style={stylesComp} />
        {Platform.OS === "android" && picker}
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={modal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <>
              {picker}
              <View style={{ width: "20%" }}>
                <Button
                  onPress={() => setModal(false)}
                  text={"Ok"}
                  styleButton={{ marginBottom: 0 }}
                />
              </View>
            </>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: "solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    position: "relative",
  },
  icon: {
    position: "absolute",
    width: 20,
    height: 20,
    tintColor: "rgba(0,0,0,.2)",
    right: 13,
    top: 10,
  },
  text: {
    color: Colors.black,
    fontSize: 16,
    textAlign: "left",
    width: "100%",
    paddingLeft: 8,
    paddingRight: 46,
    fontFamily: "Dosis",
  },
  select: {
    position: Platform.OS === "ios" ? "relative" : "absolute",
    width: "100%",
    height: Platform.OS === "ios" ? 200 : "100%",
    top: 0,
    left: 0,
    color: Colors.black,
    opacity: Platform.OS === "ios" ? 1 : 0,
  },
  itemSelect: {
    color: "black",
    fontFamily: "DosisSemiBold",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Select;
