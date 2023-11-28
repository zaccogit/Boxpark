import { ViewStyle, ImageStyle } from "react-native";

export interface Props {
  name?: string;
  styleButton?: ViewStyle | ViewStyle[];
  showIcon?: boolean;
  icon?: any;
  styleIcon?: ImageStyle;
  onPress?: () => void;
}
