import React, { useContext, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SesionContext } from '../../contexts';
import { Images } from '../../../assets';
import Button from '../Button/Button';
import SesionContainer from '../SesionContainer/SesionContainer';
import { StackScreenProps } from '@react-navigation/stack';
import {styles} from "./HeaderDashboardResources"
interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const HeaderDashboard = ({ navigation: { push }, route: { name } }: Props) => {
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  

  return (
    <View style={[styles.containerWidth, styles.containerRow, { paddingHorizontal: width * 0.05, marginBottom: 20, position: "relative" }]}>
      <TouchableOpacity
        style={[styles.profile,{ position: "absolute", left: width * .05, top: 0, zIndex: 10 }]}
        onPress={() => {
          push('Profile');
        }}
        disabled={name === 'Profile'}
        >
        <Image
          style={[styles.profile]}
          source={sesion?.profileImage?.url ? { uri: sesion?.profileImage?.url } : Images.Profile}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={{ flexGrow: 1, justifyContent: 'space-between', alignItems: "flex-end" }}>
        <View style={[styles.containerWidth, styles.containerRow, { justifyContent: 'center' }]}>
          <View style={{ width: width > 300 ? width * 0.35 : width * 0.40 }}>
            <Button
              text="Refiere y Gana"
              styleButton={{ borderRadius: 100 }}
              onPress={() => {
                push('Refered');
                restartTimerSesion();
              }}
            />
          </View>
        </View>
        <Text style={[styles.text, { textAlign: 'right', textTransform: 'capitalize' }]} numberOfLines={1}>
          Hola, {sesion?.firstName} {sesion?.lastName}
        </Text>
      </View>
      <SesionContainer push={push} />
    </View>
  );
};


export default HeaderDashboard;
