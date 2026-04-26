import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { authLogout } from '../app/sagas/actions';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

export default function ErrorScreen() {
  const dispatch = useDispatch();
  const { isError, error } = useSelector((state: any) => state.auth || {});

  if (!isError) return null;

  const message =
    typeof error === 'string' && error.trim().length ? error.trim() : 'Something went wrong';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['top']}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.xl }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.xl,
            ...SHADOWS.md,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: COLORS.text,
              marginBottom: SPACING.sm,
            }}
          >
            Error Screen
          </Text>

          <Text
            style={{
              color: '#c62828',
              fontSize: 14,
              fontWeight: '600',
              marginBottom: SPACING.lg,
            }}
          >
            {message}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => dispatch(authLogout())}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: SPACING.md,
              paddingHorizontal: SPACING.xl,
              borderRadius: RADIUS.md,
              alignItems: 'center',
              justifyContent: 'center',
              ...SHADOWS.sm,
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

