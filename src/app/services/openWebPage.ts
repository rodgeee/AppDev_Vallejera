import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { COLORS } from '../../utils/theme';

/** Opens a normal web URL in an in-app browser when supported; otherwise the system browser. */
export async function openWebPage(url: string): Promise<void> {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        dismissButtonStyle: 'close',
        preferredBarTintColor: COLORS.primary,
        preferredControlTintColor: COLORS.white,
      });
      return;
    }
  } catch {
    // fall through to Linking
  }
  await Linking.openURL(url);
}
