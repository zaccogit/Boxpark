import React, {useState, useCallback, useContext} from 'react';
import {ScrollView, Platform, RefreshControl, StatusBar, Dimensions} from 'react-native';
import {SesionContext} from "../../contexts"
import {Colors} from '../../utils';
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
  const {sesion, restartTimerSesion} = useContext(SesionContext)
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
    </ScrollView>
  );
};

export default ScreenContainer;
