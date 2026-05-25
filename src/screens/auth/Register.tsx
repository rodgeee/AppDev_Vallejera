/**
 * Customer sign up — same design system as Login (srusystem signup / login palette).
 */
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomButton from '../../Components/CustomButton';
import LoginBrandHeader from '../../Components/auth/LoginBrandHeader';
import LoginHero from '../../Components/auth/LoginHero';
import OrDivider from '../../Components/auth/OrDivider';
import GoogleSignInButton from '../../Components/auth/GoogleSignInButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { authGoogleLogin, RESET_USER_LOGIN, USER_LOGIN_COMPLETE } from '../../app/sagas/actions';
import { userLogin } from '../../app/api/auth';
import { fetchProfile } from '../../app/api/profile';
import { registerCustomer } from '../../app/api/signup';
import { ROUTES } from '../../utils';
import { COLORS, LOGIN, SPACING } from '../../utils/theme';
import { markAuthenticated } from '../../app/services/sessionAuth';
import { useAppAlert } from '../../app/context/AppAlertContext';

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { alert } = useAppAlert();
  const { isLoading: authLoading, error: authError } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!authError || submitting) {
      return;
    }
    alert('Google sign-up failed', authError);
    dispatch({ type: RESET_USER_LOGIN });
  }, [authError, submitting, alert, dispatch]);

  const onRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Missing fields', 'Please enter your first and last name.');
      return;
    }
    if (!email.trim()) {
      alert('Missing email', 'Enter the email you want to use for sign-in.');
      return;
    }
    if (!password) {
      alert('Missing password', 'Choose a password for email sign-in.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match', 'Make sure both password fields match.');
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      alert(
        'Password too weak',
        'Use at least 8 characters with uppercase, lowercase, a number, and a symbol (e.g. TestPass1!).',
      );
      return;
    }
    if (!accepted) {
      alert('Terms', 'You must accept terms and conditions to register');
      return;
    }

    setSubmitting(true);
    const trimmedEmail = email.trim();
    let signupToken: string | null = null;
    try {
      const signup = await registerCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim() || undefined,
        email: trimmedEmail,
        password,
      });
      if (signup.token && typeof signup.token === 'string') {
        signupToken = signup.token;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not create account.';
      alert('Sign up failed', msg);
      setSubmitting(false);
      return;
    }

    try {
      let token = signupToken;
      if (!token) {
        const login = await userLogin({ email: trimmedEmail, password });
        token = login.token;
      } else {
        await fetchProfile(token);
      }
      markAuthenticated();
      dispatch({
        type: USER_LOGIN_COMPLETE,
        payload: { token },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not sign in.';
      alert(
        'Almost there',
        'Your account was created. Sign in with the same email and password you just used.',
        [{ text: 'Go to sign in', onPress: () => navigation.navigate(ROUTES.LOGIN) }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignup = () => {
    if (!accepted) {
      alert('Terms', 'You must accept terms and conditions to register');
      return;
    }
    if (submitting || authLoading) {
      return;
    }
    dispatch(authGoogleLogin({ action: 'signup' }));
  };

  const formDisabled =
    submitting ||
    authLoading ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword ||
    !accepted;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
      <LoginBrandHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: COLORS.white }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.xxl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <LoginHero />

          <View
            style={{
              paddingHorizontal: LOGIN.gutterX,
              paddingTop: SPACING.lg,
              maxWidth: LOGIN.fieldMaxWidth + 32,
              width: '100%',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{
                fontSize: LOGIN.titleSize,
                fontWeight: LOGIN.titleWeight,
                letterSpacing: LOGIN.titleLetterSpacing,
                textTransform: 'uppercase',
                color: COLORS.primary,
                lineHeight: 32,
              }}
            >
              Create your account
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: LOGIN.subtitleSize,
                lineHeight: 22,
                color: COLORS.textMuted,
              }}
            >
              Sign up with email and password, or use Google. You can start shopping right after you
              create your account.
            </Text>

            <View style={{ marginTop: 28 }}>
              <CustomTextInput
                variant="login"
                label="First name"
                placeholder=""
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <CustomTextInput
                variant="login"
                label="Middle name"
                placeholder="Optional"
                value={middleName}
                onChangeText={setMiddleName}
                autoCapitalize="words"
              />
              <CustomTextInput
                variant="login"
                label="Last name"
                placeholder=""
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
              <CustomTextInput
                variant="login"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <CustomTextInput
                variant="login"
                label="Password"
                placeholder="Min. 8 chars, upper, lower, number, symbol"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
              <CustomTextInput
                variant="login"
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <CustomTextInput
                variant="login"
                label="Birthdate"
                placeholder="Optional · YYYY-MM-DD"
                value={birthdate}
                onChangeText={setBirthdate}
              />

              <TouchableOpacity
                onPress={() => setAccepted(!accepted)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderWidth: 1,
                    borderColor: accepted ? COLORS.primary : COLORS.googleBorder,
                    backgroundColor: accepted ? COLORS.primary : COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {accepted ? (
                    <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '700' }}>✓</Text>
                  ) : null}
                </View>
                <Text style={{ marginLeft: SPACING.md, color: COLORS.text, fontSize: 14 }}>
                  I accept the Terms and Conditions
                </Text>
              </TouchableOpacity>

              <CustomButton
                label={submitting ? 'Creating account…' : 'Create account'}
                variant="loginPrimary"
                mainStyle={{ width: '100%', opacity: formDisabled && !submitting ? 0.55 : 1 }}
                disabled={formDisabled}
                onPress={onRegister}
              />

              <View style={{ marginTop: 28 }}>
                <OrDivider />
                <GoogleSignInButton
                  onPress={onGoogleSignup}
                  loading={authLoading}
                  disabled={!accepted || submitting || authLoading}
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
                Signed up with Google? There is no app password — use Continue with Google on Sign in
                with the same Google account.
              </Text>
            </View>

            <Text
              style={{
                marginTop: 28,
                fontSize: 14,
                color: COLORS.textSecondary,
                lineHeight: 22,
              }}
            >
              Already have an account?{' '}
              <Text
                style={{ color: COLORS.primary, fontWeight: '700' }}
                onPress={() => navigation.navigate(ROUTES.LOGIN)}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
