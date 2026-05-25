import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNav from './src/navigations';
import createStore from './src/app/reducers';
import { setApiUnauthorizedHandler } from './src/app/api/client';
import { configureGoogleSignIn } from './src/app/services/googleSignIn';
import { AppAlertProvider } from './src/app/context/AppAlertContext';

const { store, persistor } = createStore();

// Do not auto sign-out on 401 — show errors on screen instead (Account has Sign out button).
setApiUnauthorizedHandler(null);

const App = () => {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppAlertProvider>
          <View style={{ flex: 1 }}>
            <AppNav />
          </View>
        </AppAlertProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
