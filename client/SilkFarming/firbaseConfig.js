// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDW7_6RXE4tYoaDZyZ_gqvNKHhyulEb9gc",

  authDomain: "silk-farming.firebaseapp.com",

  projectId: "silk-farming",

  storageBucket: "silk-farming.appspot.com",

  messagingSenderId: "170527371204",

  appId: "1:170527371204:web:2ba64fff383a914a443e91",

  measurementId: "G-1YTPZZXV7Z"

};
const app = initializeApp(firebaseConfig);


export default app;