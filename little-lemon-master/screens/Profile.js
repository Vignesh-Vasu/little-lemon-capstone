import * as React from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { validateEmail, calculateImageText } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Checkbox from 'expo-checkbox';
import styles from '../assets/styles';
import Navbar from '../components/Navbar';
import { Avatar } from '../components/Avatar';

function Profile({ navigation }) {
    const [storedUserData, setStoredUserData] = React.useState({
        firstName: '',
        lname: '',
        mail: '',
        phone: '',
        imagePath: ''
    });

    const [name, onChangeName] = React.useState('');
    const [isNameValid, setIsNameValid] = React.useState(true);
    const [lname,onChangeLname] = React.useState('');
    const [isLnameValid, setIsLnameValid] = React.useState(true);
    const [email, onChangeEmail] = React.useState('');
    const [isMailValid, setIsMailValid] = React.useState(true);
    const [nameErrorText, setNameErrorText] = React.useState('');
    const [lnameErrorText, setLnameErrorText] = React.useState('');
    const [phone, onChangePhone] = React.useState('');
    const [isPhoneValid, setIsPhoneValid] = React.useState(true);
    const [imagePath, setImagePath] = React.useState('');
    const [imageText, setImageText] = React.useState('');

    const [preferences, setPreferences] = React.useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });
    const [savedPreferences, setSavedPreferences] = React.useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });

    const updateState = (key) => () =>
        setPreferences((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));

    React.useEffect(() => {
        (async () => {
            try {
                let loadedUserData = await AsyncStorage.getItem("userData");
                if (loadedUserData != null) {
                    loadedUserData = JSON.parse(loadedUserData);
                    if (loadedUserData.firstName) handleNameEdit(loadedUserData.firstName);
                    if (loadedUserData.lname) handleLastNameEdit(loadedUserData.lname);
                    if (loadedUserData.mail) handleMailEdit(loadedUserData.mail);
                    if (loadedUserData.phone) handlePhoneEdit(loadedUserData.phone);
                    if (loadedUserData.imagePath) setImagePath(loadedUserData.imagePath);

                    setStoredUserData({
                        firstName: loadedUserData.firstName,
                        lname: loadedUserData.lname,
                        mail: loadedUserData.mail,
                        phone: loadedUserData.phone,
                        imagePath: loadedUserData.imagePath
                    });

                    // Setting the image
                    setImageText(calculateImageText(loadedUserData.imagePath, loadedUserData.lname, loadedUserData.firstName));

                    const loadedPref = await AsyncStorage.getItem("preferences");
                    setPreferences(loadedPref === null ? [] : JSON.parse(loadedPref));
                    setSavedPreferences(loadedPref === null ? [] : JSON.parse(loadedPref));
                }
            }
            catch (err) { console.log(err); }
        })();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImagePath('');
        setImageText(calculateImageText('', lname, name));
    }

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
        if (validateEmail(text)) setIsMailValid(true);
        else setIsMailValid(false);
    }
    const handlePhoneEdit = (text) => {
        onChangePhone(text);
        if (text.length === 10) setIsPhoneValid(true);
        else setIsPhoneValid(false);
    }

    const discardChanges = () => {
        handleNameEdit(storedUserData.firstName);
        handleLastNameEdit(storedUserData.lname);
        handlePhoneEdit(storedUserData.phone);
        handleMailEdit(storedUserData.mail);
        setImagePath(storedUserData.imagePath);
        setImageText(calculateImageText(storedUserData.imagePath, storedUserData.lname, storedUserData.firstName));
        setPreferences(savedPreferences);
        Toast.show({
            type: 'success',
            text1: 'Updates discarded',
            text2: 'Data updated you made were discarded'
        });
    }

    const saveChanges = async () => {
        try {
            Toast.show({
                type: 'info',
                text1: 'Updating',
                text2: 'Updating your information'
            });
            let userData = {
                firstName: name,
                lname: lname,
                mail: email,
                phone: phone,
                imagePath: imagePath
            };
            const savedPref = JSON.stringify(preferences)
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            await AsyncStorage.setItem("preferences", savedPref);
            setStoredUserData(userData);
            Toast.show({
                type: 'success',
                text1: 'Updated',
                text2: 'Data updated successfully 👋'
            });
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to update',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }
    const logout = async () => {
        try {
            await AsyncStorage.clear();
            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'Logged out successfully'
            });
            let wentToNewTab = false;
            setInterval(() => {
                if (!wentToNewTab) {
                    navigation.push('Onboarding');
                    wentToNewTab = true;
                }
            }, 1000);
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to log out',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }
    function goToProfile() {
    }
    function goToHome() {
        navigation.push('Home');
    }

    return (
        <View style={styles.container}>

            <Navbar imagePath={storedUserData.imagePath} imageText={imageText} goToProfile={goToProfile} goToHome={goToHome} hideBack={false} />
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginVertical: 20 }}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>Avatar</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 10
                            }}>
                            <Avatar path={imagePath} text={imageText} />
                            <Pressable style={styles.buttonPrimary} onPress={pickImage}>
                                <Text style={styles.buttonText}>Change</Text>
                            </Pressable>
                            <Pressable style={styles.buttonSecondary} onPress={removeImage}>
                                <Text style={styles.buttonTextSecondary}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 16 }}>First Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Type your first name'
                            value={name}
                            onChangeText={text => handleNameEdit(text)}
                            maxLength={100}
                            keyboardType='default' />
                        <Text style={{ color: '#DC4C64' }}>{nameErrorText}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 16 }}>Last Name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Type your last name'
                            value={lname}
                            onChangeText={text => handleLastNameEdit(text)}
                            maxLength={50}
                            keyboardType='default' />
                        <Text style={{ color: '#DC4C64' }}>{lnameErrorText}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 16 }}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Type your email'
                            value={email}
                            onChangeText={text => handleMailEdit(text)}
                            maxLength={50}
                            keyboardType='email-address' />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 16 }}>Phone Number</Text>
                        <MaskedTextInput
                            style={styles.textInput}
                            placeholder='Type your phone number'
                            mask='(999) 999-9999'
                            value={phone}
                            onChangeText={(text, rawText) => handlePhoneEdit(rawText)}
                            keyboardType='number-pad' />
                    </View>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.sectionTitle}>Email Notifications</Text>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('orderStatus')}>
                        <Checkbox
                            value={preferences.orderStatus}
                            onValueChange={updateState('orderStatus')}
                        />
                        <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Order status</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('passwordChanges')}>
                        <Checkbox
                            value={preferences.passwordChanges}
                            onValueChange={updateState('passwordChanges')}
                        />
                        <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Password Changes</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('specialOffers')}>
                        <Checkbox
                            value={preferences.specialOffers}
                            onValueChange={updateState('specialOffers')}
                        />
                        <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Special Offers</Text>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }} onPressIn={updateState('newsletter')}>
                        <Checkbox
                            value={preferences.newsletter}
                            onValueChange={updateState('newsletter')}
                        />
                        <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Newsletter</Text>
                    </Pressable>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Pressable
                        style={styles.buttonSecondary}
                        onPressIn={discardChanges}>
                        <Text style={styles.buttonTextSecondary}>Discard</Text>
                    </Pressable>
                    <Pressable
                        style={() => isNameValid && isMailValid && isPhoneValid && isLnameValid ? styles.buttonPrimary : styles.buttonDisabled}
                        disabled={!isNameValid || !isMailValid || !isPhoneValid || !isLnameValid}
                        onPressIn={saveChanges}>
                        <Text style={styles.buttonText}>Save</Text>
                    </Pressable>
                </View>
                <View style={{ marginVertical: 20 }}>
                    <Pressable
                        style={styles.buttonPrimary2}
                        onPressIn={logout}>
                        <Text style={styles.buttonTextSecondary}>Log Out</Text>
                    </Pressable>
                </View>
            </ScrollView>
            <Toast />
        </View>
    )
}

export default Profile;