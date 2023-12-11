import { StyleSheet } from 'react-native';
import { Colors } from '../../utils';
export const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blackBackground,
    borderRadius: 50,
    shadowColor: Colors.blackBackground,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.90,
    shadowRadius: 0,
    elevation: 16,
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: Colors.blackBackground
  },
  buttonCancel: {
    backgroundColor: Colors.white
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
    shadowColor: Colors.transparent,
    borderColor: Colors.transparent
  },
  buttonGhost: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    backgroundColor: Colors.transparent
  },
  icon: {
    tintColor: Colors.white,
    marginRight: 8,
    width: 30,
    height: 30
  },
  text: {
    fontSize: 14,
    fontFamily: 'Regular'
  }
});
