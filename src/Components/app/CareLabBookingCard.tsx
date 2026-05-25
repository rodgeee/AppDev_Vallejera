import React from 'react';
import { Text, View } from 'react-native';
import type { ServiceBooking } from '../../app/api/types';
import { COLORS, RADIUS, SPACING } from '../../utils/theme';

type Props = {
  booking: ServiceBooking;
};

export default function CareLabBookingCard({ booking }: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>{booking.shoeName}</Text>
      <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>{booking.packageName}</Text>
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: SPACING.sm,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: RADIUS.full,
          backgroundColor: COLORS.primaryLight,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{booking.status}</Text>
      </View>
      <View
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: COLORS.border,
          marginTop: SPACING.sm,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${Math.min(100, Math.max(0, booking.progress))}%`,
            height: '100%',
            backgroundColor: COLORS.primary,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>{booking.phase}</Text>
      {booking.note ? (
        <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 18 }}>
          {booking.note}
        </Text>
      ) : null}
    </View>
  );
}
