import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

type Props = { message?: string };

const LoadingState = ({ message = 'Loading…' }: Props) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={{ marginTop: SPACING.md, color: COLORS.textMuted, fontSize: 14 }}>{message}</Text>
  </View>
);

export default LoadingState;
