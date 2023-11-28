import React, {useEffect, useState, useContext, useCallback} from 'react';
import {View, Text, Dimensions, StyleSheet, Image} from 'react-native';
import {ScreenContainer, Select, Button, Input} from '../../components';
import {Colors} from '../../utils';
import {Fonts, Images} from '../../../assets';
import Languages from '../../utils/Languages.json';
import {StackScreenProps} from '@react-navigation/stack';
import {RegisterContext, RenderContext} from '../../contexts';

interface Props extends StackScreenProps<any, any> {}

interface SelectItems {
  value: string;
  label: string;
}

const width: number = Dimensions.get('window').width;

const IdentityScreen = ({navigation}: Props) => {
  const {registerReq, setRegisterReq} = useContext(RegisterContext);
  const {language} = useContext(RenderContext);
  const [identity, setIdentity] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
  });

  const changeInputs = (value: string, key: string) => {
    setIdentity({
      ...identity,
      [key]: value,
    });
  };

  const change = (value: string | number, key: string | number) => {
    setRegisterReq({
      ...registerReq,
      [key]: value,
    });
  };

  const gender: SelectItems[] = [
    {value: 'M', label: Languages[language].SCREENS.IdentityScreen.gender1},
    {value: 'F', label: Languages[language].SCREENS.IdentityScreen.gender2},
    {value: 'O', label: Languages[language].SCREENS.IdentityScreen.gender3},
  ];

  const disable = () => {
    const {firstName, lastName} = identity;
    const {gender} = registerReq;
    return !firstName.length || !lastName.length  || !gender;
  };

  useEffect(() => {
    if (
      identity?.firstName?.length ||
      identity?.secondName?.length ||
      identity?.lastName?.length ||
      identity?.secondLastName?.length
    ) {
      setRegisterReq({
        ...registerReq,
        firstName: `${identity.firstName}/${identity.secondName}`,
        lastName: `${identity.lastName}/${identity.secondLastName}`,
      });
    }
  }, [identity]);

  useEffect(() => {
    if (registerReq?.firstName?.length || registerReq?.lastName?.length) {
      const firstName: string[] | undefined = registerReq?.firstName?.split(' ');
      const lastName: string[] | undefined = registerReq?.lastName?.split(' ');
      setIdentity({
        firstName: firstName ? (firstName?.length >= 1 ? firstName[0] : '') : '',
        secondName: firstName ? (firstName?.length === 2 ? firstName[1] : '') : '',
        lastName: lastName ? (lastName?.length >= 1 ? lastName[0] : '') : '',
        secondLastName: lastName ? (lastName?.length === 2 ? lastName[1] : '') : '',
      });
    }
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Verifica tus datos</Text>
      <View style={styles.contentContainer}>
        <Input
          placeholder={Languages[language].SCREENS.IdentityScreen.placeholder1}
          onChangeText={(e: string) => changeInputs(e, 'firstName')}
          value={identity.firstName}
          maxLength={20}
        />
        <Input
          placeholder={Languages[language].SCREENS.IdentityScreen.placeholder2}
          onChangeText={(e: string) => changeInputs(e, 'secondName')}
          value={identity.secondName}
          maxLength={20}
        />
        <Input
          placeholder={Languages[language].SCREENS.IdentityScreen.placeholder3}
          onChangeText={(e: string) => changeInputs(e, 'lastName')}
          value={identity.lastName}
          maxLength={20}
        />
        <Input
          placeholder={Languages[language].SCREENS.IdentityScreen.placeholder4}
          onChangeText={(e: string) => changeInputs(e, 'secondLastName')}
          value={identity.secondLastName}
          maxLength={20}
        />
        <Select items={gender} name={'gender'} setState={change} value={registerReq.gender} />
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            marginVertical: 30,
          }}>
          <Image source={Images.listCheck} style={styles.image} />
        </View>
        <View
          style={{
            width: width * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 25,
            marginBottom: 20,
          }}>
          <View style={{width: width * 0.3, alignItems: 'center'}}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textBack}
              white
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <View style={{width: width * 0.3, alignItems: 'center'}}>
            <Button
              disabled={disable()}
              onPress={() => {
                navigation.push('Contacts');
              }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: "Dosis",
    fontSize: 28,
    marginVertical: 10,
  },
  subTitle: {
    color: Colors.white,
    fontFamily: "DosisBold",
    fontSize: 18,
    marginTop: 5,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  image: {
    width: 215,
    height: 215,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.white,
    marginHorizontal: width * 0.13,
  },
});

export default IdentityScreen;
