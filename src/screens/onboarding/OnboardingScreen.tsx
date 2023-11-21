import React, {useContext} from 'react';
import {ScreenContainer, Button} from '../../components';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../utils';
import { Fonts, SVG} from '../../../assets';
import Languages from '../../utils/Languages.json';
import {RenderContext} from '../../contexts';
import {StackScreenProps} from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> {}

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const OnboardingScreen = ({navigation}: Props) => {
  const {language} = useContext(RenderContext);
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.containerForm}>
          <Text
            style={{
              color: Colors.blackBackground,
              fontSize: 32,
              textAlign: 'center',
              fontFamily: "DosisMedium",
            }}>
            {Languages[language].SCREENS.OnboardingScreen.title}
          </Text>
        </View>
        <View style={{flexGrow: 1, justifyContent: 'center', padding: 20}}>
          <SVG.OnbordingFaceSVG />
        </View>
        <View style={{width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{width: width * 0.5, alignItems: 'center'}}>
            <Button
              styleText={{fontSize: 24}}
              text={Languages[language].SCREENS.VerifyContactsScreen.textSubmit3}
              onPress={() => navigation.replace('Address')}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: width * 0.7,
    flex:1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  cancelButton: {
    backgroundColor: Colors.transparent,
    marginBottom: 0,
    marginTop: 10,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export default OnboardingScreen;
