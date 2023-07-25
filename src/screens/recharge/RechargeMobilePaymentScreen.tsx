import React, { useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenContainer, Header, Button } from '../../components';
import { SesionContext } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { StackScreenProps } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const RechargeMobilePaymentScreen = ({ navigation, route }: Props) => {
    const { sesion, restartTimerSesion } = useContext(SesionContext)
    
    const copyToClipboard = (text: string, type: boolean) => {
        restartTimerSesion()
        Clipboard.setString(text);
        ToastCall("success",`¡${type?"La cédula de identidad":"El número de teléfono"} se copió de manera exitosa!`, "ES")
    };
    return (
        <>
            <Header title={'Recarga por Pago Móvil'} showBackButtom navigation={navigation} route={route} />
            <ScreenContainer disabledPaddingTop>
                <View style={styles.container}>
                    <View style={styles.containerWidth}>
                        <Text style={[styles.title]}>
                            {`Para recargar tu cuenta realiza un pago móvil desde el banco de tu preferencia haciendo uso de estos datos.\n\n`}
                            Ingresa tu cédula de identidad al realizar la transacción junto con el número telefónico que se muestra a continuación.
                        </Text>
                        <View style={[styles.containerCenter, styles.containerText]}>
                            <Text style={styles.text}>{sesion?.typeCondition}{sesion?.documentId}</Text>
                            <TouchableOpacity
                                onPress={() => { copyToClipboard(`${sesion?.documentId}`, true) }}
                                style={[styles.containerIcon, styles.containerCenter]}
                            >
                                <SVG.ClipboardIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.containerCenter, styles.containerText]}>
                            <Text style={styles.text}>04129757892</Text>
                            <TouchableOpacity
                                onPress={() => { copyToClipboard("04129757892", false) }}
                                style={[styles.containerIcon, styles.containerCenter]}
                            >
                                <SVG.ClipboardIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.containerCenter, styles.containerText]}>
                            <Text style={styles.text}>Mi Banco, Banco Microfinanciero</Text>
                        </View>
                    </View>
                    <View style={styles.containerWidth}>
                        <Text style={[styles.title]}>
                            Una vez hallas realizado el pago móvil, este se te acreditará automaticamente en tu cuenta zacco.
                        </Text>
                        <View style={styles.containerWidth}>
                            <Button
                                text={"Volver al dashboard"}
                                onPress={() => {
                                    navigation.replace("Dashboard")
                                }}
                            />
                        </View>
                    </View>
                </View>
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        width,
        justifyContent: 'space-between',
        flexGrow: 1,
    },
    containerText: {
        height: 40,
        backgroundColor: Colors.gray,
        borderColor: Colors.blackBackground,
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'solid',
        marginVertical: 10,
        paddingHorizontal: 8,
        position: "relative"
    },
    text: {
        color: Colors.black,
        fontFamily: Fonts.DosisSemiBold,
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        marginVertical: 20,
        fontFamily: Fonts.Dosis,
        color: Colors.black,
        textAlign: "center"
    },
    containerRow: {
        flexDirection: 'row',
    },
    containerCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerWidth: {
        width: '100%',
    },
    containerIcon: {
        position: "absolute",
        width: 38,
        height: 38,
        top: 0,
        right: 5,
    },
    containerButton: {
        width,
        paddingHorizontal: width * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});


export default RechargeMobilePaymentScreen;