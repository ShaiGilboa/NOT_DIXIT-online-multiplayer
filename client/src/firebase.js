import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';
import 'firebase/auth';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAidXmkqYTsCYSC2UxJRPYJ6D28KOBpx4c",
//   authDomain: "final-project-77e67.firebaseapp.com",
//   databaseURL: "https://final-project-77e67.firebaseio.com",
//   projectId: "final-project-77e67",
//   storageBucket: "final-project-77e67.appspot.com",
//   messagingSenderId: "241507981177",
//   appId: "1:241507981177:web:4d1d446f45aee16e9d81a8"
// };
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
};
console.log('process.env.REACT_APP_PROJECT_ID',process.env.REACT_APP_PROJECT_ID)
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAppAuth = firebaseApp.auth();
// const databaseRef = firebase.database().ref();
export const firebaseDB = firebase.database()

export const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

// the firebase function can be here?
