import * as React from "react"
import Svg, { Path } from "react-native-svg"

function LogoBoxpark(props:any) {
  return (
    <Svg
      viewBox="0 0 1040 1040"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 0H1040V1040H0z" />
      <Path
        d="M606.276 515.794L920 825.912V670.853L750.517 515.794l75.726-72.12V285.009L606.276 515.794zM544.974 569.885L206.007 908.851h165.877l173.09-180.301 57.696 57.696h155.059L544.974 569.885zM490.883 512.188L148.311 173.222v151.453l187.513 187.513-64.908 72.121v137.029l219.967-209.15zM541.368 443.674L875.839 116.64l-155.053-1.353-179.418 187.752-54.091-61.303H343.036l198.332 201.938z"
        fill="#fff"
      />
    </Svg>
  )
}

export default LogoBoxpark