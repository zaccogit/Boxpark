import React, { useEffect, useState, useCallback, useContext } from 'react';
import { StyleSheet, View, Text, Dimensions } from "react-native"
import { ScreenContainer, Header, DebitCardWithInfo, AuthTokenInternal, CardInterface } from "../../components"
import { SesionContext, RenderContext, AuthContext, EndPointsInterface } from "../../contexts"
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';
import { HttpService} from '../../services';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { Method } from '../auth/LoginScreen';

interface Props extends StackScreenProps<any, any> { }

interface Response {
    limitSaveCard: boolean,
    limitCard: number,
    data: CardInterface[]
}



const width: number = Dimensions.get('window').width;

const AllCardScreen = ({ navigation, route }: Props) => {
    const { sesion } = useContext(SesionContext);
    const { tokenTransaction, tokenGateway, endPoints } = useContext(AuthContext);
    const { setLoader, language } = useContext(RenderContext);
    const [cards, setCards] = useState<Response | null>(null)
    const [cardSelected, setCardSelected] = useState<CardInterface | null>(null)
    const [modal, setModal] = useState<boolean>(false)

    const redirect = (card: CardInterface) => {
        navigation.push("CardInfo", { card })
    }
    const getCards = useCallback(async () => {
        try {
            const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
            const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LIST_CARDS_CREDICARD")?.vale as string}?userId.equals=${sesion?.id}`
            const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LIST_CARDS_CREDICARD_METHOD")?.vale as Method
            const headers = GetHeader(tokenGateway, "application/json")
            const response: Response = await HttpService(method, host, url, {}, headers, setLoader);
            if (!response) {
                ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
                return;
            }
            setCards(response)
        } catch (err) {
            ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        }
    }, [language, endPoints, sesion, cardSelected, tokenGateway])
    useEffect(() => {
        getCards()
    }, [])
    return (
        <>
            <Header
                title={"Tarjetas"}
                showBackButtom
                navigation={navigation}
                route={route}
            />
            <ScreenContainer disabledPaddingTop onRefresh={getCards}>

                <View style={[styles.container]}>
                    <Text style={[styles.title]}>Mis Tarjetas</Text>
                    {
                        cards?.data?.map((card: CardInterface) => (
                            <DebitCardWithInfo
                                card={card}
                                action={() => {
                                    setCardSelected(card)
                                    !tokenTransaction ? setModal(true) : redirect(card)
                                }}
                                secure
                                key={card.id}
                            />
                        ))
                    }
                </View>
                <AuthTokenInternal
                    active={modal}
                    setActive={setModal}
                    onSubmit={() => {
                        redirect(cardSelected as CardInterface)
                    }}
                />
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        width,
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        width: '100%',
    },
    textSubTitle: {
        fontSize: 20,
        fontFamily: "DosisMedium",
        color: Colors.blackBackground,
        marginVertical: 15,
    },
    containerCheck: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    containerWidth: {
        width: '100%',
    },
    text: {
        color: Colors.black,
        fontFamily: "DosisMedium",
        fontSize: 20,
        textAlign: 'center',
    },
})

export default AllCardScreen;