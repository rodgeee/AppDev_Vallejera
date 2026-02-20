import React, { useState } from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils';
import images from '../../utils/images';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [accepted, setAccepted] = useState(false);

    const navigation = useNavigation();

    const onRegister = () => {
        if (!firstName || !lastName || !birthdate) {
            Alert.alert('Missing fields', 'Please fill First Name, Last Name and Birthdate');
            return;
        }
        if (!accepted) {
            Alert.alert('Terms', 'You must accept terms and conditions to register');
            return;
        }

        Alert.alert('Success', 'Registration complete');
        navigation.navigate(ROUTES.LOGIN);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}>
            <View style={{ width: '100%' }}>
                <Image
                    source={images.LOGO}
                    style={{
                        width: 100,
                        height: 100,
                        marginBottom: 30,
                        borderRadius: 50,
                        alignSelf: 'center',
                    }}
                />
                
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        marginBottom: 20,
                        color: '#000',
                        textAlign: 'center',
                    }}
                >
                    Register
                </Text>
                
                <CustomTextInput
                    label={'First Name'}
                    placeholder={'Enter First Name'}
                    onChangeText={setFirstName}
                    containerStyle={{ padding: 6 }}
                />

                <CustomTextInput
                    label={'Middle Name'}
                    placeholder={'Enter Middle Name'}
                    onChangeText={setMiddleName}
                    containerStyle={{ padding: 6 }}
                />

                <CustomTextInput
                    label={'Last Name'}
                    placeholder={'Enter Last Name'}
                    onChangeText={setLastName}
                    containerStyle={{ padding: 6 }}
                />

                <CustomTextInput
                    label={'Birthdate'}
                    placeholder={'YYYY-MM-DD'}
                    onChangeText={setBirthdate}
                    containerStyle={{ padding: 6 }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
                    <TouchableOpacity
                        onPress={() => setAccepted(!accepted)}
                        style={{
                            width: 22,
                            height: 22,
                            borderWidth: 1,
                            borderColor: '#555',
                            backgroundColor: accepted ? '#16A34A' : 'transparent',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4,
                        }}
                    >
                        {accepted ? <Text style={{ color: 'white', fontSize: 16 }}>✓</Text> : null}
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 10 }}>I accept the Terms and Conditions</Text>
                </View>

                <CustomButton
                    label={'REGISTER'}
                    mainStyle={{ backgroundColor: '#0583F2', borderRadius: 8, width: '85%', alignSelf: 'center', paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                    textStyle={{ color: 'white', fontWeight: 'bold' }}
                    onPress={onRegister}
                />
            </View>
        </ScrollView>
    );
};

export default Register;