import React, { useContext, useState, useEffect } from 'react';
import { ScreenContainer, Button } from '../../components';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, Icons, SVG } from '../../../assets';
import { AuthContext, SesionContext, RenderContext, EndPointsInterface } from '../../contexts';
import { StackScreenProps } from '@react-navigation/stack';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';
import CameraComponent from '../../components/CameraComponent/CameraComponent';
import { Asset } from 'expo-media-library';
interface Props extends StackScreenProps<any, any> { }

interface File {
    uri: string | undefined,
    type: any,
    name: string | undefined,
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const DNIScreen = ({ navigation, route: { params } }: Props) => {
    const { tokenCompliance, endPoints } = useContext(AuthContext)
    const { sesion } = useContext(SesionContext)
    /* const { permissions, askCameraPermission } = useContext(PermissionsContext) */
    const { setLoader, language } = useContext(RenderContext)
    const [urlPhoto, setUrlPhoto] = useState<string | undefined>("")
    const [photo, setPhoto] = useState<Asset | "">("")
    const [CameraActive, setCameraActive] = useState<boolean>(false)
    /* const takePhoto = () => {
        if (permissions?.cameraStatus === "granted") {
            launchCamera({
                cameraType: 'back',
                quality: Platform.OS === "ios" ? .6 : .8,
                mediaType: 'photo',
                maxHeight: 1024,
                maxWidth: 720
            }, (file) => {
                if (file?.didCancel) return;
                if (!file) return;
                if (!file?.assets) return;
                if (file?.assets[0]?.fileSize as number > 230000) {
                    ToastCall('warning', "La imágen es demasiado pesada", language)
                    return
                }
                setUrlPhoto(file?.assets[0]?.uri)
                setPhoto(file)
            })
        } else {
            askCameraPermission()
        }
    } */
    const getPhoto = async (file: Asset | ""): Promise <File | null> => {
        if (!file) return null;
        const data: File = {
            uri: file.uri,
            type: 'image/jpg',
            name: file.filename,
        }
        return data
    }
    const onSubmit = async () => {
        try {
            const collectionType = params?.collectionTypes?.find((item: any) => (item?.orden === 1))
            const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COMPLIANCE_BASE_API")?.vale as string
            const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_IMAGE_COMPLIANCE_URL")?.vale as string
            const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_IMAGE_COMPLIANCE_METHOD")?.vale as Method
            const headers = GetHeader(tokenCompliance, "multipart/form-data");
            const partPhoto: any = await getPhoto(photo)
            const req: FormData = new FormData()
            req.append("addressId", `${sesion?.addressId}`)
            req.append("mail", `${sesion?.email}`)
            req.append("userSourceId", `${sesion?.id}`)
            req.append("collectionTypeId", `${collectionType?.id}`)
            req.append("descriptionImagenContentType", collectionType?.description)
            req.append("file", partPhoto)
            const response: any = await HttpService(method, host, url, req, headers, setLoader)
            if (response?.codigoRespuesta === "00") {
                navigation.replace("DNII", { collectionTypes: params?.collectionTypes })
            } else {
                ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language)
            }
        } catch (err) {
            console.log(JSON.stringify(err), 'aqui')
            ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language)
        }
    }
    /* useEffect(() => {
        askCameraPermission();
    }, []); */

    return (
        <ScreenContainer>
            {
                CameraActive
                    ? (
                        <CameraComponent saveImage={setPhoto} setActive={setCameraActive} setUrl={setUrlPhoto} text='Toma una foto a tu documento de identidad' typeMask='doc' />
                    )
                    : (<>
                        <View style={styles.containerForm}>
                            <Text style={styles.textTitle}>{Languages[language].SCREENS.DNIScreen.title}</Text>
                            <View style={{ marginHorizontal: width * .1, alignItems: 'center' }}>
                                <TouchableOpacity style={styles.buttonQR} onPress={() => { setCameraActive(true); }}>
                                    <View style={{ position: 'absolute', width: 12, height: 160, left: -10, top: 25, backgroundColor: Colors.white }}></View>
                                    <View style={{ position: 'absolute', width: 160, height: 12, left: 25, top: -10, backgroundColor: Colors.white }}></View>
                                    <View style={{ position: 'absolute', width: 160, height: 12, left: 25, bottom: -10, backgroundColor: Colors.white }}></View>
                                    <View style={{ position: 'absolute', width: 12, height: 160, right: -10, top: 25, backgroundColor: Colors.white }}></View>
                                    <View style={styles.iconQrContainer}>
                                        <Image source={urlPhoto ? { uri: urlPhoto } : Icons.TouchScreen} style={styles.iconQr} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginTop: 20 }}>
                                    <SVG.DNIImageSVG />
                                </View>
                            </View>
                            <View style={{ width: width * .5, alignItems: 'center' }}>
                                <Button
                                    disabled={!urlPhoto?.length}
                                    onPress={() => onSubmit()}
                                />
                            </View>
                        </View>
                    </>)

            }

        </ScreenContainer>
    )
}
const styles = StyleSheet.create({
    containerForm: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: width * .05,
        flex: 1
    },
    textTitle: {
        color: Colors.blackBackground,
        fontSize: 32,
        fontFamily: "DosisMedium",
        marginHorizontal: 10,
        marginVertical: 20,
        textAlign: 'center'
    },
    textSubTitle: {
        color: Colors.blackBackground,
        fontSize: 22,
        fontFamily: "DosisBold",
        textAlign: 'center'
    },
    cancelButton: {
        backgroundColor: Colors.transparent,
        marginBottom: 0,
        marginTop: 10,
        elevation: 0,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: Colors.blackBackground,
        shadowColor: Colors.blackBackground
    },
    confirmButton: {
        marginBottom: 0,
        marginTop: 10,
        shadowColor: Colors.blackBackground
    },
    buttonQR: {
        padding: 15,
        borderStyle: 'solid',
        borderWidth: 10,
        borderColor: Colors.blackBackground,
        borderRadius: 20,
        position: 'relative'
    },
    iconQrContainer: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignContent: 'center',
        tintColor: '#000'
    },
    iconQr: {
        width: 180,
        height: 180,
    }
})
export default DNIScreen;
