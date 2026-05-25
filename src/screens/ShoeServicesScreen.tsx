import React, { useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppAlert } from '../app/context/AppAlertContext';
import { useAuthToken } from '../app/hooks/useAuthToken';
import CareLabBookingModal from '../Components/app/CareLabBookingModal';
import CareLabInquiryModal from '../Components/app/CareLabInquiryModal';
import CustomButton from '../Components/CustomButton';
import {
  SHOE_SERVICES_CARE_NOTES,
  SHOE_SERVICES_FAQ,
  SHOE_SERVICES_HERO,
  SHOE_SERVICES_PACKAGES,
  SHOE_SERVICES_PROCESS,
  SHOE_SERVICES_STATS,
} from '../constants/shoeServices';
import { IMG, ROUTES } from '../utils';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPO } from '../utils/theme';

const sectionLeadStyle = {
  fontSize: 14,
  color: COLORS.textSecondary,
  lineHeight: 20,
  paddingHorizontal: SPACING.md,
  marginTop: -SPACING.sm,
  marginBottom: SPACING.md,
};

export default function ShoeServicesScreen() {
  const navigation = useNavigation<any>();
  const token = useAuthToken();
  const { alert } = useAppAlert();
  const scrollRef = useRef<ScrollView>(null);
  const [packagesLayoutY, setPackagesLayoutY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const showBooking = (packageName?: string | null) => {
    setSelectedPackage(packageName ?? null);
    setBookingOpen(true);
  };

  const showInquiry = (packageName?: string | null) => {
    setSelectedPackage(packageName ?? null);
    setInquiryOpen(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        >
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
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              {SHOE_SERVICES_HERO.eyebrow}
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                color: COLORS.white,
                marginTop: SPACING.sm,
                letterSpacing: -0.4,
                lineHeight: 30,
              }}
            >
              {SHOE_SERVICES_HERO.title}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: 'rgba(255,255,255,0.88)',
                marginTop: SPACING.md,
              }}
            >
              {SHOE_SERVICES_HERO.lead}
            </Text>
            <TouchableOpacity
              onPress={() =>
                scrollRef.current?.scrollTo({
                  y: Math.max(0, packagesLayoutY - SPACING.md),
                  animated: true,
                })
              }
              activeOpacity={0.9}
              style={{
                marginTop: SPACING.lg,
                backgroundColor: COLORS.white,
                paddingVertical: 12,
                borderRadius: RADIUS.md,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>View packages</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginHorizontal: SPACING.md,
              marginTop: SPACING.md,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
              ...SHADOWS.sm,
            }}
          >
            <Image
              source={IMG.CARE_LAB_HERO}
              style={{ width: '100%', height: 200, backgroundColor: COLORS.border }}
              resizeMode="cover"
              accessibilityLabel={SHOE_SERVICES_HERO.imageAlt}
            />
          </View>

          <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.lg }}>
            <Text style={{ ...TYPO.label, color: COLORS.textMuted, marginBottom: SPACING.sm }}>Highlights</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
              {SHOE_SERVICES_STATS.map((s) => (
                <View
                  key={s.label}
                  style={{
                    flexGrow: 1,
                    flexBasis: '28%',
                    backgroundColor: COLORS.white,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>{s.value}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 4, lineHeight: 15 }}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View onLayout={(e) => setPackagesLayoutY(e.nativeEvent.layout.y)} collapsable={false}>
            <SectionTitle eyebrow="Packages" title="Choose the clean your pair deserves" />
            <Text style={sectionLeadStyle}>
              Transparent tiers—no surprises at pickup. Pricing per pair; bundles in store.
            </Text>

            {SHOE_SERVICES_PACKAGES.map((pkg) => (
              <View
                key={pkg.name}
                style={{
                  marginHorizontal: SPACING.md,
                  marginBottom: SPACING.md,
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  padding: SPACING.lg,
                  borderWidth: pkg.featured ? 2 : 1,
                  borderColor: pkg.featured ? COLORS.primary : COLORS.border,
                  ...SHADOWS.sm,
                }}
              >
                {pkg.featured ? (
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: COLORS.primaryLight,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: RADIUS.full,
                      marginBottom: SPACING.sm,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>Most popular</Text>
                  </View>
                ) : null}
                <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.text }}>{pkg.name}</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary, marginTop: 4 }}>
                  {pkg.price}
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>{pkg.tagline}</Text>
                <View style={{ marginTop: SPACING.md }}>
                  {pkg.includes.map((line) => (
                    <View key={line} style={{ flexDirection: 'row', marginBottom: 6 }}>
                      <Text style={{ color: COLORS.primary, marginRight: 8 }}>•</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 }}>{line}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => showBooking(pkg.name)}
                  style={{
                    marginTop: SPACING.md,
                    backgroundColor: COLORS.primary,
                    paddingVertical: 12,
                    borderRadius: RADIUS.md,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>Book this package</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <SectionTitle eyebrow="How it works" title="From drop-off to fresh out the bag" />
          <Text style={sectionLeadStyle}>Every pair is tagged, photographed, and tracked.</Text>

          <View style={{ paddingHorizontal: SPACING.md, gap: SPACING.md }}>
            {SHOE_SERVICES_PROCESS.map((step) => (
              <View
                key={step.step}
                style={{
                  flexDirection: 'row',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  padding: SPACING.md,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: COLORS.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.md,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.primary }}>{step.step}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>{step.title}</Text>
                  <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 }}>
                    {step.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <SectionTitle eyebrow="Our standard" title="Care that respects the materials" />

          <View style={{ paddingHorizontal: SPACING.md, gap: SPACING.sm }}>
            {SHOE_SERVICES_CARE_NOTES.map((note) => (
              <View
                key={note.title}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>{note.title}</Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 6, lineHeight: 20 }}>
                  {note.text}
                </Text>
              </View>
            ))}
          </View>

          <SectionTitle eyebrow="FAQ" title="Common questions" />

          <View style={{ paddingHorizontal: SPACING.md, gap: SPACING.xs }}>
            {SHOE_SERVICES_FAQ.map((item, index) => {
              const open = openFaqIndex === index;
              return (
                <TouchableOpacity
                  key={item.q}
                  activeOpacity={0.85}
                  onPress={() => setOpenFaqIndex(open ? null : index)}
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: RADIUS.md,
                    padding: SPACING.md,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: '700',
                        color: COLORS.text,
                        paddingRight: SPACING.sm,
                      }}
                    >
                      {item.q}
                    </Text>
                    <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textMuted} />
                  </View>
                  {open ? (
                    <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 21 }}>
                      {item.a}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={{
              marginHorizontal: SPACING.md,
              marginTop: SPACING.xl,
              backgroundColor: COLORS.primary,
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              ...SHADOWS.md,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white }}>Ready to revive your rotation?</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)', marginTop: SPACING.sm, lineHeight: 21 }}>
              Drop by the store or reach out—we&apos;ll confirm materials, timeline, and the right package before we
              start.
            </Text>
            <CustomButton
              label="Contact us"
              mainStyle={{ marginTop: SPACING.lg, width: '100%', backgroundColor: COLORS.white }}
              textStyle={{ color: COLORS.primary, fontWeight: '700', fontSize: 16 }}
              onPress={() => showInquiry()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <CareLabBookingModal
        visible={bookingOpen}
        onClose={() => setBookingOpen(false)}
        packageName={selectedPackage}
        onBooked={() => {
          alert(
            'Booking submitted',
            'Your pair is in the lab queue. Track progress under Account → Care Lab bookings.',
            [
              { text: 'OK' },
              {
                text: 'View my bookings',
                onPress: () => navigation.navigate(ROUTES.CARE_LAB_BOOKINGS),
              },
            ],
          );
        }}
        onNeedSignIn={() => {
          setBookingOpen(false);
          navigation.navigate(ROUTES.LOGIN);
        }}
        onOtherOptions={() => {
          setBookingOpen(false);
          setInquiryOpen(true);
        }}
      />
      <CareLabInquiryModal
        visible={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        packageName={selectedPackage}
      />
    </View>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={{ paddingHorizontal: SPACING.md, marginTop: SPACING.xl, marginBottom: SPACING.sm }}>
      <Text style={{ ...TYPO.label, color: COLORS.primary }}>{eyebrow}</Text>
      <Text style={{ ...TYPO.section, color: COLORS.text, marginTop: 4 }}>{title}</Text>
    </View>
  );
}
