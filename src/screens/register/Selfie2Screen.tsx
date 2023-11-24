import React, { useContext, useState, useEffect } from 'react';
import { ScreenContainer, Button } from '../../components';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, Icons, Images } from '../../../assets';
import { AuthContext, SesionContext, RenderContext, EndPointsInterface, RegisterContext } from '../../contexts';
import { ImagePickerResponse, launchCamera } from 'react-native-image-picker';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';
import { Asset } from 'expo-media-library';
import CameraComponent from '../../components/CameraComponent/CameraComponent';

interface Props extends StackScreenProps<any, any> { }

interface File {
  uri: string | undefined;
  type: any;
  name: string | undefined;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const Selfie2Screen = ({ navigation, route: { params } }: Props) => {
  const { tokenCompliance, endPoints } = useContext(AuthContext);
  const { sesion, setSesion } = useContext(SesionContext);
  /* const { permissions, askCameraPermission } = useContext(PermissionsContext); */
  const { setLoader, language } = useContext(RenderContext);
  const [urlPhoto, setUrlPhoto] = useState<string | undefined>("")
  const [photo, setPhoto] = useState<Asset | "">("")
  const [CameraActive, setCameraActive] = useState<boolean>(false)
  const {  setpartPhoto} = useContext(RegisterContext);

  const getPhoto = async (file: Asset | ""): Promise<File | null> => {
    if (!file) return null;
    const data: File = {
      uri: file.uri,
      type: 'image/jpg',
      name: file.filename,
    }
    return data
  }
  const onSubmit = async () => {
    if(photo){

      const photoReq = await getPhoto(photo)

      setpartPhoto(photoReq)

      navigation.navigate("CreatePassword")

    }
  };
  return (
    <ScreenContainer>
      {
        CameraActive
          ? (
            <CameraComponent saveImage={setPhoto} setActive={setCameraActive} setUrl={setUrlPhoto}  text='Toma una foto selfie' typeMask='selfie' />
          )
          : (<>
            <View style={styles.containerForm}>
              <Text style={styles.textTitle}>{Languages[language].SCREENS.SelfieScreen.title}</Text>
              <View style={{ marginHorizontal: width * 0.1, alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.buttonQR}
                  onPress={() => {
                    setCameraActive(true)
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
              {/* <View style={{ marginTop: 20 }}>
                <Image source={Images.selfie} style={{ width: 250, height: 250 }} />
              </View> */}
              <View style={{ width: width * 0.5, alignItems: 'center' }}>
                <Button
                  disabled={!urlPhoto?.length}
                  onPress={() => { onSubmit(); }}
                />
              </View>
            </View>
          </>)

      }

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
export default Selfie2Screen;
