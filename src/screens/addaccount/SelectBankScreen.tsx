import React, {useReducer, useEffect, useState, useContext, useCallback, useMemo} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {ScreenContainer, Input, Header, CardLayout} from '../../components';
import {AuthContext, RenderContext, SesionContext, EndPointsInterface} from '../../contexts';
import {Colors} from '../../utils';
import {Fonts} from '../../../assets';
import {HttpService} from '../../services';
import Languages from '../../utils/Languages.json';
import {StackScreenProps} from '@react-navigation/stack';

import {GetHeader, ToastCall} from '../../utils/GeneralMethods';
import { Bank } from '../transaction/DocBankSelection';

interface Props extends StackScreenProps<any, any> {}

interface BankState {
  banks: Bank[];
  search: string;
}

type Method = "get" | "post" | "put" | "delete"

type BankActions = {type: 'setBank'; payload: Bank[]} | {type: 'setSearch'; payload: string};

const width: number = Dimensions.get('window').width;

const reducer = (state: BankState, action: BankActions): any => {
  const {payload, type} = action;
  switch (type) {
    case 'setBank':
      return {...state, banks: payload};
    case 'setSearch':
      return {...state, search: payload};

    default:
      break;
  }
};

const initialize: BankState = {
  banks: [] as Bank[],
  search: '',
};

const SelectBankScreen = ({navigation, route}: Props) => {
  const {tokenTransaction, endPoints} = useContext(AuthContext);
  const {setLoader, language} = useContext(RenderContext);
  const [{banks, search}, dispatch] = useReducer(reducer, initialize);
  const BankFitrered = useMemo(
    () => banks.filter((b: Bank) => b.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [banks, search],
  );

  const changeInputs = useCallback((value: string) => {
    dispatch({
      type: 'setSearch',
      payload: value,
    });
  }, []);
  const getBanks = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_BANKS_METHOD")?.vale as Method
      const headers = GetHeader(tokenTransaction, 'application/json');
      const response: Bank[] = await HttpService(method, host, url, {}, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
        return;
      }

      dispatch({
        type: 'setBank',
        payload: response,
      });
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  useEffect(() => {
    getBanks();
  }, []);
  return (
    <>
      <Header
        title={Languages[language].SCREENS.AddAccountScreen.Header}
        showBackButtom
        navigation={navigation}
        route={route}
      />
      <View style={{paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white'}}>
        {/* TODO cambiar esto a multidioma */}
        <Text style={[styles.text, styles.title]}>Seleccione el banco</Text>
        <Input styleContainer={{marginVertical: 8}} value={search} onChangeText={(e: string) => changeInputs(e)} />
      </View>
      <ScreenContainer disabledPaddingTop onRefresh={getBanks}>
        <View style={[styles.containerTransactions, styles.containerCenter]}>
          {BankFitrered?.map((bank: Bank, index: number) => (
            <CardLayout
              photo={{uri: bank.imgsrc?.trim()}}
              key={bank.id}
              ImageCircle
              onPress={() => navigation.push('AddAccount', {bank})}>
              <Text style={[styles.text]}>{bank.name}</Text>
              <Text style={styles.buttonRenderWhite}>{bank.abaCode}</Text>
            </CardLayout>
          ))}
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "DosisMedium",
  },
  containerTransactions: {
    padding: 10,
    backgroundColor: Colors.white,
  },
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: width * 0.05,
    position: 'relative',
    minHeight: width * 0.7,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
    marginVertical: 0,
    marginBottom: 30,
  },
  titles: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisBold",
    textAlign: 'center',
  },
  logo: {
    height: width * 0.3,
    width: width * 0.6,
    marginHorizontal: width * 0.2,
  },
  textTitle: {
    fontSize: 26,
    fontFamily: "DosisBold",
    color: Colors.blackBackground,
    textAlign: 'center',
    marginVertical: 10,
  },
  textSubTitle: {
    fontSize: 20,
    fontFamily: "DosisBold",
    color: Colors.blackBackground,
    marginVertical: 15,
  },
  containerButtons: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.blackBackground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "DosisBold",
    fontSize: 18,
  },
  textReSend: {
    color: Colors.green,
    fontFamily: "DosisBold",
    fontSize: 20,
  },
  containerCheck: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  cancelButtonModal: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.danger,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 20,
    textAlign: 'left',
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    width: 'auto',
    fontFamily: "Dosis",
  },
});

export default SelectBankScreen;
