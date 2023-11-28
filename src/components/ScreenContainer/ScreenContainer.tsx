import {useState, useCallback} from 'react';
import {ScrollView, Platform, RefreshControl, StatusBar, Dimensions, Text, StyleSheet} from 'react-native';
import {Colors} from '../../utils';
import { useSesion } from '../../contexts/sesion/SesionState';
import Modal from '../Modal/Modal';
interface Props {
  onRefresh?: any;
  children?: any;
  backgroundColor?: string;
  disabledPaddingTop?: boolean;
  disabledPaddingBottom?: boolean;
  disabledStatusBar?: boolean;
}

const width: number = Dimensions.get('window').width;

const wait = () => {
  return new Promise(resolve => {
    resolve(1);
  });
};

const ScreenContainer = ({
  backgroundColor,
  children,
  onRefresh,
  disabledPaddingTop,
  disabledPaddingBottom,
  disabledStatusBar,
}: Props) => {
  const {sesion, restartTimerSesion, modalLogout, setModalLogout,modalAlert,setModalAlert,timerSesion} = useSesion()
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    setRefreshing(true);
    wait().then(() => {
      sesion&&restartTimerSesion()
      onRefresh();
      setRefreshing(false);
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: backgroundColor || Colors.white,
        paddingTop: Platform.OS == 'ios' && !disabledPaddingTop ? 50 : Platform.OS === 'android' && !disabledStatusBar ? 10 : 0,
        paddingBottom: Platform.OS == 'ios' && !disabledPaddingBottom ? 50 : Platform.OS === 'android' ? 20 : 0,
        position: 'relative',
        width,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            onRefresh ? onSubmit() : null;
          }}
        />
      }>
      {disabledStatusBar ?? <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />}
      {children}
      <Modal
        active={modalLogout}
        disableCloseButton
        onSubmit={() => {
          setModalLogout(false);
        }}
      >
        <Text
          style={[styles.text, styles.title, { fontFamily: "DosisSemiBold" }]}
        >
          ¡Su sesión ha expirado!
        </Text>
      </Modal>
      <Modal
        active={modalAlert}
        disableCloseButton
        onSubmit={() => {
          setModalAlert(false);
        }}
      >
        <Text style={[styles.text, styles.title]}>
          Su sesión esta por expirar
        </Text>
        <Text style={[styles.text]}>
          Si desea extenderla presione ok, de no confirmar será desconectada en{" "}
          {timerSesion}seg
        </Text>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ScreenContainer;
