import React, { useContext, useEffect } from 'react';
import { ScreenContainer, Button } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { AccountsContext, SesionContext, RenderContext } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const OnboardingSuccessScreen = ({ navigation }: Props) => {
  const { language } = useContext(RenderContext);
  const { setSesion } = useContext(SesionContext);
  const { setAccounts } = useContext(AccountsContext);
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]);
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.containerForm}>
          <Text style={[styles.text]}>{Languages[language].SCREENS.OnboardingSuccessScreen.title}</Text>
          <SVG.CheckAnimateSVG />
          <Text style={[styles.text, { fontSize: 18, marginTop: 40 }]}>
            {Languages[language].SCREENS.OnboardingSuccessScreen.text1}
          </Text>
        </View>
        <View></View>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button
            styleButton={{ shadowColor: Colors.blackBackground }}
            onPress={() => {
              navigation.push('Login');
              setSesion(null);
              setAccounts([]);
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'column'
  },
  imageContainer: {
    height: height * .25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerForm: {
    width: width * 0.9,
    height: height * .9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * .05,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    marginBottom: 0,
    marginTop: 10,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
  },
  text: {
    color: Colors.blackBackground,
    fontSize: 22,
    textAlign: 'center',
    fontFamily: "DosisBold"
  }
})

export default OnboardingSuccessScreen;
