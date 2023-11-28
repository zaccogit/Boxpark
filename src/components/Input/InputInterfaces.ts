import { ViewStyle, ImageStyle, KeyboardTypeOptions } from "react-native";

export interface Props {
  styleContainer?: ViewStyle | ViewStyle[];
  secureTextEntry?: boolean;
  styleInput?: ViewStyle | ViewStyle[];
  placeholder?: string;
  placeholderColor?: string;
  styleIcons?: ImageStyle;
  onChangeText?: (e: string) => void;
  value?: string;
  maxLength?: number;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
  displaySymbol?: string;
  multiline?: boolean;
  numberOfLines?: number;
}
