import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvRH9Ecd1CzW76ylrccVy_qZTGFqGEAVQ",
  authDomain: "one-shop-6a014.firebaseapp.com",
  projectId: "one-shop-6a014",
  storageBucket: "one-shop-6a014.appspot.com",
  messagingSenderId: "463725661479",
  appId: "1:463725661479:web:38c2fcddeb85b5efb92d02",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth , additionalInformation = {}) => {

  if(!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);
  console.log(userSnapshot.exists())

  if (!userSnapshot.exists()){
    const {displayName,email} = userAuth;
    const createdAt = new Date();

    try{
        await setDoc(userDocRef, {
            displayName,
            email,
            createdAt,
            ...additionalInformation,
        });
    }
    catch(error){
        if(error.code === 'auth/email-already-in-use'){
          alert('Cannot use same email')
        }
        else{
          console.log('error creating the user', error.message);
        }
        
    }
  }

  return userDocRef;
  

};

export const createAuthUserWithEmailAndPassword = async (email,password) => {

  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth,email,password);

}

export const signInAuthUserWithEmailAndPassword = async (email,password) => {

  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth,email,password);

}

