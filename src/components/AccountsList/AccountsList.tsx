import { useState, useContext, useRef } from "react";
import { View, Dimensions, FlatList } from "react-native";
import DebitCard from "../DebitCard/DebitCard";
import Paginator from "../Paginator/Paginator";
import { AccountsContext } from "../../contexts";

const width: number = Dimensions.get("window").width;
const spaceDebitCards = width * 0.8 + 15;

const AccountsList = () => {
  const { accounts } = useContext(AccountsContext);
  const slideRef: any = useRef(null);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={{ width: "100%" }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled
        bounces={false}
        snapToAlignment="start"
        snapToInterval={spaceDebitCards}
        decelerationRate={0}
        scrollEventThrottle={16}
        data={accounts}
        contentContainerStyle={{ paddingHorizontal: width * 0.05 }}
        keyExtractor={(item) => item?.accountNo}
        renderItem={({ item }) => (
          <View>
            <DebitCard
              name={item?.productName}
              key={item?.accountNo}
              balance={item?.accountBalance}
              displaySymbol={item?.currency?.displaySymbol}
            />
          </View>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slideRef}
        disableScrollViewPanResponder={true}
      />
     {/*  <View style={{ marginVertical: 15 }}>
        <Paginator currentIndex={currentIndex} items={accounts} />
      </View> */}
    </View>
  );
};

export default AccountsList;
