import React, { useState, PropsWithChildren, useEffect, useContext } from "react";
import RenderContext from "./RenderContext";

const RenderState = ({ children }: PropsWithChildren) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [firstTime, setFirstTime] = useState<boolean>(false);
  const [language, setLanguage] = useState<"ES" | "EN">("ES");
  return (
    <RenderContext.Provider
      value={{
        loader,
        language,
        firstTime,
        setLoader,
        setFirstTime,
        setLanguage,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};
export const useRender = () => useContext(RenderContext);

export default RenderState;
