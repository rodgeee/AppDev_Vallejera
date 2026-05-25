import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { deleteAddress, fetchAddresses } from '../app/api/addresses';
import type { CustomerAddress } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useAppAlert } from '../app/context/AppAlertContext';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { ROUTES } from '../utils';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

const AddressesScreen = () => {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setAddresses(await fetchAddresses(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const confirmDelete = (id: number) => {
    alert('Delete address', 'Remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!token) {
            return;
          }
          try {
            await deleteAddress(token, id);
            load();
          } catch (e: unknown) {
            alert('Error', e instanceof Error ? e.message : 'Could not delete.');
          }
        },
      },
    ]);
  };

  if (loading && addresses.length === 0) {
    return <LoadingState message="Loading addresses…" />;
  }

  if (error && addresses.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['bottom']}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={load}
        ListHeaderComponent={
          <CustomButton
            label="+ Add address"
            mainStyle={{ marginBottom: SPACING.md, width: '100%' }}
            onPress={() => navigation.navigate(ROUTES.ADDRESS_FORM, { onSaved: load })}
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: SPACING.xl }}>
            No saved addresses yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              marginBottom: SPACING.md,
              ...SHADOWS.sm,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontWeight: '700', color: COLORS.text }}>{item.label}</Text>
              {item.isDefault ? (
                <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600' }}>Default</Text>
              ) : null}
            </View>
            <Text style={{ fontSize: 14, color: COLORS.text }}>{item.displayLine1}</Text>
            {item.displayLine2 ? (
              <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{item.displayLine2}</Text>
            ) : null}
            {item.contactPhone ? (
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.sm }}>
                {item.contactPhone}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.lg }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTES.ADDRESS_FORM, { addressId: item.id, onSaved: load })
                }
              >
                <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AddressesScreen;
