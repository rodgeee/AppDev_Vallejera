import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppNav from './src/navigations';
import createStore from './src/app/reducers';

const { store, persistor } = createStore();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <AppNav />
        </View>
      </PersistGate>
    </Provider>
  );
};

export default App;
