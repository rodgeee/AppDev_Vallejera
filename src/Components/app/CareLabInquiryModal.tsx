import React from 'react';
import {
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../app/api/config';
import { openWebPage } from '../../app/services/openWebPage';
import {
  CARE_LAB_INQUIRY_EMAIL,
  CARE_LAB_QUICK_FORM_URL,
} from '../../constants/careLabInquiry';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../../utils/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** When set, prefilled into email subject/body (e.g. package name from Care Lab). */
  packageName?: string | null;
};

function buildMailtoUrl(packageName?: string | null): string {
  const subject = packageName
    ? `Care Lab — ${packageName} inquiry`
    : 'Care Lab — shoe cleaning inquiry';
  const body =
    `Hi Shoes R' Us,\n\n` +
    (packageName ? `I'm interested in: ${packageName}\n\n` : '') +
    `Shoe model / brand:\n\n` +
    `Material (leather / mesh / suede / etc.):\n\n` +
    `Questions or preferred timeline:\n\n` +
    `Thank you,\n`;
  return `mailto:${CARE_LAB_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function CareLabInquiryModal({ visible, onClose, packageName }: Props) {
  const contactPageUrl = `${API_BASE_URL.replace(/\/$/, '')}/contact`;

  const openEmail = () => {
    onClose();
    Linking.openURL(buildMailtoUrl(packageName)).catch(() => {});
  };

  const openForm = async () => {
    onClose();
    await openWebPage(CARE_LAB_QUICK_FORM_URL);
  };

  const openContactPage = async () => {
    onClose();
    await openWebPage(contactPageUrl);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(17, 24, 39, 0.45)',
          justifyContent: 'center',
          padding: SPACING.lg,
        }}
        onPress={onClose}
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, paddingRight: SPACING.md }}>
              <Text style={{ ...TYPO.label, color: COLORS.primary }}>Care Lab</Text>
              <Text style={{ ...TYPO.title, color: COLORS.text, marginTop: 6 }}>Book or inquire</Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 21 }}>
                Choose how you&apos;d like to reach us about shoe cleaning{packageName ? ` (${packageName})` : ''}.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={12} accessibilityLabel="Close">
              <Icon name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={openEmail}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SPACING.lg,
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.md,
            }}
          >
            <Icon name="mail-outline" size={22} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>Email the store</Text>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
                Opens your mail app with a ready-to-send template
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openForm}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SPACING.sm,
              backgroundColor: COLORS.primaryLight,
              paddingVertical: 14,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.md,
              borderWidth: 1,
              borderColor: '#d4e0f5',
            }}
          >
            <Icon name="document-text-outline" size={22} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700' }}>Quick request form</Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 2 }}>
                Same Google Form linked on our website
              </Text>
            </View>
            <Icon name="open-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openContactPage}
            activeOpacity={0.88}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SPACING.sm,
              paddingVertical: 14,
              paddingHorizontal: SPACING.md,
              borderRadius: RADIUS.md,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: COLORS.white,
            }}
          >
            <Icon name="globe-outline" size={22} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700' }}>Contact page</Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 2 }}>
                Hours, social links & more options
              </Text>
            </View>
            <Icon name="open-outline" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: SPACING.md, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textSecondary }}>Not now</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
