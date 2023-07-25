import {
  ViewStyle,
  TextStyle,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";

export interface Props {
  white?: boolean;
  disabled?: boolean;
  styleButton?: ViewStyle | ViewStyle[];
  showIcon?: boolean;
  icon?: ImageSourcePropType;
  styleIcon?: ImageStyle;
  styleText?: TextStyle | TextStyle[];
  text?: string;
  className?: string;
  onPress?: () => void;
}
