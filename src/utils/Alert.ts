import {Alert} from 'react-native';

const AlertError = (message:string) => {
  Alert.alert('Error', message, undefined, undefined);
  return;
};
const AlertSuccess = ({title, message}:{title:string, message:string}) => {
  Alert.alert(title, message, undefined, undefined);
  return;
};

const AlertWarning = ({title, message, callback}:{title:string, message:string,callback:() => void}) => {
  Alert.alert(title, message, [
    {
      text: 'Cancelar',
    },
    {
      text: 'Aceptar',
      onPress: () => {
        callback();
      },
    },
  ]);
  return;
};

module.exports = {
  AlertError,
  AlertWarning,
  AlertSuccess,
};
