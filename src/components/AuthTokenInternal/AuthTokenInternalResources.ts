import {StyleSheet} from "react-native"
import { Fonts } from '../../../assets';
import { Colors } from '../../utils';
export const styles = StyleSheet.create({
    textSubTitle: {
      fontSize: 20,
      fontFamily: "DosisMedium",
      color: Colors.blackBackground,
      marginVertical: 15,
    },
    containerCheck: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
    },
    containerWidth: {
      width: '100%',
    },
    text: {
      color: Colors.black,
      fontFamily: "DosisMedium",
      fontSize: 20,
      textAlign: 'center',
    },
  });