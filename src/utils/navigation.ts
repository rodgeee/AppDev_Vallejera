import ROUTES from './routes';

/** Open a bottom-tab screen from a stack screen (e.g. product detail, brands). */
export function navigateToTab(
  navigation: { navigate: (name: string, params?: object) => void },
  screen: string,
  params?: object,
) {
  navigation.navigate(ROUTES.MAIN_TABS, { screen, params });
}
