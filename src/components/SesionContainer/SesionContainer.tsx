import React, { useContext, useEffect, useCallback } from "react";
import { SesionContext, AuthContext, AccountsContext } from "../../contexts";
import { DestroySesion } from "../../utils/GeneralMethods";

interface Props {
  push: any;
}

const SesionContainer = ({ push }: Props) => {
  const { sesion, setSesion, timerSesion } = useContext(SesionContext);
  const { setTokenTransaction } = useContext(AuthContext);
  const { setAccounts } = useContext(AccountsContext);

  const closeSesion = useCallback((): void => {
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    push("Login");
  }, []);

  /* useEffect(() => {
    (timerSesion <= 0 )&& closeSesion()
  }, [timerSesion]);

  useEffect(() => {
    !sesion && closeSesion()
  }, [sesion]); */

  return <></>;
};

export default SesionContainer;
