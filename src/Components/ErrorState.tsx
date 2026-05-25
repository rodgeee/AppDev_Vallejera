import React from 'react';
import { Text, View } from 'react-native';
import CustomButton from './CustomButton';
import { COLORS, SPACING } from '../utils/theme';

type Props = {
  message: string;
  onRetry?: () => void;
  onSignOut?: () => void;
};

const ErrorState = ({ message, onRetry, onSignOut }: Props) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl }}>
    <Text style={{ color: COLORS.text, fontSize: 15, textAlign: 'center', marginBottom: SPACING.lg }}>
      {message}
    </Text>
    {onRetry ? (
      <CustomButton label="Try again" onPress={onRetry} mainStyle={{ width: '100%', maxWidth: 280 }} />
    ) : null}
    {onSignOut ? (
      <CustomButton
        label="Sign out"
        onPress={onSignOut}
        mainStyle={{
          marginTop: onRetry ? SPACING.md : 0,
          width: '100%',
          maxWidth: 280,
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.primary,
        }}
        textStyle={{ color: COLORS.primary, fontWeight: '700' }}
      />
    ) : null}
  </View>
);

export default ErrorState;
