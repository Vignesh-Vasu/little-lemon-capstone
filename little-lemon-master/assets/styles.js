import { StyleSheet } from 'react-native';

export const colors = {
    primaryGreen: '#495E57',
    primaryYellow: '#F4CE14',
    secondaryOrange: '#EE9972',
    secondaryLight: '#FBDABB',
    secondaryLightGrey: '#EDEFEE',
    secondaryDarkGrey: '#333333',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 70,
        paddingHorizontal: 1,
        backgroundColor: 'white'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'EDEFEE',
        padding: 10,
        borderBottomWidth: 0.2
    },
    logo: {
        width: 185,
        height: 40,
        alignSelf: 'center'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#EE9972',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor: '#495E57',
        color: '#FFFFFF',
        height: 100,
        textAlign: 'center',
        paddingTop: 33
    },
    textInput: {
        marginTop: 10,
        padding: 10,
        fontSize: 14,
        borderRadius: 10,
        borderWidth: 2,
    },
    buttonPrimary: {
        backgroundColor: colors.primaryYellow,
        borderRadius: 10,
        width: 350,
        margin: 27,
        paddingVertical: 5,
    },
    buttonPrimary2: {
        backgroundColor: "#F4CE14",
        borderRadius: 10,
    },
    buttonSecondary: {
        borderColor: colors.primaryGreen,
        borderWidth: 1
    },
    buttonDisabled: {
        backgroundColor: "grey",
        borderRadius: 10,
        width: 350,
        margin: 27,
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 18,
        padding: 50,
        paddingVertical: 10,
        textAlign: 'center',
        color:  '#000000'
    },
    buttonTextSecondary: {
        fontSize: 18,
        padding: 20,
        paddingVertical: 10,
        textAlign: 'center',
        color: '#333333',
    },
    subTitle: {
        fontWeight: 'medium',
        fontSize: 32,
        color: 'white',
    },
    lead: {
        fontWeight: 'medium',
        fontSize: 18,
        color: 'white',
        flex: 1
    },
});

export default styles;