import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchServiceBookings } from '../app/api/serviceBookings';
import type { ServiceBooking } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import CareLabBookingCard from '../Components/app/CareLabBookingCard';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { ROUTES } from '../utils';
import { COLORS, RADIUS, SPACING, TYPO } from '../utils/theme';

export default function CareLabBookingsScreen() {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setError(null);
    try {
      setBookings(await fetchServiceBookings(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading && bookings.length === 0) {
    return <LoadingState message="Loading your bookings…" />;
  }

  if (error && bookings.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.xxl, gap: SPACING.md }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: RADIUS.lg,
              padding: SPACING.lg,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(255,255,255,0.75)' }}>
              CARE LAB
            </Text>
            <Text style={{ ...TYPO.title, color: COLORS.white, marginTop: SPACING.sm }}>Your bookings</Text>
            <Text style={{ fontSize: 14, lineHeight: 21, color: 'rgba(255,255,255,0.88)', marginTop: SPACING.sm }}>
              Track lab progress for pairs you submitted. Status updates when staff move your job on the
              dashboard.
            </Text>
          </View>

          {bookings.length === 0 ? (
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.lg,
                padding: SPACING.xl,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center' }}>
                No Care Lab bookings yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: SPACING.sm,
                  lineHeight: 21,
                }}
              >
                Open Care Lab from the home screen to browse packages and submit a new booking.
              </Text>
              <CustomButton
                label="Go to Care Lab on Home"
                mainStyle={{ marginTop: SPACING.lg, width: '100%' }}
                onPress={() => navigation.navigate(ROUTES.SHOE_SERVICES)}
              />
            </View>
          ) : (
            <>
              <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                {bookings.length} booking{bookings.length === 1 ? '' : 's'} — pull down to refresh
              </Text>
              {bookings.map((b) => (
                <CareLabBookingCard key={b.id} booking={b} />
              ))}
              <CustomButton
                label="Book another service"
                mainStyle={{
                  width: '100%',
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
                textStyle={{ color: COLORS.primary, fontWeight: '700' }}
                onPress={() => navigation.navigate(ROUTES.SHOE_SERVICES)}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
