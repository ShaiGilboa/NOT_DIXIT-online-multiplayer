import React, {
  createContext,
  useEffect,
  useState,
  } from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  firebaseApp,
  firebaseAppAuth,
  providers,
  firebaseDB,
} from '../../firebase';


import {
  userSignIn,
  userSignOut,
} from '../../Redux/actions';

export const AuthContext = createContext(null);


const AuthProvider = ({
  children,
  signInWithGoogle,
  signOut,
  user,
}) => {

  const [appUser, setAppUser] = useState({})

  const dispatch = useDispatch();
  const currentUser = useSelector(state=>state.currentUserInfo);

  const handleSignOut= () => {
    signOut();
    console.log('appUser',appUser)
    const body = {
      email: appUser.email,
    }
    fetch('/sign-out', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(body),
    })
    .then(res=>{
      if(res.status===204){
        setAppUser({})
        dispatch(userSignOut());
      }
    })
  }

  useEffect(() => {
    const appUsersRef = firebaseDB.ref('appUsers')

    appUsersRef.on('value', (status) => {
      console.log('status.val()',status.val())

    })

    return () => {
      const appUsersRef = firebaseDB.ref('appUsers')
      appUsersRef.off();
    }
  }, [])

  useEffect(() => {
    if (user){
      // console.log('user',user)
      console.log('sign-in');
      fetch(`/sign-in`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then(res => res.json())
        .then(json => {
          console.log('json',json)
          setAppUser(json.data);
          dispatch(userSignIn(json.data));
        })
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      // appUser,
      signInWithGoogle,
      handleSignOut,
      // message,
      // change,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })(AuthProvider);
