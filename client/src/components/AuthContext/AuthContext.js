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
  gameSignOut,
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
  const currentUser = useSelector(state=>state.currentUser);

  const handleSignOut= () => {
    signOut();
    const body = {
      email: currentUser.info.email,
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
        dispatch(gameSignOut())
      }
    })
  }

  useEffect(() => {
    if (user){
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
          setAppUser(json.data);
          dispatch(userSignIn(json.data));
        })
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      signInWithGoogle,
      handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

providers.googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
  })(AuthProvider);
