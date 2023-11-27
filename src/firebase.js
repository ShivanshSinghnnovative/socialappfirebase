import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_VUE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_VUE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_VUE_APP_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

export const messaging = getMessaging(app);

getToken(messaging, { vapidKey: 'BDxzhpRGCiqMl9gexWPXQcHF1XavHbCSf_LffI8RXEoUp1cuHSIMVa_W8A8BxpNXOraECc5jJ6WvzETLwg8cKyE' })
  .then((currentToken) => {
    if (currentToken) {
      console.log('Token:', currentToken);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });

onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
  const { notification } = payload;
  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon,
  });
});
