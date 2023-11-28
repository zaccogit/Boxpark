import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import ButtonCamera from '../ButtonCamera/ButtonCamera';
import CameraDocFrame from './CameraDocFrame';
import { Svg, Mask, Defs, Rect } from "react-native-svg"

type Props = {

  saveImage: (image: MediaLibrary.Asset | "") => void
  setActive: (active: boolean) => void
  setUrl: (uriAsset: string) => void
  swichCamera?: boolean
  text?: string
  typeMask: "doc" | "selfie" | "camera"
}

const width: number = Dimensions.get('window').width;

export default function CameraComponent({ saveImage, setActive, setUrl, swichCamera = false, text, typeMask = "camera" }: Props) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const [type, setType] = useState(typeMask === "selfie" ? CameraType.front : CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          aspect: [4, 3],
          quality: Platform.OS === "ios" ? .6 : .8,
        });
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        saveImage(asset)
        setUrl(asset.uri)
        setActive(false)
        setImage("");
        console.log('saved successfully');
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 30,
            }}
          >
            {
              swichCamera &&

              <ButtonCamera
                title=""
                icon="retweet"
                onPress={() => {
                  setType(
                    type === CameraType.back ? CameraType.front : CameraType.back
                  );
                }}
              />
            }
            {/* <ButtonCamera
              onPress={() =>
                setFlash(
                  flash === FlashMode.off
                    ? FlashMode.on
                    : FlashMode.off
                )
              }
              icon="flash"
              color={flash === FlashMode.off ? 'gray' : '#fff'}
            /> */}
          </View>

          <View className=' static '>
            {
              typeMask === "selfie" &&

              <Svg
                height="100%"
                width="100%"
              >
                <Defs>
                  <Mask
                    id='mask'
                    x={0}
                    y={0}
                    height={"100%"}
                    width={"100%"}
                  >
                    <Rect height={"100%"} width={"100%"} fill={"#fff"} />
                    <Rect x={width / 5} y={"30%"} height={"250"} width={"200"} fill={"black"} rx={"100%"} />


                  </Mask>

                </Defs>

                <Rect height={"100%"} width={"100%"} fill={"rgba(0,0,0,0.6)"} mask='url(#mask)' />
              </Svg>
            }
            

            {
              typeMask === "doc" &&

              <Svg
                height="100%"
                width="100%"
              >
                <Defs>
                  <Mask
                    id='mask'
                    x={0}
                    y={0}
                    height={"100%"}
                    width={"100%"}
                  >
                    <Rect height={"100%"} width={"100%"} fill={"#fff"} />
                    <Rect x={width / 8} y={"30%"} height={"200"} width={"275"} fill={"black"} rx={16} />


                  </Mask>

                </Defs>

                <Rect height={"100%"} width={"100%"} fill={"rgba(0,0,0,0.6)"} mask='url(#mask)' />
              </Svg>
            }

            {text && <Text className=' text-white absolute bottom-[15%] Dosis w-full text-center'>{text}</Text>}

            {/* <View className=' bg-green-400 w-1/2 p-2 rounded-xl absolute bottom-3 left-1/4  '>
              <ButtonCamera onPress={takePicture} icon="camera" />
            </View> */}
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} style={styles.camera} />
      )}

      {
        image ?

          <View style={styles.controls} className=' justify-center items-center flex-row gap-3 mt-2'>
            <View className=' bg-red-400  p-3 rounded-xl justify-center items-center '>
              <ButtonCamera
                title='Repetir'
                onPress={() => setImage("")}
                icon="retweet"
              />
            </View>


            <View className=' bg-green-400  p-3 rounded-xl justify-center items-center'>
              <ButtonCamera onPress={savePicture} icon="check" title=' Listo ' />
            </View>
          </View>
          :
          <View style={styles.controls} className=' justify-center items-center flex-row gap-3 mt-2'>
            <View className=' bg-green-400 w-1/2 p-2 rounded-xl   '>
              <ButtonCamera onPress={takePicture} icon="camera" />
            </View>
          </View>

      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#000',
    padding: 8,
  },
  controls: {
    flex: 0.2,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    position: "relative",
    flex: 5,
    borderRadius: 20,
  },
  topControls: {
    flex: 1,
  },
});