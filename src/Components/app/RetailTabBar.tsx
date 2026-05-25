import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../../app/hooks/useCart';
import { COLORS, SPACING } from '../../utils/theme';
import { ROUTES } from '../../utils';

const TABS: { route: string; label: string; icon: string; iconFocused: string }[] = [
  { route: ROUTES.HOME, label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { route: ROUTES.PRODUCTS, label: 'Shop', icon: 'grid-outline', iconFocused: 'grid' },
  { route: ROUTES.CART, label: 'Bag', icon: 'bag-outline', iconFocused: 'bag' },
  { route: ROUTES.PROFILE, label: 'Account', icon: 'person-outline', iconFocused: 'person' },
];

export default function RetailTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Math.max(insets.bottom, SPACING.sm),
        paddingTop: SPACING.sm,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TABS.find((t) => t.route === route.name) ?? TABS[0];
        const color = focused ? COLORS.primary : COLORS.tabInactive;
        const showBadge = route.name === ROUTES.CART && itemCount > 0;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={
              showBadge ? `${meta.label}, ${itemCount} items in bag` : meta.label
            }
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }}
          >
            <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={focused ? meta.iconFocused : meta.icon} size={24} color={color} />
              {showBadge ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: COLORS.primary,
                    borderWidth: 2,
                    borderColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: '800' }}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={{ fontSize: 11, fontWeight: focused ? '700' : '500', color }}>{meta.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
