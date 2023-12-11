import { ReactNode } from "react";
import {ImageSourcePropType} from "react-native"
export interface Props {
    showNextButtom?: boolean;
    ImageCircle?: boolean;
    photo?: ImageSourcePropType | string | ReactNode;
    svgComponent?: JSX.Element;
    children?: any;
    onPress?: () => void;
  }
  