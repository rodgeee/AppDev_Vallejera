import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AppAlertModal, {
  type AppAlertButton,
  type AppAlertPayload,
} from '../../Components/app/AppAlertModal';

type AppAlertContextValue = {
  alert: (title: string, message?: string, buttons?: AppAlertButton[]) => void;
};

const AppAlertContext = createContext<AppAlertContextValue | null>(null);

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<AppAlertPayload | null>(null);

  const dismiss = useCallback(() => {
    setPayload(null);
  }, []);

  const alert = useCallback(
    (title: string, message?: string, buttons?: AppAlertButton[]) => {
      setPayload({
        title,
        message,
        buttons: buttons?.length ? buttons : [{ text: 'OK' }],
      });
    },
    [],
  );

  const handleButtonPress = useCallback(
    (button: AppAlertButton) => {
      const onPress = button.onPress;
      dismiss();
      onPress?.();
    },
    [dismiss],
  );

  const value = useMemo(() => ({ alert }), [alert]);

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      {payload ? (
        <AppAlertModal
          visible
          title={payload.title}
          message={payload.message}
          buttons={payload.buttons}
          onDismiss={dismiss}
          onButtonPress={handleButtonPress}
        />
      ) : null}
    </AppAlertContext.Provider>
  );
}

export function useAppAlert(): AppAlertContextValue {
  const ctx = useContext(AppAlertContext);
  if (!ctx) {
    throw new Error('useAppAlert must be used within AppAlertProvider');
  }
  return ctx;
}
