import { StyleSheet, Dimensions } from "react-native"
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';

const width: number = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    container: {
        /*  */
        position: 'relative',
        marginBottom: 10,
        borderRadius: 16,
        padding: 10,
        /* overflow: 'hidden', */
        shadowColor: Colors.blackBackground,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    card: {
        width: width * 0.75,
        height: width * 0.48,
        position: 'relative',
        backgroundColor: Colors.blackBackground,
        borderRadius: 16,
        overflow: 'hidden',
    },
    circle: {
        width: width * 0.5,
        height: width * 0.5,
        position: 'absolute',
        backgroundColor: 'rgba(249, 249, 251, .2)',
        borderRadius: width,
        zIndex: 10,
        top: 0,
        left: '-3%',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: Colors.transparent,
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: width * 0.25,
        borderBottomWidth: width * 0.5,
        borderLeftWidth: width * 0.25,
        borderTopColor: Colors.transparent,
        borderRightColor: Colors.transparent,
        borderBottomColor: 'rgba(249, 249, 251, .2)',
        borderLeftColor: Colors.transparent,
        position: 'absolute',
        transform: [{ rotate: "90deg" }],
        zIndex: 10,
        top: 0,
        left: "-3%",
    },
    square: {
        width: width * 0.22,
        height: width * 0.5,
        position: 'absolute',
        backgroundColor: 'rgba(249, 249, 251, .2)',
        zIndex: 10,
        top: 0,
        left: 0,
    },
    containerItems: {
        width: '100%',
        height: '100%',
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 5,
        justifyContent: 'space-between',
    },
    containerMod: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: width * .025
    },
    textTop: {
        fontFamily: "DosisBold",
        color: Colors.blackBackground,
    },
    containerIcon: {
        backgroundColor: "rgba(0,0,0,.4)",
        position: "absolute",
        zIndex: 20,
        paddingVertical: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    containerCenter: {
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        height: 30,
        width: 30,
        tintColor: Colors.blackBackground,
    },
    logo: {
        height: width * 0.15,
        width: width * 0.4,
    },
});
