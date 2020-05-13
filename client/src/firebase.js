// import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAppAuth = firebaseApp.auth();
export const firebaseDB = firebase.database()
export const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

// the firebase function can be here?
