import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../utils';
import images from '../../utils/images';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [accepted, setAccepted] = useState(false);

  const navigation = useNavigation<any>();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: SPACING.xl,
            paddingBottom: SPACING.xxl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.xl,
              padding: SPACING.xl,
              ...SHADOWS.md,
            }}
          >
            <Image
              source={images.LOGO}
              style={{
                width: 72,
                height: 72,
                marginBottom: SPACING.lg,
                borderRadius: RADIUS.md,
                alignSelf: 'center',
              }}
            />

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                marginBottom: SPACING.xl,
                color: COLORS.text,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              Create account
            </Text>

            <CustomTextInput
              label="First Name"
              placeholder="Enter First Name"
              value={firstName}
              onChangeText={setFirstName}
            />

            <CustomTextInput
              label="Middle Name"
              placeholder="Enter Middle Name (optional)"
              value={middleName}
              onChangeText={setMiddleName}
            />

            <CustomTextInput
              label="Last Name"
              placeholder="Enter Last Name"
              value={lastName}
              onChangeText={setLastName}
            />

            <CustomTextInput
              label="Birthdate"
              placeholder="YYYY-MM-DD"
              value={birthdate}
              onChangeText={setBirthdate}
            />

            <TouchableOpacity
              onPress={() => setAccepted(!accepted)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: SPACING.lg,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: accepted ? COLORS.success : COLORS.border,
                  backgroundColor: accepted ? COLORS.success : COLORS.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: RADIUS.sm,
                }}
              >
                {accepted ? (
                  <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: '700' }}>✓</Text>
                ) : null}
              </View>
              <Text
                style={{
                  marginLeft: SPACING.md,
                  color: COLORS.text,
                  fontSize: 14,
                }}
              >
                I accept the Terms and Conditions
              </Text>
            </TouchableOpacity>

            <CustomButton
              label="Register"
              mainStyle={{
                width: '100%',
              }}
              textStyle={{ color: COLORS.white, fontWeight: '600' }}
              onPress={onRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
