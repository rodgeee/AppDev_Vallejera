import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../../utils/theme';

export type AppAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export type AppAlertButton = {
  text: string;
  style?: AppAlertButtonStyle;
  onPress?: () => void;
};

export type AppAlertPayload = {
  title: string;
  message?: string;
  buttons: AppAlertButton[];
};

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AppAlertButton[];
  onDismiss: () => void;
  onButtonPress: (button: AppAlertButton) => void;
};

function alertIcon(title: string, buttons: AppAlertButton[]) {
  const hasDestructive = buttons.some((b) => b.style === 'destructive');
  const lower = title.toLowerCase();
  if (hasDestructive) {
    return { name: 'warning-outline' as const, bg: COLORS.errorBg, color: COLORS.errorText };
  }
  if (lower.includes('success') || lower.includes('saved') || lower.includes('complete')) {
    return { name: 'checkmark-circle-outline' as const, bg: '#dcfce7', color: COLORS.success };
  }
  if (lower.includes('error') || lower.includes('failed')) {
    return { name: 'alert-circle-outline' as const, bg: COLORS.errorBg, color: COLORS.errorText };
  }
  return { name: 'information-circle-outline' as const, bg: COLORS.primaryLight, color: COLORS.primary };
}

function buttonStyles(style: AppAlertButtonStyle | undefined) {
  if (style === 'destructive') {
    return {
      container: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.errorBorder,
      },
      text: { color: COLORS.errorText, fontWeight: '700' as const },
    };
  }
  if (style === 'cancel') {
    return {
      container: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      text: { color: COLORS.text, fontWeight: '600' as const },
    };
  }
  return {
    container: { backgroundColor: COLORS.primary },
    text: { color: COLORS.white, fontWeight: '700' as const },
  };
}

export default function AppAlertModal({
  visible,
  title,
  message,
  buttons,
  onDismiss,
  onButtonPress,
}: Props) {
  const icon = alertIcon(title, buttons);
  const resolvedButtons =
    buttons.length > 0 ? buttons : [{ text: 'OK', style: 'default' as const }];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'center',
          padding: SPACING.lg,
        }}
        onPress={onDismiss}
      >
        <Pressable
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.lg,
            ...SHADOWS.lg,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ alignItems: 'center', marginBottom: SPACING.md }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: icon.bg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={icon.name} size={26} color={icon.color} />
            </View>
          </View>

          <Text style={{ ...TYPO.title, color: COLORS.text, textAlign: 'center' }}>{title}</Text>
          {message ? (
            <Text
              style={{
                fontSize: 15,
                color: COLORS.textSecondary,
                textAlign: 'center',
                marginTop: SPACING.sm,
                lineHeight: 22,
              }}
            >
              {message}
            </Text>
          ) : null}

          <View style={{ marginTop: SPACING.lg, gap: SPACING.sm }}>
            {resolvedButtons.map((button, index) => {
              const styles = buttonStyles(button.style);
              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  activeOpacity={0.85}
                  onPress={() => onButtonPress(button)}
                  style={{
                    paddingVertical: 14,
                    borderRadius: RADIUS.md,
                    alignItems: 'center',
                    ...styles.container,
                  }}
                >
                  <Text style={{ fontSize: 16, ...styles.text }}>{button.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
