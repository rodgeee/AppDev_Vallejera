import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../../utils/theme';
import GoogleIcon from './GoogleIcon';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function GoogleSignInButton({ onPress, disabled, loading }: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 18,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.googleBorder,
        borderRadius: RADIUS.md,
        opacity: isDisabled ? 0.6 : 1,
      }}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.textMuted} />
      ) : (
        <GoogleIcon size={18} />
      )}
      <Text style={{ color: '#374151', fontSize: 14, fontWeight: '600' }}>
        {loading ? 'Please wait...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
}
