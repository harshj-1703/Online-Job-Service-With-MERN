// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //hidden
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const signInWithGoogle =() => {
  signInWithPopup(auth,provider).then((result)=>{
    // console.log(result);
    location.reload();
    const name = result.user.name;
    const email = result.user.email;
    const profilePic = result.user.photoURL;
    const displayName = result.user.displayName;

    localStorage.setItem("name",name);
    localStorage.setItem("email",email);
    localStorage.setItem("profilePic",profilePic);
    localStorage.setItem("displayName",displayName);
  }).catch((error) => {console.log(error);});
};
