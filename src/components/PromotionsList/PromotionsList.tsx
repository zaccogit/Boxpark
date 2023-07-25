import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Dimensions, Animated } from "react-native";
import { Paginator } from "..";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import Carousel from "react-native-snap-carousel";

interface Props {
  allPromotions: Promotions[];
}

interface Promotions {
  id: number;
  name: string;
  description: string;
  position: string;
  imagen: string;
  imagenContentType: string;
}

const width: number = Dimensions.get("window").width;
const spacePromotions = width * 0.7;
var interval: any = null;

const PromotionsList = ({ allPromotions }: Props) => {
  const slidePromotionsRef: any = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const [currentIndexPromotions, setCurrentIndexPromotions] =
    useState<number>(0);

  const viewableItemsChangedPromotions = useRef(({ viewableItems }: any) => {
    setCurrentIndexPromotions(viewableItems[0].index);
  }).current;

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX,
          },
        },
      },
    ],
    {
      useNativeDriver: false,
    }
  );
  const scrollTo = () => {
    if (currentIndexPromotions < allPromotions.length - 1) {
      slidePromotionsRef?.current?.scrollToIndex({
        index: currentIndexPromotions + 1,
      });
    } else if (currentIndexPromotions === allPromotions.length - 1) {
      slidePromotionsRef?.current?.scrollToIndex({ index: 0 });
    }
  };

  useEffect(() => {
    interval = setInterval(() => {
      scrollTo();
    }, 3000);
    return () => clearInterval(interval);
  }, [allPromotions.length, currentIndexPromotions]);

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
        renderItem={({ item }) => (
          <View className="w-full  justify-center items-center">
            <Image
              source={{ uri: item?.description }}
              style={{
                width: width * 0.7,
                height: width * 0.28,
                borderRadius: 12,
                marginRight: 15,
              }}
              contentFit="contain"
            />
          </View>
        )}
      />
      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled
        bounces={false}
        snapToAlignment="start"
        snapToInterval={spacePromotions}
        decelerationRate={0}
        scrollEventThrottle={16}
        data={allPromotions}
        contentContainerStyle={{
          marginHorizontal: width * 0.05,
          paddingRight: width * 0.05,
        }}
        keyExtractor={(item) => item?.name}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item?.description }}
            style={{
              width: width * 0.7,
              height: width * 0.28,
              borderRadius: 12,
              marginRight: 15,
            }}
            contentFit="contain"
          />
        )}
        onScroll={onScroll}
        onViewableItemsChanged={viewableItemsChangedPromotions}
        viewabilityConfig={viewConfig}
        ref={slidePromotionsRef}
        disableScrollViewPanResponder={true}
      />
      <View style={{ marginVertical: 15 }}>
        <Paginator
          currentIndex={currentIndexPromotions}
          items={allPromotions}
        />
      </View> */}
    </View>
  );
};

export default PromotionsList;
