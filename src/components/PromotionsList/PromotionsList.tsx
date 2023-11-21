import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Dimensions, Animated } from "react-native";
import { Paginator } from "..";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import PromotionImage from "./PromotionImage";
import { width } from "../../utils";

interface Props {
  allPromotions: Promotions[];
}

export interface Promotions {
  id: number;
  name: string;
  description: string;
  position: string;
  imagen: string;
  imagenContentType: string;
}

const PromotionsList = ({ allPromotions }: Props) => {

  return (
    <View
      style={{ width: "100%", flexDirection: "row", justifyContent: "center" }}
      className=" px-2 py-3"
    >
      {/* <Carousel
        autoPlay
        loop
        autoPlayInterval={2500}
        data={allPromotions}
        width={width}
        height={width * 0.3}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        renderItem={({ item }) => <PromotionImage key={item.id} item={item} />}
      /> */}
    </View>
  );
};

export default PromotionsList;
