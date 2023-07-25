
import { StackScreenProps } from '@react-navigation/stack';
export interface Props extends StackScreenProps<any, any> {
    showBackButtom?: boolean;
    showPlusButtom?: boolean;
    title?: string;
    action?: () => void;
}