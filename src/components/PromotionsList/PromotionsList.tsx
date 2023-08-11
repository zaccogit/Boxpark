import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Dimensions, Animated } from "react-native";
import { Paginator } from "..";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import Carousel from "react-native-snap-carousel";
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
      <Carousel
        centerContent
        autoplay
        loop
        autoplayInterval={2500}
        layout={"default"}
        data={allPromotions}
        sliderWidth={width}
        itemWidth={width * 0.7}
        renderItem={({ item }) => <PromotionImage key={item.id} item={item} />}
      />
    </View>
  );
};

export default PromotionsList;
