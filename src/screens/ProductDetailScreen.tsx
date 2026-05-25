import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProduct } from '../app/api/products';
import type { ProductDetail } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import { useCart } from '../app/hooks/useCart';
import AddedToBagModal, { SelectSizeHintModal, type AddedToBagInfo } from '../Components/app/AddedToBagModal';
import ProductImageGallery from '../Components/app/ProductImageGallery';
import SizeSelector, { sortShoeSizes } from '../Components/app/SizeSelector';
import CustomButton from '../Components/CustomButton';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import { ROUTES } from '../utils';
import { navigateToTab } from '../utils/navigation';
import { formatPrice } from '../utils/format';
import { COLORS, RADIUS, SPACING, TYPO } from '../utils/theme';

const ProductDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const productId = Number(route.params?.productId);
  const token = useAuthToken();
  const { add } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bagModalVisible, setBagModalVisible] = useState(false);
  const [sizeHintVisible, setSizeHintVisible] = useState(false);
  const [lastAdded, setLastAdded] = useState<AddedToBagInfo | null>(null);

  const load = useCallback(async () => {
    if (!token || !productId) {
      setError('Invalid product.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const detail = await fetchProduct(token, productId);
      const sizes =
        detail.availableSizes && detail.availableSizes.length > 0
          ? sortShoeSizes(detail.availableSizes)
          : sortShoeSizes([detail.size]);
      setProduct(detail);
      setAvailableSizes(sizes);
      setSelectedSize(sizes.length === 1 ? sizes[0] : null);
      setQuantity(1);
      navigation.setOptions({
        title: detail.name.length > 28 ? `${detail.name.slice(0, 28)}…` : detail.name,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load product.');
    } finally {
      setLoading(false);
    }
  }, [token, productId, navigation]);

  useEffect(() => {
    load();
  }, [load]);

  const addToBag = () => {
    if (!product || product.availableStock <= 0) {
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeHintVisible(true);
      return;
    }
    const size = selectedSize ?? product.size;
    add(product, quantity, size);
    setLastAdded({ product, size, quantity });
    setBagModalVisible(true);
  };

  if (loading) {
    return <LoadingState message="Loading…" />;
  }

  if (error || !product) {
    return <ErrorState message={error || 'Product not found.'} onRetry={load} />;
  }

  const inStock = product.availableStock > 0;
  const needsSize = availableSizes.length > 0;
  const canAdd = inStock && (!needsSize || selectedSize !== null);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AddedToBagModal
        visible={bagModalVisible}
        item={lastAdded}
        onClose={() => setBagModalVisible(false)}
        onViewBag={() => navigateToTab(navigation, ROUTES.CART)}
      />
      <SelectSizeHintModal visible={sizeHintVisible} onClose={() => setSizeHintVisible(false)} />

      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageGallery product={product} productName={product.name} />

        <View style={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.lg }}>
          <Text style={{ ...TYPO.title, color: COLORS.text }}>{product.name}</Text>
          {product.color?.trim() ? (
            <Text style={{ fontSize: 15, color: COLORS.textMuted, marginTop: SPACING.xs }}>
              <Text style={{ fontWeight: '600', color: COLORS.textSecondary }}>COLOR=</Text>
              {product.color.trim()}
            </Text>
          ) : null}
          <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.primary, marginTop: SPACING.md }}>
            {formatPrice(product.price)}
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: SPACING.sm,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: RADIUS.sm,
              backgroundColor: inStock ? COLORS.primaryLight : COLORS.surface,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: inStock ? COLORS.primary : COLORS.textMuted,
              }}
            >
              {inStock
                ? selectedSize
                  ? `${product.availableStock} available · Size ${selectedSize}`
                  : `${product.availableStock} available`
                : 'Out of stock'}
            </Text>
          </View>

          {needsSize ? (
            <SizeSelector
              sizes={availableSizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          ) : null}

          {product.description ? (
            <Text
              style={{
                fontSize: 15,
                color: COLORS.textSecondary,
                marginTop: SPACING.lg,
                lineHeight: 24,
              }}
            >
              {product.description}
            </Text>
          ) : null}

          {inStock ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xl, gap: SPACING.md }}>
              <Text style={{ fontWeight: '600', color: COLORS.text, fontSize: 15 }}>Quantity</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                <QtyButton label="−" onPress={() => setQuantity((q) => Math.max(1, q - 1))} />
                <Text style={{ fontSize: 17, fontWeight: '700', minWidth: 32, textAlign: 'center' }}>
                  {quantity}
                </Text>
                <QtyButton
                  label="+"
                  onPress={() => setQuantity((q) => Math.min(product.availableStock, q + 1))}
                  disabled={quantity >= product.availableStock}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
        }}
      >
        <CustomButton
          label={
            !inStock
              ? 'Unavailable'
              : needsSize && !selectedSize
                ? 'Select a size'
                : 'Add to bag'
          }
          variant="primary"
          mainStyle={{ width: '100%', opacity: canAdd ? 1 : 0.55 }}
          disabled={!canAdd}
          onPress={addToBag}
        />
      </SafeAreaView>
    </View>
  );
};

function QtyButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.primary }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default ProductDetailScreen;
