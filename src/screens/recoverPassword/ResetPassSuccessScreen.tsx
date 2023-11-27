import React, { useContext, useEffect } from 'react';
import { ScreenContainer, Button } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { RenderContext } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const ResetPassSuccessScreen = ({ navigation }: Props) => {
  const { language } = useContext(RenderContext);
  /* useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]); */
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <SVG.CheckAnimateSVG />
        </View>

        <View style={styles.containerForm}>
          <Text
            style={{
              color: Colors.blackBackground,
              fontSize: 26,
              textAlign: 'center',
              fontFamily: "DosisExtraBold",
            }}>
            {Languages[language].SCREENS.ResetPassSuccessScreen.title}
          </Text>
        </View>
        <View style={{ width: width * 0.3, alignItems: 'center' }}>
          <Button styleText={{ fontSize: 16 }} onPress={() => navigation.push('Login')} />
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
    flexDirection: 'column',
  },
  imageContainer: {
    height: height * 0.25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    width: width * 0.9,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
});

export default ResetPassSuccessScreen;
