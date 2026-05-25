import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BRAND_NAMES } from '../constants/brands';
import { ROUTES } from '../utils';
import { navigateToTab } from '../utils/navigation';
import { COLORS, RADIUS, SPACING } from '../utils/theme';

const BrandsScreen = () => {
  const navigation = useNavigation<any>();
  const brands = [...BRAND_NAMES].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={['bottom']}>
      <FlatList
        data={brands}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: SPACING.md }}
        renderItem={({ item }) => {
          const label = item.charAt(0) + item.slice(1).toLowerCase();
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigateToTab(navigation, ROUTES.PRODUCTS, { brand: item })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.lg,
                padding: SPACING.md,
                marginBottom: SPACING.sm,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: COLORS.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: SPACING.md,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.accent }}>
                  {item.charAt(0)}
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, flex: 1 }}>{label}</Text>
              <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default BrandsScreen;
