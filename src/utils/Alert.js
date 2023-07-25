import {Alert} from 'react-native';

const AlertError = message => {
  Alert.alert('Error', message, null, null);
  return;
};
const AlertSuccess = (title, message) => {
  Alert.alert(title, message, null, null);
  return;
};

const AlertWarning = (title, message, callback) => {
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
