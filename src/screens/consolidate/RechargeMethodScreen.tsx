import React, { useContext } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer, Navbar, Header, CardLayout } from '../../components';
import { SVG } from '../../../assets';
import { RenderContext } from '../../contexts';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }


interface Method {
  name: string,
  route: string,
  svgComponent?: JSX.Element;
}
const Methods: Method[] = [
  {
    name: "Recarga por pago móvil",
    route: "RechargeMobilePayment",
    svgComponent: <SVG.RechargeIcon />,
  },
  {
    name: "Recarga por TDD/TDC Nacional",
    route: "RechargeButtonPayment",
    svgComponent: <SVG.RechargeIcon />,
  },
  {
    name: "Mis tarjetas",
    route: "AllCards",
    svgComponent: <SVG.Withdrawal />,
  },
]

const RechargeMethodScreen = ({ navigation, route }: Props) => {
  const { language } = useContext(RenderContext);

  return (
    <>
      <Header showBackButtom title={"Métodos de recarga"} navigation={navigation} route={route} />
      <ScreenContainer disabledPaddingTop>
        {
          Methods?.map((method: Method) => (
            <CardLayout
              svgComponent={method.svgComponent}
              key={method.name}
              onPress={() => navigation.push(method.route)}>
              <Text style={[styles.text]}>{method.name}</Text>
            </CardLayout>
          ))
        }
      </ScreenContainer>
      <Navbar navigation={navigation} route={route} />
    </>
  );
};
const styles = StyleSheet.create({
  text: {

  },
})


export default RechargeMethodScreen;