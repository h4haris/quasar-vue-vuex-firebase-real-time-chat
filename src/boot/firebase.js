import { initializeApp } from 'firebase/app'

// Add the Firebase products that you want to use
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

import { firebaseConfig } from './firebase.config'

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

let firebaseAuth = getAuth(firebaseApp)
let firebaseDb = getDatabase(firebaseApp)

export { firebaseAuth, firebaseDb }