import React, { useEffect, useState, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from "react-native"
import { ScreenContainer, Header, DebitCardWithInfo, CardInterface, Modal } from "../../components"
import { SesionContext, RenderContext, AuthContext, EndPointsInterface } from "../../contexts"
import { Fonts, SVG, Icons } from "../../../assets"
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';
import { HttpService} from '../../services';
import { Colors } from "../../utils"
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { Method } from '../auth/LoginScreen';

interface Props extends StackScreenProps<any, any> { }

interface Request {
    id: number,
    userId: number,
    userCoreId: number,
    token: string,
    tokenSession: string,
    channelTypeId: number
}

interface Response {
    codigoRespuesta: string,
    mensajeRespuesta: string
}

const width: number = Dimensions.get('window').width;

const AllCardScreen = ({ navigation, route }: Props) => {
    const { sesion, restartTimerSesion } = useContext(SesionContext);
    const { setLoader, language } = useContext(RenderContext);
    const { tokenTransaction, tokenGateway, endPoints, channelTypeId, setTokenTransaction, setChannelTypeId } = useContext(AuthContext);
    const [card, setCard] = useState<CardInterface | null>(null)
    const [security, setSecurity] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)

    const deleteCard = useCallback(async () => {
        try {
            const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
            const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DELETE_CARD_CREDICARD")?.vale as string 
            const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DELETE_CARD_CREDICARD_METHOD")?.vale as Method 
            const headers = GetHeader(tokenGateway, "application/json")
            const req: Request = {
                id: card?.id as number,
                userId: sesion?.id as number,
                userCoreId: sesion?.userCoreId as number,
                token: tokenTransaction as string,
                tokenSession: sesion?.token as string,
                channelTypeId
            }
            setModal(false)
            const response: Response = await HttpService(method, host, url, req, headers, setLoader);
            if (!response) {
                ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
                return;
            }
            if (response?.codigoRespuesta === "00") {
                ToastCall("success", "La tarjeta ha sido eliminada correctamente", language);
                navigation.replace("AllCards")
                return
            } else if (response?.codigoRespuesta === "61") {
                ToastCall('error', "ID_CARD_INVALIDA", language);
            } else if (response?.codigoRespuesta === "44") {
                ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorValidateToken, language);
                setTokenTransaction(null)
                setChannelTypeId(0)
                navigation.replace("AllCards")
            } else if (response?.codigoRespuesta === "62") {
                ToastCall('error', "Usuario no registrado (USER_CORE_ID_INVALIDA)", language);
            } else if (response?.codigoRespuesta === "23") {
                ToastCall('error', "Usuario no registrado (USER_ID_NOT_FOUND)", language);
            }
        } catch (err) {
            ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        }
    }, [language, sesion, card])

    useEffect(() => {
        if (route?.params && route?.params?.card) {
            setCard(route?.params?.card)
        } else {
            navigation.goBack()
        }
    }, [route.params])
    const textLine = (text: string, icon?: boolean) => {
        return <View style={[styles.text, { position: "relative" }]}>
            <Text style={styles.text}>{text}</Text>
            {
                icon && (
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => {
                            setSecurity && setSecurity(!security);
                            if (sesion) restartTimerSesion();
                        }}>
                        <Image source={security ? Icons.EyeClose : Icons.EyeOpen} style={styles.icon} />
                    </TouchableOpacity>
                )}
        </View>
    }
    return (
        <>
            <Header
                title={"Tarjetas"}
                showBackButtom
                navigation={navigation}
                route={route}
            />
            <ScreenContainer disabledPaddingTop>
                <View style={[styles.container]}>
                    <Text style={[styles.title]}>Mis Tarjetas</Text>
                    <View style={[styles.containerWidth, styles.containerRow, { justifyContent: "space-between", alignItems: "center" }]}>
                        <DebitCardWithInfo card={card as CardInterface} security={security} />
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setModal(true)
                            restartTimerSesion()
                        }}>
                            <SVG.Trash color={Colors.blackBackground} width={25} height={25} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.subtittle]}>Titular de la tarjeta</Text>
                    {
                        textLine(security ? card?.holder_name as string : '****', true)
                    }
                    <Text style={[styles.subtittle]}>Número de tarjeta</Text>
                    {
                        textLine(security ? card?.card_number as string : '**** **** **** ****')
                    }
                    <View style={[styles.containerWidth, styles.containerRow, { justifyContent: "space-between" }]}>
                        <View style={{ width: "45%" }}>
                            <Text style={[styles.subtittle]}>Fecha de vencimiento</Text>
                            {
                                textLine(security ? `${card?.expiration_month && card?.expiration_month < 10 && "0"}${card?.expiration_month}/${card?.expiration_year}` : '**/**')
                            }
                        </View>
                        <View style={{ width: "45%" }}>
                            <Text style={[styles.subtittle]}>CVC</Text>
                            {
                                textLine(security ? card?.cvc as string : '***')
                            }
                        </View>
                    </View>
                </View>
            </ScreenContainer>
            <Modal
                active={modal}
                onClose={() => {
                    setModal(false)
                    restartTimerSesion()
                }}
                onSubmit={deleteCard}
            >
                <Text style={[styles.title, {textAlign: "center"}]}>¿Estás seguro que deseas eliminar esta tarjeta?</Text>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: width * 0.05,
        width,
    },
    containerRow: {
        flexDirection: 'row',
    },
    containerWidth: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        width: '100%',
    },
    subtittle: {
        fontSize: 16,
        fontFamily: "DosisSemiBold",
        marginTop: 10
    },
    text: {
        fontSize: 15,
        fontFamily: "Dosis",
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        marginVertical: 10,
        width: "100%"
    },
    icon: {
        width: 30,
        height: 30,
        position: "absolute",
        right: 0
    },
    button: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.gray
    },
})

export default AllCardScreen;