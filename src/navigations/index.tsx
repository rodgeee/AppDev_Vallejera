import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';

import ErrorScreen from '../screens/auth/Error';

// utils
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
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 18,
  },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: COLORS.cardBackground },
};

const AuthStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.LOGIN} screenOptions={screenOptions}>
    <Stack.Screen name={ROUTES.LOGIN} component={Login} options={{ headerShown: false }} />
    <Stack.Screen name={ROUTES.REGISTER} component={Register} options={{ title: 'Register' }} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.HOME} screenOptions={screenOptions}>
    <Stack.Screen
      name={ROUTES.HOME}
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={ROUTES.PROFILE}
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ErrorStack = () => (
  <Stack.Navigator initialRouteName={ROUTES.ERROR} screenOptions={screenOptions}>
    <Stack.Screen name={ROUTES.ERROR} component={ErrorScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const MainNavigation = () => {
  const { isError, data } = useSelector((state: any) => state.auth || {});
  const isLoggedIn = data != null;

  if (isError) return <ErrorStack />;
  return isLoggedIn ? <MainStack /> : <AuthStack />;
};

export default () => {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
};