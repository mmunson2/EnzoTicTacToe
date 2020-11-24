import firebase from 'firebase';
import 'firebase/firestore'

const config = {
   apiKey: "AIzaSyCKBoIHjmgWaa9PvBqJrSoJ5fsF7hu1PfE",
   authDomain: "tic-tac-test-9e0a5.firebaseapp.com",
   databaseURL: "https://tic-tac-test-9e0a5.firebaseio.com",
   projectId: "tic-tac-test-9e0a5",
   storageBucket: "tic-tac-test-9e0a5.appspot.com",
   messagingSenderId: "718488744584",
   appId: "1:718488744584:web:264e0f2c62dcdfc5ab653d"
 };

 firebase.initializeApp(config);
 export default firebase;
