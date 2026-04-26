import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMG, ROUTES } from '../utils';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import CartIcon from '../Components/CartIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = SCREEN_WIDTH * 0.38;
const BRAND_SIZE = (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.md * 3) / 4;

const FEATURED_PRODUCTS = [
  { id: '1', name: 'CLASSIC RUNNER', price: '₱5,000' },
  { id: '2', name: 'PREMIUM EDITION', price: '₱7,000' },
  { id: '3', name: 'SPORT COLLECTION', price: '₱5,000' },
  { id: '4', name: 'LIMITED DROP', price: '₱7,000' },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }} edges={['top']}>
        {/* Top blue strip */}
        <View style={{ height: 4, backgroundColor: COLORS.primary }} />

        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <View style={{ flexDirection: 'row', gap: SPACING.sm, flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>SHOP</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>MEN</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>WOMEN</Text>
          </View>
          <Image
            source={IMG.LOGO}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: SPACING.lg }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.PROFILE)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>ACCOUNT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 4 }} activeOpacity={0.7}>
              <CartIcon size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        >
          {/* Hero banner */}
          <TouchableOpacity
            activeOpacity={0.95}
            style={{
              width: '100%',
              height: SCREEN_WIDTH * 0.6,
              marginTop: SPACING.md,
              backgroundColor: COLORS.cardBackground,
              overflow: 'hidden',
            }}
          >
            <Image
              source={IMG.LOGO}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.border,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '50%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'flex-end',
                paddingBottom: SPACING.lg,
                paddingLeft: SPACING.xl,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.white }}>
                FEATURED COLLECTION
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.white, marginTop: 4 }}>
                LIMITED EDITION | COMING SOON
              </Text>
            </View>
          </TouchableOpacity>

          {/* Featured products */}
          <View style={{ marginTop: SPACING.xl, paddingHorizontal: SPACING.xl }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md }}>
              FEATURED PRODUCTS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: SPACING.xl }}
            >
              {FEATURED_PRODUCTS.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={{
                    width: PRODUCT_CARD_WIDTH,
                    marginLeft: index === 0 ? 0 : SPACING.md,
                    backgroundColor: COLORS.white,
                    borderRadius: RADIUS.md,
                    ...SHADOWS.sm,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ width: '100%', aspectRatio: 1, backgroundColor: COLORS.cardBackground, padding: SPACING.sm }}>
                    <Image
                      source={IMG.LOGO}
                      resizeMode="contain"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <View style={{ padding: SPACING.sm }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 }}>
                      {item.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {}}
              style={{
                marginTop: SPACING.lg,
                backgroundColor: COLORS.primary,
                paddingVertical: SPACING.md,
                borderRadius: RADIUS.sm,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.white }}>
                VIEW ALL PRODUCTS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Promo banners - two columns */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: SPACING.xl,
              marginTop: SPACING.xl,
              gap: SPACING.md,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                flex: 1,
                height: 160,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                backgroundColor: COLORS.cardBackground,
                ...SHADOWS.sm,
              }}
            >
              <Image
                source={IMG.LOGO}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: SPACING.md,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>DRAPED FOR LIFE</Text>
                <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 2 }}>COLLECTION</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    marginTop: SPACING.sm,
                    backgroundColor: COLORS.white,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.xs,
                    alignSelf: 'flex-start',
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text }}>SHOP</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                flex: 1,
                height: 160,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                backgroundColor: COLORS.cardBackground,
                ...SHADOWS.sm,
              }}
            >
              <Image
                source={IMG.LOGO}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: SPACING.md,
                  alignItems: 'flex-end',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>UNRIVALLED</Text>
                <Text style={{ fontSize: 10, color: COLORS.white, marginTop: 2 }}>NEW DROPS</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    marginTop: SPACING.sm,
                    backgroundColor: COLORS.white,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.xs,
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.text }}>SHOP</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          {/* Shop by brand */}
          <View style={{ marginTop: SPACING.xl, paddingHorizontal: SPACING.xl }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md, textAlign: 'center' }}>
              SHOP BY BRAND
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.85}
                  style={{
                    width: BRAND_SIZE,
                    height: BRAND_SIZE,
                    marginLeft: i === 0 ? 0 : SPACING.sm,
                    borderRadius: RADIUS.md,
                    overflow: 'hidden',
                    backgroundColor: COLORS.cardBackground,
                    ...SHADOWS.sm,
                  }}
                >
                  <Image
                    source={IMG.LOGO}
                    resizeMode="contain"
                    style={{ width: '100%', height: '100%', padding: SPACING.xs }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
