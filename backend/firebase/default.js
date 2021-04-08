var firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyAfOGXWXGEmN6Salno5lLmErO4m5EjfUZA",
  authDomain: "blostpog.firebaseapp.com",
  projectId: "blostpog",
  storageBucket: "blostpog.appspot.com",
  messagingSenderId: "637025684662",
  appId: "1:637025684662:web:d6f8eba050709412f4ea17",
  measurementId: "G-1L0VDM00WV",
};

firebase.initializeApp(firebaseConfig);
module.exports = firebase;
