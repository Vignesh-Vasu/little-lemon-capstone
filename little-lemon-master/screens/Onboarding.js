import * as React from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import styles from '../assets/styles';

function Onboarding({ navigation }) {
    const [name, onChangeName] = React.useState('');
    const [lname,onChangeLname] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [isNameValid, setIsNameValid] = React.useState(false);
    const [isLnameValid, setIsLnameValid] = React.useState(false);
    const [isMailValid, setIsMailValid] = React.useState(false);
    const [nameErrorText, setNameErrorText] = React.useState('');
    const [lnameErrorText, setLnameErrorText] = React.useState('');
    const [emailErrorText, setEmailErrorText] = React.useState('');

    const handleNameEdit = (text) => {
        onChangeName(text);
        if (text.match(/^[A-Za-z]+$/)) {
            setIsNameValid(true);
            setNameErrorText('');
        }
        else {
            setIsNameValid(false);
            setNameErrorText('Please insert your first name (in letters)');
        }
    }
    const handleLastNameEdit = (text) => {
        onChangeLname(text);
        if (text.match(/^[A-Za-z]+$/)) {
            setIsLnameValid(true);
            setLnameErrorText('');
        }
        else {
            setIsLnameValid(false);
            setLnameErrorText('Please insert your last name (in letters)');
        }
    }
    const handleMailEdit = (text) => {
        onChangeEmail(text);
        if (validateEmail(text)) {
            setIsMailValid(true);
            setEmailErrorText('');
        }
        else {
            setIsMailValid(false);
            setEmailErrorText("Please enter a valid email address");
        }
    }
    const handleSubscribeRequest = () => {
        try {
            let userData = { firstName: name, lastName: '', mail: email, phone: '', imagePath: '' };
            AsyncStorage.setItem("userData", JSON.stringify(userData));
            AsyncStorage.setItem("isOnboardingCompleted", 'true');
            let preferences = {
                orderStatus: true,
                passwordChanges: true,
                specialOffers: true,
                newsletter: true,
            };
            AsyncStorage.setItem("preferences", JSON.stringify(preferences));
            Toast.show({
                type: 'success',
                text1: 'Logging in',
                text2: 'Thanks for signing up 👋'
            });
            let wentToNewTab = false;
            setInterval(() => {
                if (!wentToNewTab) {
                    navigation.push('Home');
                    wentToNewTab = true
                }
            }, 1000);
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to log in',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
            <Image
                style={styles.logo}
                source={require('../assets/Logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
            />
            <View style={{ marginVertical: 50}}>
                <Text style={styles.sectionTitle}>Let's get to know you</Text>
            </View>
            <View >
                <Text style={{paddingHorizontal: 20, fontWeight:'bold',fontSize: 20}} >Personal information</Text>
            </View>

            <View style={{ marginVertical: 20, paddingHorizontal: 25}}>
                <Text style={{ fontSize: 20 }}>First Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Type your first name'
                    value={name}
                    onChangeText={text => handleNameEdit(text)}
                    maxLength={100}
                    keyboardType='default' />
                <Text style={{ color: '#DC4C64' }}>{nameErrorText}</Text>
            </View>
            <View style={{ paddingVertical: 20,paddingHorizontal: 25}}>
                <Text style={{ fontSize: 20 }}>Last Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Type your last name'
                    value={lname}
                    onChangeText={text => handleLastNameEdit(text)}
                    maxLength={50}
                    keyboardType='default' />
                    <Text style={{ color: '#DC4C64' }}>{lnameErrorText}</Text>
            </View>
            <View style={{ paddingVertical: 20,paddingHorizontal: 25 }}>
                    <Text style={{ fontSize: 20 }}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Type your email'
                        value={email}
                        onChangeText={text => handleMailEdit(text)}
                        maxLength={50}
                        keyboardType='email-address' />
                        <Text style={{ color: '#DC4C64' }}>{emailErrorText}</Text>
            </View>
           
            <Pressable
                style={() => isNameValid && isLnameValid && isMailValid ? styles.buttonPrimary : styles.buttonDisabled}
                disabled={!isNameValid || !isLnameValid || !isMailValid}
                onPressIn={handleSubscribeRequest}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Toast />
        </KeyboardAvoidingView>
    )
}

export default Onboarding;