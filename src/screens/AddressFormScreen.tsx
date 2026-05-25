import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  createAddress,
  fetchAddress,
  updateAddress,
  type AddressPayload,
} from '../app/api/addresses';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useAppAlert } from '../app/context/AppAlertContext';
import CustomButton from '../Components/CustomButton';
import CustomTextInput from '../Components/CustomTextInput';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

const AddressFormScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const addressId = route.params?.addressId as number | undefined;
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const isEdit = addressId != null;

  const [label, setLabel] = useState('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Philippines');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !addressId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const a = await fetchAddress(token, addressId);
      setLabel(a.label);
      setAddressLine1(a.addressLine1);
      setAddressLine2(a.addressLine2 ?? '');
      setCity(a.city);
      setProvince(a.province ?? '');
      setPostalCode(a.postalCode ?? '');
      setCountry(a.country);
      setContactPhone(a.contactPhone ?? '');
      setContactEmail(a.contactEmail ?? '');
      setIsDefault(a.isDefault);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load address.');
    } finally {
      setLoading(false);
    }
  }, [token, addressId]);

  useEffect(() => {
    load();
  }, [load]);

  const buildPayload = (): AddressPayload => ({
    label: label.trim(),
    addressLine1: addressLine1.trim(),
    addressLine2: addressLine2.trim() || null,
    city: city.trim(),
    province: province.trim() || null,
    postalCode: postalCode.trim() || null,
    country: country.trim() || 'Philippines',
    contactPhone: contactPhone.trim() || null,
    contactEmail: contactEmail.trim() || null,
    isDefault,
  });

  const save = async () => {
    if (!token) {
      return;
    }
    if (!label.trim() || !addressLine1.trim() || !city.trim()) {
      alert('Missing fields', 'Label, address line 1, and city are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEdit && addressId) {
        await updateAddress(token, addressId, payload);
      } else {
        await createAddress(token, payload);
      }
      route.params?.onSaved?.();
      navigation.goBack();
    } catch (e: unknown) {
      alert('Error', e instanceof Error ? e.message : 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading address…" />;
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
          <CustomTextInput label="Label" value={label} onChangeText={setLabel} placeholder="Home, Work…" />
          <CustomTextInput
            label="Address line 1"
            value={addressLine1}
            onChangeText={setAddressLine1}
          />
          <CustomTextInput
            label="Address line 2"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Optional"
          />
          <CustomTextInput label="City" value={city} onChangeText={setCity} />
          <CustomTextInput label="Province" value={province} onChangeText={setProvince} />
          <CustomTextInput label="Postal code" value={postalCode} onChangeText={setPostalCode} />
          <CustomTextInput label="Country" value={country} onChangeText={setCountry} />
          <CustomTextInput
            label="Contact phone"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
          <CustomTextInput
            label="Contact email"
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: SPACING.md,
            }}
          >
            <Text style={{ fontSize: 15, color: COLORS.text }}>Default address</Text>
            <Switch value={isDefault} onValueChange={setIsDefault} />
          </View>
          <CustomButton
            label={saving ? 'Saving…' : isEdit ? 'Update address' : 'Add address'}
            mainStyle={{ width: '100%', opacity: saving ? 0.7 : 1 }}
            disabled={saving}
            onPress={save}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressFormScreen;
