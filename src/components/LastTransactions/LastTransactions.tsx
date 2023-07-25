import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LoadingTransaction, TransacctionCard } from "..";
import { styles } from "./LastTransactionsStyles";
import { LastTransaction, Props } from "./LastTransactionsInterfaces";

const width: number = Dimensions.get("window").width;

const LastTransactions = ({
  loaderTransactions,
  lastTransactions,
  messageTransaction,
}: Props) => {
  return (
    <>
      <View
        style={[
          styles.containerRow,
          { justifyContent: "flex-start", paddingHorizontal: width * 0.05 },
        ]}
      >
        <Text style={[styles.text, styles.title]}>Transacciones</Text>
      </View>
      <View style={[styles.containerTransactions, styles.containerCenter]}>
        {loaderTransactions ? (
          <LoadingTransaction active={loaderTransactions} />
        ) : (
          <>
            {!lastTransactions.length && (
              <Text
                style={{
                  fontFamily: "DosisMedium",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                {messageTransaction}
              </Text>
            )}
            {lastTransactions?.map(
              (transaction: LastTransaction, index: number) => {
                return (
                  <TransacctionCard
                    transaction={transaction}
                    key={index}
                    style={[
                      styles.transaction,
                      {
                        borderBottomWidth:
                          index !== lastTransactions.length - 1 ? 1 : 0,
                      },
                    ]}
                  />
                );
              }
            )}
          </>
        )}
      </View>
    </>
  );
};
export default LastTransactions;
