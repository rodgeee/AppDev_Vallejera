import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useIsLoggedIn } from '../app/hooks/useIsLoggedIn';

import MainTabs from './MainTabs';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import AddressesScreen from '../screens/AddressesScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CheckoutSuccessScreen from '../screens/CheckoutSuccessScreen';
import BrandsScreen from '../screens/BrandsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddressFormScreen from '../screens/AddressFormScreen';
import ShoeServicesScreen from '../screens/ShoeServicesScreen';
import CareLabBookingsScreen from '../screens/CareLabBookingsScreen';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ErrorScreen from '../screens/auth/Error';

import { NavigationContainer } from '@react-navigation/native';
import { ROUTES } from '../utils';
import { COLORS } from '../utils/theme';

const Stack = createStackNavigator();

const screenOptions: any = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: COLORS.primary,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 17,
  },
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: COLORS.background },
};

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.LOGIN} component={Login} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.REGISTER} component={Register} options={{ title: 'Create account' }} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.MAIN_TABS} screenOptions={screenOptions}>
      <Stack.Screen
        name={ROUTES.MAIN_TABS}
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.PRODUCT_DETAIL}
        component={ProductDetailScreen}
        options={{ title: '' }}
      />
      <Stack.Screen name={ROUTES.BRANDS} component={BrandsScreen} options={{ title: 'Brands' }} />
      <Stack.Screen
        name={ROUTES.SHOE_SERVICES}
        component={ShoeServicesScreen}
        options={{ title: 'Care Lab' }}
      />
      <Stack.Screen
        name={ROUTES.CARE_LAB_BOOKINGS}
        component={CareLabBookingsScreen}
        options={{ title: 'My Care Lab bookings' }}
      />
      <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name={ROUTES.CHECKOUT_SUCCESS}
        component={CheckoutSuccessScreen}
        options={{ title: '', headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name={ROUTES.ORDERS} component={OrdersScreen} options={{ title: 'Orders' }} />
      <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} options={{ title: 'Order details' }} />
      <Stack.Screen name={ROUTES.ADDRESSES} component={AddressesScreen} options={{ title: 'Addresses' }} />
      <Stack.Screen
        name={ROUTES.ADDRESS_FORM}
        component={AddressFormScreen}
        options={({ route }: any) => ({
          title: route.params?.addressId ? 'Edit address' : 'New address',
        })}
      />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} options={{ title: 'Edit profile' }} />
    </Stack.Navigator>
  );
}

function ErrorStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.ERROR} screenOptions={screenOptions}>
      <Stack.Screen name={ROUTES.ERROR} component={ErrorScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isError } = useSelector((state: any) => state.auth || {});
  const isLoggedIn = useIsLoggedIn();

  if (isError) {
    return <ErrorStack />;
  }
  if (isLoggedIn) {
    return <MainStack />;
  }
  return <AuthStack />;
}

function AppNavigation() {
  const { isError } = useSelector((state: any) => state.auth || {});
  const isLoggedIn = useIsLoggedIn();
  const navKey = isError ? 'error' : isLoggedIn ? 'main' : 'auth';

  return (
    <NavigationContainer key={navKey}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default AppNavigation;
