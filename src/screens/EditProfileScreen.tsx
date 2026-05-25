import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile, updateProfile } from '../app/api/profile';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useAppAlert } from '../app/context/AppAlertContext';
import CustomButton from '../Components/CustomButton';
import CustomTextInput from '../Components/CustomTextInput';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const p = await fetchProfile(token);
      setFullName(p.fullName);
      setEmail(p.email);
      setPhoneNumber(p.phoneNumber ?? '');
      setShoeSize(p.shoeSize ?? '');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!token || !fullName.trim() || !email.trim()) {
      alert('Missing fields', 'Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(token, {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || null,
        shoeSize: shoeSize.trim() || null,
      });
      alert('Saved', 'Your profile was updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: unknown) {
      alert('Error', e instanceof Error ? e.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile…" />;
  }
  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: SPACING.xl }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.xl,
            ...SHADOWS.md,
          }}
        >
          <CustomTextInput label="Full name" value={fullName} onChangeText={setFullName} />
          <CustomTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomTextInput
            label="Phone"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <CustomTextInput label="Shoe size" value={shoeSize} onChangeText={setShoeSize} />
          <CustomButton
            label={saving ? 'Saving…' : 'Save changes'}
            mainStyle={{ marginTop: SPACING.lg, width: '100%', opacity: saving ? 0.7 : 1 }}
            disabled={saving}
            onPress={save}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
