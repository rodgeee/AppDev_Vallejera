import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createServiceBooking } from '../../app/api/serviceBookings';
import { useAuthToken } from '../../app/hooks/useAuthToken';
import CustomTextInput from '../CustomTextInput';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../../utils/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  packageName?: string | null;
  onBooked?: () => void;
  onNeedSignIn?: () => void;
  onOtherOptions?: () => void;
};

export default function CareLabBookingModal({
  visible,
  onClose,
  packageName,
  onBooked,
  onNeedSignIn,
  onOtherOptions,
}: Props) {
  const token = useAuthToken();
  const [shoeName, setShoeName] = useState('');
  const [material, setMaterial] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setShoeName('');
    setMaterial('');
    setNotes('');
    setError(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!token) {
      onNeedSignIn?.();
      return;
    }
    if (!packageName) {
      setError('Choose a package from the list first.');
      return;
    }
    if (!shoeName.trim()) {
      setError('Describe the shoe or pair you want cleaned.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createServiceBooking(token, {
        packageName,
        shoeName: shoeName.trim(),
        material: material.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      reset();
      onClose();
      onBooked?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not submit booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'flex-end',
        }}
        onPress={handleClose}
      >
        <Pressable
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: RADIUS.xl,
            borderTopRightRadius: RADIUS.xl,
            maxHeight: '90%',
            ...SHADOWS.lg,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: COLORS.border,
              alignSelf: 'center',
              marginTop: SPACING.sm,
              marginBottom: SPACING.md,
            }}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xl }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: SPACING.md }}>
                <Text style={{ ...TYPO.label, color: COLORS.primary }}>Care Lab booking</Text>
                <Text style={{ ...TYPO.title, color: COLORS.text, marginTop: 6 }}>Submit to the lab queue</Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 21 }}>
                  Your request goes straight to the admin Shoe Lab dashboard. Staff will update progress as your pair
                  moves through cleaning.
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} hitSlop={12}>
                <Icon name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {packageName ? (
              <View
                style={{
                  marginTop: SPACING.md,
                  backgroundColor: COLORS.primaryLight,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  borderWidth: 1,
                  borderColor: '#d4e0f5',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>PACKAGE</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 4 }}>
                  {packageName}
                </Text>
              </View>
            ) : (
              <Text style={{ marginTop: SPACING.md, fontSize: 14, color: COLORS.errorText }}>
                Go back and tap Book this package on a tier first.
              </Text>
            )}

            {!token ? (
              <Text style={{ marginTop: SPACING.md, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 }}>
                Sign in to submit a booking so we can link it to your account and show status here in the app.
              </Text>
            ) : null}

            <View style={{ marginTop: SPACING.md }}>
              <CustomTextInput
                label="Shoe / pair"
                placeholder="e.g. Air Jordan 1 Lost & Found, size 10"
                value={shoeName}
                onChangeText={setShoeName}
              />
              <CustomTextInput
                label="Material (optional)"
                placeholder="Leather, mesh, suede, knit…"
                value={material}
                onChangeText={setMaterial}
              />
              <CustomTextInput
                label="Notes (optional)"
                placeholder="Scuffs, rush date, special requests…"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {error ? (
              <Text style={{ fontSize: 14, color: COLORS.errorText, marginTop: SPACING.sm }}>{error}</Text>
            ) : null}

            <TouchableOpacity
              onPress={submit}
              disabled={submitting || !token || !packageName}
              activeOpacity={0.88}
              style={{
                marginTop: SPACING.lg,
                backgroundColor: COLORS.primary,
                paddingVertical: 14,
                borderRadius: RADIUS.md,
                alignItems: 'center',
                opacity: submitting || !token || !packageName ? 0.6 : 1,
              }}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>
                  {token ? 'Submit booking' : 'Sign in to book'}
                </Text>
              )}
            </TouchableOpacity>

            {onOtherOptions ? (
              <TouchableOpacity onPress={onOtherOptions} style={{ marginTop: SPACING.md, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>
                  Email or contact page instead
                </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
