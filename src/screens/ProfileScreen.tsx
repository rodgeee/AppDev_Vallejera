import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { IMG } from '../utils';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import CustomButton from '../Components/CustomButton';
import { authLogout } from '../app/sagas/actions';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }} edges={['top']}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SPACING.xl,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.xl,
            padding: SPACING.xxl,
            alignItems: 'center',
            ...SHADOWS.md,
          }}
        >
          <Image
            source={IMG.LOGO}
            style={{
              width: 96,
              height: 96,
              marginBottom: SPACING.xl,
              borderRadius: RADIUS.lg,
            }}
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: COLORS.text,
              marginBottom: SPACING.lg,
            }}
          >
            Profile
          </Text>

          <CustomButton
            label="Log out"
            variant="secondary"
            mainStyle={{
              marginTop: SPACING.md,
              paddingHorizontal: SPACING.xl,
              width: '100%',
            }}
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
