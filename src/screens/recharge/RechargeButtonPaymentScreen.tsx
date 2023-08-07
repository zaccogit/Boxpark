import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import {
    ScreenContainer, Header, Button, Input, CardInterface, CardInitState, InputDisabled,
    Modal, CardLayout, DebitCardWithInfo, AuthToken, Select
} from '../../components';
import { RenderContext, SesionContext, AuthContext, EndPointsInterface } from "../../contexts"
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';
import { Colors } from '../../utils';
import { SVG, Fonts } from '../../../assets';
import { HttpService, Method } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }

interface Response {
    limitSaveCard: boolean,
    limitCard: number,
    data: CardInterface[]
}

const width: number = Dimensions.get('window').width;

interface AccountType {
    value: string,
    label: string
}

const accountType: AccountType[] = [
    {
        label: "Debito",
        value: "DEBIT"
    },
    {
        label: "Credito",
        value: "CREDIT"
    },
]
const RechargeButtonPaymentScreen = ({ navigation, route }: Props) => {
    const { language, setLoader } = useContext(RenderContext);
    const { sesion, restartTimerSesion } = useContext(SesionContext);
    const { tokenTransaction, tokenGateway, endPoints } = useContext(AuthContext);
    const [primary, setPrimary] = useState<boolean>(true);
    const [allCards, setAllCards] = useState<Response | null>(null)
    const [card, setCard] = useState<CardInterface>(CardInitState);
    const [modal, setModal] = useState<boolean>(false)

    const onChange = useCallback((value: string, key: string) => {
        setCard({
            ...card,
            [key]: value
        })
    }, [])
    const changeSelect = (value: string | number, key: string) => {
        setCard({
            ...card,
            account_type: value as string
        });
    };

    const getCards = useCallback(async () => {
        try {
            const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale as string
            const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LIST_CARDS_CREDICARD")?.vale as string}?userId.equals=${sesion?.id}`
            const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LIST_CARDS_CREDICARD_METHOD")?.vale as Method
            const headers = GetHeader(tokenGateway, "application/json")
            const response: Response = await HttpService(method, host, url, {}, headers, setLoader);
            if (!response) {
                ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
                return;
            }
            !response?.data?.length && setPrimary(false)
            setAllCards(response)
        } catch (err) {
            ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        }
    }, [language, endPoints])
    useEffect(() => {
        getCards()
    }, [])
    return (
        <>
            <Header title={'Recarga por TDD/TDC nacional'} showBackButtom navigation={navigation} route={route} />
            <ScreenContainer>
                <View style={styles.container}>

                    <View style={[styles.containerRow, styles.containerWidth, styles.containerButtons]}>
                        <Button
                            text={"Tarjeta registrada"}
                            styleButton={[styles.buttonRender, { marginRight: 15 }, !primary ? styles.buttonRenderWhite : {}]}
                            disabled={!allCards?.data?.length}
                            white={!primary}
                            onPress={() => {
                                setPrimary(true)
                                setCard(CardInitState)
                            }}
                        />
                        {
                            !allCards?.limitSaveCard &&
                            <Button
                                text={"Nueva tarjeta"}
                                styleButton={[styles.buttonRender, primary ? styles.buttonRenderWhite : {}]}
                                disabled={allCards?.limitSaveCard}
                                white={primary}
                                onPress={() => {
                                    setPrimary(false)
                                    setCard(CardInitState)
                                }}
                            />
                        }

                    </View>
                    {
                        primary && (
                            <>
                                <View style={styles.containerWidth}>
                                    <Text style={styles.title}>Número de tarjeta</Text>
                                    <View style={[styles.containerWidth, styles.containerRow, styles.containerBetween]}>
                                        <View style={{ width: "80%" }}>
                                            <InputDisabled value={card?.card_number} stylesContainer={{ marginBottom: 0 }} />
                                        </View>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            setModal(true)
                                            sesion && restartTimerSesion()
                                        }}>
                                            <SVG.Search color={Colors.blackBackground} width={25} height={25} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    card?.card_number && (
                                        <>
                                            <View style={styles.containerWidth}>
                                                <Text style={styles.title}>Nombre del titular</Text>
                                                <InputDisabled value={card?.holder_name} stylesContainer={{ marginBottom: 0 }} />
                                            </View>
                                            <View style={[styles.containerWidth, styles.containerRow, styles.containerBetween]}>
                                                <View style={[styles.containerWidth, { width: "45%" }]}>
                                                    <Text style={styles.title}>Tipo de cuenta</Text>
                                                    <InputDisabled value={card?.card_type} />
                                                </View>
                                                <View style={[styles.containerWidth, { width: "45%" }]}>
                                                    <Text style={styles.title}>Moneda</Text>
                                                    <InputDisabled value={card?.currency} />
                                                </View>
                                            </View>
                                            <View style={[styles.containerWidth, styles.containerBetween]}>
                                                <DebitCardWithInfo
                                                    card={card}
                                                />
                                            </View>
                                            <View style={[styles.containerWidth, styles.containerBetween, { marginTop: width * .15 }]}>
                                                <View style={{ width: "45%" }}>
                                                    <Button />
                                                </View>
                                            </View>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                    {
                        !primary && (
                            <View style={styles.containerWidth}>
                                <Text style={styles.title}>Número de tarjeta</Text>
                                <Input
                                    value={card?.card_number}
                                    onChangeText={(e: string) => onChange(e.replace(/[^0-9]/g, ''), 'card_number')}
                                    maxLength={19}
                                    styleContainer={{ marginBottom: 0 }}
                                />
                                <Text style={styles.title}>Nombre del titular</Text>
                                <Input
                                    value={card?.card_number}
                                    onChangeText={(e: string) => onChange(e.replace(/[^0-9]/g, ''), 'card_number')}
                                    maxLength={19}
                                    styleContainer={{ marginBottom: 0 }}
                                />
                                <View style={[styles.containerWidth, styles.containerRow, styles.containerBetween]}>
                                    <View style={[styles.containerWidth, { width: "50%" }]}>
                                        <Text style={styles.title}>Fecha de vencimiento</Text>
                                        <View style={[styles.containerWidth, styles.containerRow, styles.containerBetween]}>
                                            <View style={[styles.containerWidth, { width: "45%" }]}>
                                                <Input
                                                    placeholder='MM'
                                                    value={card?.card_number}
                                                    onChangeText={(e: string) => onChange(e.replace(/[^0-9]/g, ''), 'expiration_month')}
                                                    maxLength={2}
                                                    styleContainer={{ marginBottom: 0 }}
                                                />
                                            </View>
                                            <View style={[styles.containerWidth, { width: "45%" }]}>
                                                <Input
                                                    placeholder='YY'
                                                    value={card?.card_number}
                                                    onChangeText={(e: string) => onChange(e.replace(/[^0-9]/g, ''), 'expiration_year')}
                                                    maxLength={2}
                                                    styleContainer={{ marginBottom: 0 }}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                </View>
                                <View style={[styles.containerWidth, styles.containerRow, styles.containerBetween]}>
                                    <View style={[styles.containerWidth, { width: "45%" }]}>
                                        <Text style={styles.title}>CVC</Text>
                                        <Input
                                            placeholder='909'
                                            value={card?.card_number}
                                            onChangeText={(e: string) => onChange(e, 'cvc')}
                                            maxLength={3}
                                        />
                                    </View>
                                    <View style={[styles.containerWidth, { width: "45%" }]}>
                                        <Text style={styles.title}>Tipo de cuenta</Text>
                                        <Select
                                            value={card?.account_type}
                                            items={accountType}
                                            setState={changeSelect}
                                            name='account_type'
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </View>
            </ScreenContainer>
            <Modal
                active={modal}
                disabledSubmitButton
                onClose={() => { setModal(false) }}
            >
                {
                    allCards?.data?.map((data: CardInterface) => (
                        <CardLayout
                            key={`${data.id}`}
                            onPress={() => {
                                setCard(data)
                                setModal(false)
                            }}
                        >
                            <>
                                <Text style={[styles.text]}>{data.card_number}</Text>
                                <Text style={[styles.text, { fontSize: 12 }]}>{data?.holder_name}</Text>
                                <Text style={[styles.text, { fontSize: 12 }]}>{data?.card_bank_code}</Text>
                            </>
                        </CardLayout>
                    ))
                }
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        width,
    },
    logo: {
        width: 200,
        height: 115,
    },
    text: {
        color: Colors.black,
        fontFamily: "Dosis",
        fontSize: 14,
    },
    title: {
        fontSize: 18,
        marginVertical: 10,
        fontFamily: "DosisBold",
    },
    containerRow: {
        flexDirection: 'row',
    },
    containerBetween: {
        justifyContent: "space-between",
        alignItems: "center"
    },
    containerWidth: {
        width: '100%',
    },
    buttonRender: {
        width: 'auto',
        paddingHorizontal: 20,
    },
    buttonRenderWhite: {
        borderColor: Colors.transparent,
        shadowColor: Colors.transparent,
    },
    button: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.gray
    },
    containerButtons: {
        marginBottom: 10
    },
});

export default RechargeButtonPaymentScreen;