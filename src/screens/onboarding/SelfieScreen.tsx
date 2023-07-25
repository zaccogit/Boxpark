import React, { useContext, useState, useEffect } from 'react';
import { ScreenContainer, Button } from '../../components';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, Icons, Images } from '../../../assets';
import { AuthContext, SesionContext, RenderContext, EndPointsInterface } from '../../contexts';
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface File {
  uri: string | undefined;
  type: any;
  name: string | undefined;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const SelfieScreen = ({ navigation, route: { params } }: Props) => {
  const { tokenCompliance, endPoints } = useContext(AuthContext);
  const { sesion, setSesion } = useContext(SesionContext);
  /* const { permissions, askCameraPermission } = useContext(PermissionsContext); */
  const { setLoader, language } = useContext(RenderContext);
  const [urlPhoto, setUrlPhoto] = useState<string | undefined>('');
  const [photo, setPhoto] = useState<ImagePickerResponse | undefined>();
  /* const takePhoto = () => {
    if (permissions?.cameraStatus === 'granted') {
      launchCamera(
        {
          cameraType: 'front',
          quality: Platform.OS === "ios" ? .6 : .8,
          mediaType: 'photo',
          maxHeight: 1024,
          maxWidth: 720,
        },
        file => {
          if (file?.didCancel) return;
          if (!file) return;
          if (!file?.assets) return;
          if (file?.assets[0]?.fileSize as number > 230000) {
            ToastCall('warning', "La imágen es demasiado pesada", language)
            return
          }

          setUrlPhoto(file?.assets[0]?.uri);
          setPhoto(file);
        },
      );
    } else {
      askCameraPermission();
    }
  }; */
  const getPhoto = (file: ImagePickerResponse | undefined): File | null => {
    if (!file) return null;
    if (!file?.assets) return null;
    const data: File = {
      uri: file?.assets[0]?.uri,
      type: file?.assets[0]?.type,
      name: file?.assets[0]?.fileName,
    };
    return data;
  };
  const onSubmit = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COMPLIANCE_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_IMAGE_COMPLIANCE_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_IMAGE_COMPLIANCE_METHOD")?.vale as Method
      const headers = GetHeader(tokenCompliance, 'multipart/form-data');
      const collectionType = params?.collectionTypes?.find((item: any) => item?.orden === 3);
      const partPhoto: File = getPhoto(photo) as File
      const req: FormData = new FormData();
      /* req.append('addressId', sesion?.addressId);
      req.append('mail', sesion?.email);
      req.append('userSourceId', sesion?.id);
      req.append('collectionTypeId', collectionType?.id);
      req.append('descriptionImagenContentType', collectionType?.description);
      req.append('file', partPhoto); */
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        navigation.replace('OnboardingSuccess');
        setSesion(null);
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
 /*  useEffect(() => {
    askCameraPermission();
  }, []); */
  return (
    <ScreenContainer>
      <View style={styles.containerForm}>
        <Text style={styles.textTitle}>{Languages[language].SCREENS.SelfieScreen.title}</Text>
        <View style={{ marginHorizontal: width * 0.1, alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.buttonQR}
            onPress={() => {
              /* takePhoto(); */
            }}>
            <View
              style={{
                position: 'absolute',
                width: 12,
                height: 160,
                left: -10,
                top: 25,
                backgroundColor: Colors.white,
              }}></View>
            <View
              style={{
                position: 'absolute',
                width: 160,
                height: 12,
                left: 25,
                top: -10,
                backgroundColor: Colors.white,
              }}></View>
            <View
              style={{
                position: 'absolute',
                width: 160,
                height: 12,
                left: 25,
                bottom: -10,
                backgroundColor: Colors.white,
              }}></View>
            <View
              style={{
                position: 'absolute',
                width: 12,
                height: 160,
                right: -10,
                top: 25,
                backgroundColor: Colors.white,
              }}></View>
            <View style={styles.iconQrContainer}>
              <Image source={urlPhoto ? { uri: urlPhoto } : Icons.TouchScreen} style={styles.iconQr} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Image source={Images.selfie} style={{ width: 250, height: 250 }} />
        </View>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button
            disabled={!urlPhoto?.length}
            onPress={() => { onSubmit(); }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  containerForm: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: width * .05,
    flex: 1
  },
  textTitle: {
    color: Colors.blackBackground,
    fontSize: 26,
    fontFamily: Fonts.DosisMedium,
    marginHorizontal: 10,
    marginVertical: 20,
    textAlign: 'center'
  },
  textSubTitle: {
    color: Colors.blackBackground,
    fontSize: 22,
    fontFamily: Fonts.DosisBold,
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
export default SelfieScreen;
