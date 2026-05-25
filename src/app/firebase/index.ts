import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Uses the default native Firebase app from google-services.json / GoogleService-Info.plist.
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseFieldValue = firestore.FieldValue;
