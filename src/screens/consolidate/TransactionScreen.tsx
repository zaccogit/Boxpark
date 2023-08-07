import React, { useContext, useMemo } from 'react';
import { Text, View, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import { ScreenContainer, Navbar, CardLayout, HeaderDashboard } from '../../components';
import { Colors } from '../../utils';
import { Fonts, Icons, SVG } from '../../../assets';
import { RenderContext } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }

interface Transaction {
  name: string;
  desc: string;
  image?: ImageSourcePropType;
  route: string;
  svgComponent?: JSX.Element;
}

const width: number = Dimensions.get('window').width;

const TransactionScreen = ({ navigation, route }: Props) => {
  const { language } = useContext(RenderContext);

  const transaction: Transaction[] = useMemo(
    () => [
      {
        name: 'Pago a Comercio con QR',
        desc: 'Transferencia a negocios con código QR',
        svgComponent: <SVG.QrCodeIconRounded />,
        route: 'QrPayment',
      },
      {
        name: 'Transferencia',
        desc: 'Transferencia entre usuarios Zacco',
        svgComponent: <SVG.TransferIcon />,
        route: 'Transfer',
      },
      {
        name: 'Agregar cuentas',
        desc: 'Cuentas para el servicio de retiro de fondos',
        svgComponent: <SVG.UserIconRounded />,
        route: 'SelectBank',
      },
      {
        name: 'Retiro de Fondos',
        desc: 'Pago móvil de fondo al banco de tu preferencia',
        svgComponent: <SVG.Withdrawal />,
        route: 'SelectAccountWithdrawal',
      },
      {
        name: 'Recarga por Pago Móvil',
        desc: 'Recarga desde cualquier banco con el servicio de Pago Móvil',
        svgComponent: <SVG.RechargeIcon />,
        route: 'RechargeMobilePayment',
      },
    ],
    [],
  );

  return (
    <>
      <ScreenContainer disabledPaddingBottom>
        {/* <HeaderDashboard navigation={navigation} route={route} /> */}
        <View style={[{ paddingHorizontal: width * 0.05 }]}>
          <Text style={[styles.text, styles.title]}>Transacciones</Text>
          <Text style={[styles.buttonRenderWhite]}>Seleccione un método de envío.</Text>
        </View>
        <View style={[styles.containerTransactions, styles.containerCenter]}>
          {transaction?.map((transaction: Transaction, index: number) => (
            <CardLayout
              photo={transaction?.image}
              svgComponent={transaction.svgComponent}
              onPress={() => {
                navigation.push(transaction.route);
              }}
              key={index}>
              <Text style={[styles.text]}>{transaction.name}</Text>
              <Text style={styles.buttonRenderWhite}>{transaction.desc}</Text>
            </CardLayout>
          ))}
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "DosisMedium",
  },
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    width: 'auto',
    fontFamily: "Dosis",
  },
  containerTransactions: {
    padding: 10,
    backgroundColor: Colors.white,
  },
});

export default TransactionScreen;
