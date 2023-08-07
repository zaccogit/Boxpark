import React from 'react'
import { View } from 'react-native'
import { Svg, Mask, Defs, Rect } from "react-native-svg"

function CameraDocFrame() {
    return (
        <View className=' static '>
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
                        <Rect x={"10%"} y={"30%"} height={"200"} width={"275"} fill={"black"} />

                    </Mask>

                </Defs>

                <Rect height={"100%"} width={"100%"} fill={"rgba(0,0,0,0.6)"} mask='url(#mask)' />
            </Svg>
        </View>
    )
}

export default CameraDocFrame