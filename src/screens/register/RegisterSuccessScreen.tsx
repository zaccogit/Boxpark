import React, { useContext, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button } from '../../components';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { RenderContext } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const RegisterSuccessScreen = ({ navigation }: Props) => {
  const { language } = useContext(RenderContext);
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]);
  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <Text style={[styles.title]}></Text>
        <Text style={[styles.title]}>{Languages[language].SCREENS.RegisterSuccessScreen.text}</Text>
        <View>
          <SVG.CheckAnimateSVG />
        </View>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button
            text={Languages[language].SCREENS.RegisterSuccessScreen.textSubmit}
            onPress={() => {
              navigation.push('Login');
            }}
            styleText={{ fontSize: 20 }}
            white
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: Fonts.Dosis,
    fontSize: 32,
    marginVertical: 15,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  slideshow: {
    width: width * 0.9,
    
  },
});
export default RegisterSuccessScreen;
