import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { fetchProfile } from '../app/api/profile';
import type { CustomerProfile } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useLogout } from '../app/hooks/useLogout';
import MenuRow from '../Components/app/MenuRow';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { ROUTES } from '../utils';
import { formatDate } from '../utils/format';
import { getInitials, greetingForHour } from '../utils/strings';
import { COLORS, RADIUS, SPACING, TYPO } from '../utils/theme';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const logout = useLogout();
  const token = useAuthToken();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Not signed in.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchProfile(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingState message="Loading account…" />;
  }

  if (error || !profile) {
    return (
      <ErrorState
        message={error || 'Profile unavailable.'}
        onRetry={load}
        onSignOut={logout}
      />
    );
  }

  const firstName = profile.fullName.trim().split(/\s+/)[0] || 'there';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: SPACING.md,
              paddingTop: SPACING.md,
              paddingBottom: SPACING.xl,
              borderBottomLeftRadius: RADIUS.xl,
              borderBottomRightRadius: RADIUS.xl,
            }}
          >
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{greetingForHour()}</Text>
            <Text style={{ ...TYPO.title, color: COLORS.white, marginTop: 4 }}>Hi, {firstName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg, gap: SPACING.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white }}>
                  {getInitials(profile.fullName)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.white }}>{profile.fullName}</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{profile.email}</Text>
                {profile.shoeSize ? (
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                    Size {profile.shoeSize}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: SPACING.md,
              marginTop: -SPACING.lg,
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
            }}
          >
            <MenuRow
              icon="receipt-outline"
              label="Orders"
              subtitle="Track purchases & history"
              onPress={() => navigation.navigate(ROUTES.ORDERS)}
            />
            <MenuRow
              icon="location-outline"
              label="Addresses"
              subtitle="Shipping & delivery"
              onPress={() => navigation.navigate(ROUTES.ADDRESSES)}
            />
            <MenuRow
              icon="create-outline"
              label="Edit profile"
              subtitle="Name, phone, shoe size"
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            />
            <MenuRow
              icon="sparkles-outline"
              label="Care Lab bookings"
              subtitle="Track your shoe cleaning jobs"
              onPress={() => navigation.navigate(ROUTES.CARE_LAB_BOOKINGS)}
              showDivider={false}
            />
          </View>

          <View
            style={{
              marginHorizontal: SPACING.md,
              marginTop: SPACING.md,
              backgroundColor: COLORS.white,
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: SPACING.sm }}>
              MEMBER INFO
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.text }}>
              Member since {formatDate(profile.createdAt)}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.text, marginTop: 4 }}>
              {profile.isVerified ? 'Verified account' : 'Email verification pending'}
            </Text>
          </View>

          <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.lg }}>
            <CustomButton
              label="Sign out"
              variant="dark"
              mainStyle={{
                width: '100%',
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              textStyle={{ color: COLORS.errorText }}
              onPress={logout}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
