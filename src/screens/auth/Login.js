import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import CustomTextInput from '../../Components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils';
import CustomButton from '../../Components/CustomButton';
import images from '../../utils/images';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation()


  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
      }}
    >
      <Image
        source={images.LOGO}
        style={{
          width: 100,
          height: 100,
          marginBottom: 40,
          borderRadius: 50,
          alignSelf: 'center',
        }}
      />

      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 30,
          color: '#000',
          alignSelf: 'center',
        }}
      >
        Login
      </Text>
      
      <CustomTextInput
        label={"Username"}
        placeholder={"Enter your username"}
        onChangeText={setUsername}
        textStyle={{ color: '#000', fontSize: 14, marginBottom: 8 }}
        TextInputStyle={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          paddingHorizontal: 0,
          paddingVertical: 16,
          fontSize: 16,
          marginBottom: 20,
          width: '100%',
        }}
      />
      
      <CustomTextInput
        label={"Password"}
        placeholder={"Enter your password"}
        onChangeText={setPassword}
        textStyle={{ color: '#000', fontSize: 14, marginBottom: 8 }}
        TextInputStyle={{
          borderWidth: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          paddingHorizontal: 0,
          paddingVertical: 16,
          fontSize: 16,
          marginBottom: 30,
          width: '100%',
        }}
      />
      
      <CustomButton
        label={"Login"}
        mainStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          backgroundColor: '#0583F2',
          borderRadius: 8,
          width: '100%',
          alignSelf: 'center',
        }}
        textStyle={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
        }}
        route={ROUTES.HOME}
      />
      
      <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: '#666', fontSize: 14 }}>Don't have an account? </Text>
        <CustomButton
          label={"Register"}
          mainStyle={{
            paddingVertical: 4,
          }}
          textStyle={{
            color: '#000',
            fontSize: 14,
            fontWeight: '600',
            textDecorationLine: 'underline',
          }}
          route={ROUTES.REGISTER}
        />
      </View>
    </View>
  );
}