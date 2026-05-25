/**
 * Customer login — mobile app layout (card form, retail branding).
 */
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import OrDivider from '../../Components/auth/OrDivider';
import GoogleSignInButton from '../../Components/auth/GoogleSignInButton';
import { IMG, ROUTES } from '../../utils';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../../utils/theme';
import { authGoogleLogin, authLogin, RESET_USER_LOGIN } from '../../app/sagas/actions';
import { useAppAlert } from '../../app/context/AppAlertContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { isLoading, error: loginError } = useSelector((state: any) => state.auth);
  const { alert } = useAppAlert();

  useEffect(() => {
    if (!loginError || isLoading) {
      return;
    }
    alert('Sign in failed', loginError);
    dispatch({ type: RESET_USER_LOGIN });
  }, [loginError, isLoading, alert, dispatch]);

  const onGoogleLogin = () => {
    if (isLoading) {
      return;
    }
    dispatch(authGoogleLogin({ action: 'login' }));
  };

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      alert('Missing credentials', 'Please enter both email and password.');
      return;
    }
    dispatch(authLogin({ email: trimmedEmail, password }));
  };

  const formDisabled = !email.trim() || !password || isLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: SPACING.xl,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View
            style={{
              paddingHorizontal: SPACING.lg,
              paddingTop: SPACING.xxl + SPACING.sm,
              paddingBottom: SPACING.md,
              alignItems: 'center',
            }}
          >
            <Image
              source={IMG.SHOESRUS_LOGO}
              style={{ width: 220, height: 72 }}
              resizeMode="contain"
              accessibilityLabel="Shoes R' Us"
            />
            <Text
              style={{
                ...TYPO.hero,
                color: COLORS.text,
                marginTop: SPACING.md,
                textAlign: 'center',
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: COLORS.textSecondary,
                marginTop: SPACING.sm,
                textAlign: 'center',
                maxWidth: 320,
              }}
            >
              Sign in to shop, track orders, and manage your account.
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: SPACING.lg,
              marginTop: SPACING.lg,
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: COLORS.border,
              ...SHADOWS.md,
            }}
          >
            <CustomTextInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <CustomTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={128}
              autoComplete="password"
            />

            <TouchableOpacity
              onPress={() =>
                alert(
                  'Reset password',
                  "Password reset is available on the Shoes R' Us website.",
                )
              }
              hitSlop={{ top: 8, bottom: 8 }}
              style={{ alignSelf: 'flex-end', marginBottom: SPACING.md, marginTop: -SPACING.xs }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>Forgot password?</Text>
            </TouchableOpacity>

            <CustomButton
              label={isLoading ? 'Signing in…' : 'Sign in'}
              mainStyle={{
                width: '100%',
                opacity: formDisabled && !isLoading ? 0.55 : 1,
              }}
              onPress={handleLogin}
              disabled={formDisabled}
            />

            <View style={{ marginTop: SPACING.lg }}>
              <OrDivider />
              <GoogleSignInButton
                onPress={onGoogleLogin}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>

            <Text
              style={{
                marginTop: SPACING.md,
                fontSize: 12,
                lineHeight: 18,
                color: COLORS.textMuted,
              }}
            >
              Use your email and password, or tap Continue with Google (no password). New Google
              users: create an account on the sign-up screen with Google first.
              New here?{' '}
              <Text
                style={{ color: COLORS.primary, fontWeight: '700' }}
                onPress={() => navigation.navigate(ROUTES.REGISTER)}
              >
                Create an account
              </Text>
              .
            </Text>
          </View>

          <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center' }}>
              Need help? Visit the Contact page on the Shoes R&apos; Us website.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
