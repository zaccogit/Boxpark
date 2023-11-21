import { View, Text, StyleSheet, ViewStyle, Dimensions } from "react-native";
import React, { useMemo, useContext } from "react";
import { Colors } from "../utils";
import { Images } from "../../assets";
import { LastTransaction } from "./LastTransactions/LastTransactionsInterfaces";
import moment from "moment";
import { SesionContext } from "../contexts";
import { Image } from "expo-image";

interface Props {
  transaction: LastTransaction;
  style?: ViewStyle | ViewStyle[];
}

const width: number = Dimensions.get("window").width;
const TransacctionCard = ({ transaction, style }: Props) => {
  const { sesion } = useContext(SesionContext);
  const date = useMemo(
    () => moment(transaction.aprovedDate).format("DD/MM/YYYY"),
    [transaction]
  );
  const hour = useMemo(
    () => moment(transaction.aprovedDate).format("hh:ss:mm a"),
    [transaction]
  );
  console.log(transaction)

  if (transaction.transactionTypeId === 7) {
    //RECARGA MANUAL
    return (
      <View style={style}>
        <Image
          style={styles.imageProfile}
          source={
            transaction?.profileImage
              ? { uri: transaction?.profileImage }
              : Images.Profile
          }
          contentFit="cover"
        />
        <View style={{ width: width * 0.5, paddingHorizontal: 10 }}>
          <Text
            style={[
              styles.text,
              { fontFamily: "DosisSemiBold", textTransform: "capitalize" },
            ]}
            numberOfLines={1}
          >
            {transaction?.destionationName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Dosis",
                fontSize: 13,
                textTransform: "capitalize",
              },
            ]}
            numberOfLines={1}
          >
            {transaction.transactionTypeName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Dosis",
                fontSize: 13,
                textTransform: "capitalize",
              },
            ]}
            numberOfLines={1}
          >
            {transaction.transactionNumber.split("_")[1]}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.text, { fontFamily: "Dosis" }]}>{date}</Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "DosisBold",
                color: "green",
                marginVertical: 5,
              },
            ]}
          >
            + {transaction.amount} {transaction?.simbol}
          </Text>
          <Text style={[styles.text, { fontFamily: "Dosis", fontSize: 13 }]}>
            {hour}
          </Text>
        </View>
      </View>
    );
  }

  if (transaction.transactionTypeId === 4) {
    //TRANSFERENCIA
    if (Number(sesion?.id) === Number(transaction.userSourceId)) {
      return (
        <View style={style}>
          <Image
            style={styles.imageProfile}
            source={
              transaction?.profileImage
                ? { uri: transaction?.profileImage }
                : Images.Profile
            }
            contentFit="cover"
          />
          <View style={{ width: width * 0.5, paddingHorizontal: 10 }}>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: "DosisSemiBold",
                  textTransform: "capitalize",
                },
              ]}
              numberOfLines={1}
            >
              {transaction?.destionationName}
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: "Dosis",
                  fontSize: 13,
                  textTransform: "capitalize",
                },
              ]}
              numberOfLines={1}
            >
              {transaction.transactionTypeName}
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: "Dosis",
                  fontSize: 13,
                  textTransform: "capitalize",
                },
              ]}
              numberOfLines={1}
            >
              {transaction.transactionNumber.split("_")[1]}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.text, { fontFamily: "Dosis" }]}>{date}</Text>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: "DosisBold",
                  color: Colors.danger,
                  marginVertical: 5,
                },
              ]}
            >
              - {transaction.amount} {transaction?.simbol}
            </Text>
            <Text style={[styles.text, { fontFamily: "Dosis", fontSize: 13 }]}>
              {hour}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={style}>
        <Image
          style={styles.imageProfile}
          source={
            transaction?.profileImageOrigen
              ? { uri: transaction?.profileImageOrigen }
              : Images.Profile
          }
          contentFit="cover"
        />
        <View style={{ width: width * 0.5, paddingHorizontal: 10 }}>
          <Text
            style={[
              styles.text,
              { fontFamily: "DosisSemiBold", textTransform: "capitalize" },
            ]}
            numberOfLines={1}
          >
            {transaction?.origenName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Dosis",
                fontSize: 13,
                textTransform: "capitalize",
              },
            ]}
            numberOfLines={1}
          >
            {transaction.transactionTypeName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "Dosis",
                fontSize: 13,
                textTransform: "capitalize",
              },
            ]}
          >
            {transaction.transactionNumber.split("_")[1]}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.text, { fontFamily: "Dosis" }]}>{date}</Text>
          <Text
            style={[
              styles.text,
              {
                fontFamily: "DosisBold",
                color: "green",
                marginVertical: 5,
              },
            ]}
            numberOfLines={1}
          >
            + {transaction.amount} {transaction?.simbol}
          </Text>
          <Text style={[styles.text, { fontFamily: "Dosis", fontSize: 13 }]}>
            {hour}
          </Text>
        </View>
      </View>
    );
  }

  //DEFAULT
  return (
    <View style={style}>
      <Image
        style={styles.imageProfile}
        source={
          transaction?.profileImage
            ? { uri: transaction?.profileImage }
            : Images.Profile
        }
        contentFit="cover"
      />
      <View style={{ width: width * 0.5, paddingHorizontal: 10 }}>
        <Text
          style={[
            styles.text,
            { fontFamily: "DosisSemiBold", textTransform: "capitalize" },
          ]}
          numberOfLines={1}
        >
          {transaction?.destionationName}
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontFamily: "Dosis",
              fontSize: 13,
              textTransform: "capitalize",
            },
          ]}
          numberOfLines={1}
        >
          {transaction.transactionTypeName}
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontFamily: "Dosis",
              fontSize: 13,
              textTransform: "capitalize",
            },
          ]}
          numberOfLines={1}
        >
          {transaction.transactionNumber.split("_")[1]}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.text, { fontFamily: "Dosis" }]}>{date}</Text>
        <Text
          style={[
            styles.text,
            {
              fontFamily: "DosisBold",
              color: Colors.danger,
              marginVertical: 5,
            },
          ]}
        >
          - {transaction.amount} {transaction?.simbol}
        </Text>
        <Text style={[styles.text, { fontFamily: "Dosis", fontSize: 13 }]}>
          {hour}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 13,
    width: "100%",
  },
  transaction: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    padding: 15,
    borderColor: "rgba(66, 66, 66, .5)",
    borderStyle: "solid",
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },
});

export default TransacctionCard;
