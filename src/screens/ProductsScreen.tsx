import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { fetchProducts } from '../app/api/products';
import type { Product } from '../app/api/types';
import { useAuthToken } from '../app/hooks/useAuthToken';
import BrandChip from '../Components/app/BrandChip';
import SearchField from '../Components/app/SearchField';
import ErrorState from '../Components/ErrorState';
import LoadingState from '../Components/LoadingState';
import ProductCard from '../Components/ProductCard';
import { BRAND_NAMES } from '../constants/brands';
import { ROUTES } from '../utils';
import { COLORS, SPACING, TYPO } from '../utils/theme';

const CARD_WIDTH = (Dimensions.get('window').width - SPACING.md * 2 - SPACING.md) / 2;

const ProductsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const brandFilter = route.params?.brand as string | undefined;
  const token = useAuthToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(brandFilter ?? '');
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(brandFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setError('Not signed in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const query = selectedBrand || search.trim() || undefined;
      const data = await fetchProducts(token, {
        search: query,
        limit: 50,
      });
      setProducts(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [token, search, selectedBrand]);

  useEffect(() => {
    if (brandFilter) {
      setSelectedBrand(brandFilter);
      setSearch('');
    }
  }, [brandFilter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    const timer = setTimeout(load, search.trim() && !selectedBrand ? 350 : 0);
    return () => clearTimeout(timer);
  }, [load, search, selectedBrand]);

  const selectBrand = (brand?: string) => {
    setSelectedBrand(brand);
    if (brand) {
      setSearch('');
    }
  };

  if (loading && products.length === 0) {
    return <LoadingState message="Loading shop…" />;
  }

  if (error && products.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  const listHeader = (
    <View style={{ paddingBottom: SPACING.md }}>
      <View style={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.sm }}>
        <Text style={{ ...TYPO.title, color: COLORS.text }}>Shop</Text>
        <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>
          Sneakers & footwear from top brands
        </Text>
        <View style={{ marginTop: SPACING.md }}>
          <SearchField
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              if (t.trim()) {
                setSelectedBrand(undefined);
              }
            }}
            editable={!selectedBrand}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingTop: SPACING.md }}
      >
        <BrandChip label="All" selected={!selectedBrand} onPress={() => selectBrand(undefined)} />
        {BRAND_NAMES.map((brand) => (
          <BrandChip
            key={brand}
            label={brand}
            selected={selectedBrand === brand}
            onPress={() => selectBrand(brand)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={listHeader}
        columnWrapperStyle={{ paddingHorizontal: SPACING.md, gap: SPACING.md }}
        contentContainerStyle={{ paddingBottom: SPACING.xxl, gap: SPACING.lg }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: COLORS.textMuted, marginTop: SPACING.xl }}>
            No products found.
          </Text>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={CARD_WIDTH}
            onPress={() =>
              navigation.navigate(ROUTES.PRODUCT_DETAIL, { productId: item.id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ProductsScreen;
