import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextInput from '../../Components/CustomTextInput';
import { ROUTES } from '../../utils';
import CustomButton from '../../Components/CustomButton';
import images from '../../utils/images';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../utils/theme';
import { authLogin } from '../../app/sagas/actions';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { data: authData, isLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (authData && !isLoading) {
      navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME }] });
    }
  }, [authData, isLoading, navigation]);

  const MIN_PASSWORD_LENGTH = 13;

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing credentials', 'Please enter both email and password.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        'Password too short',
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }
    dispatch(authLogin({ email: trimmedEmail, password }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: SPACING.xl,
            paddingVertical: SPACING.xxl,
            justifyContent: 'center',
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
                width: 88,
                height: 88,
                marginBottom: SPACING.xl,
                borderRadius: RADIUS.lg,
                alignSelf: 'center',
              }}
            />
{/* 
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                marginBottom: SPACING.xl,
                color: COLORS.text,
                alignSelf: 'center',
                letterSpacing: 0.5,
              }}
            >
              Welcome back
            </Text>
 */}
            <CustomTextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />

            <CustomTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text: string) => {
                // Defer state update to fix Android dropping 13th character with secureTextEntry
                setTimeout(() => setPassword(text), 0);
              }}
              secureTextEntry
              maxLength={128}
            />
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: 12,
                marginTop: -SPACING.sm,
                marginBottom: SPACING.sm,
              }}
            >
              {' '}
            </Text>

            <CustomButton
              label={isLoading ? 'Signing in...' : 'Login'}
              mainStyle={{
                marginTop: SPACING.md,
                width: '100%',
                opacity:
                  !email.trim() || !password || password.length < MIN_PASSWORD_LENGTH || isLoading
                    ? 0.6
                    : 1,
              }}
              onPress={handleLogin}
              disabled={
                !email.trim() ||
                !password ||
                password.length < MIN_PASSWORD_LENGTH ||
                isLoading
              }
            />
            {isLoading && (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ marginTop: SPACING.sm }}
              />
            )}
          </View>

          <View
            style={{
              marginTop: SPACING.xl,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: COLORS.textSecondary, fontSize: 15 }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 15,
                  fontWeight: '600',
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
