import { Image } from 'expo-image'
import { StyleSheet, View,ActivityIndicator  } from 'react-native'
import { Colors, width } from '../../utils'
import { Promotions } from './PromotionsList'
import { useEffect, useState } from 'react'

function PromotionImage({ item }: { item: Promotions }) {

     const [Loaded, setLoaded] = useState<boolean>(false)

     useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 1000);
     }, [])
     

    return (
        <View className="w-full h-auto  justify-center items-center">
            {
            Loaded 
            ?
            <Image
                source={{ uri: item?.description }}
                style={style.image}
                onLoad={() => setLoaded(true)}
            />
            :
             <View style={style.loader} >
                <ActivityIndicator size="large" color={Colors.blackBackground} />
            </View>
            
            }
        </View>
    )
}

export default PromotionImage

const style = StyleSheet.create({
    image: {
        width: width * 0.8,
        height: width * 0.3,
        borderRadius: 20,
    },
    loader: {
        width: width * 0.7,
        height: width * 0.28,
        borderRadius: 12,
        marginRight: 15,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
})