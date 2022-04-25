import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { ref, set, onValue, update, onChildAdded, onChildChanged, push } from "firebase/database"

let unsubscribeMessagesChildAdded

const state = {
    userDetails: {},
    users: {},
    messages: {},
}

const mutations = {
    setUserDetails: (state, userDetails) => (state.userDetails = userDetails),
    addUser: (state, user) => {
        // state.users[user.userId] = user.userDetails

        //state object, key, data
        Vue.set(state.users, user.userId, user.userDetails)
    },
    updateUser: (state, user) => {
        Object.assign(state.users[user.userId], user.userDetails)
    },
    addMessage: (state, message) => {
        // state.users[user.userId] = user.userDetails

        //state object, key, data
        Vue.set(state.messages, message.messageId, message.messageDetails)
    },
    clearMessages: (state) => state.messages = {}
}

const actions = {
    registerUser({ }, payload) {

        //creating user in Firebase Authentication
        createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user

            //creating user record in Firebase DB
            let userId = firebaseAuth.currentUser.uid
            set(ref(firebaseDb, 'users/' + userId), {
                name: payload.name,
                email: payload.email,
                online: true
            })
            // ...
        })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                console.log(error)
                // ..
            })
    },
    loginUser({ }, payload) {

        //signing in user thru Firebase Auth API
        signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user

            // ...
        })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                console.log(error)
                // ..
            })
    },
    logoutUser({ }) {

        //signing out user thru Firebase Auth API
        firebaseAuth.signOut()
    },

    handleAuthStateChanged({ commit, dispatch, state }) {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                // User is signed in
                const userId = user.uid

                setTimeout(() => {
                    onValue(ref(firebaseDb, '/users/' + userId), (snapshot) => {

                        const userDetails = snapshot.val()

                        commit('setUserDetails', {
                            name: userDetails.name,
                            email: userDetails.email,
                            userId: userId
                        })

                        dispatch('firebaseUpdateUser', {
                            userId: userId,
                            updates: {
                                online: true
                            }
                        })

                        dispatch('firebaseGetUsers')

                        this.$router.push('/')

                    }, {
                        onlyOnce: true
                    })
                }, 1000)


            } else {
                // User is signed out


                dispatch('firebaseUpdateUser', {
                    userId: state.userDetails.userId,
                    updates: {
                        online: false
                    }
                })

                commit('setUserDetails', {})

                this.$router.replace('/auth')
            }
        })
    },

    firebaseUpdateUser({ }, payload) {

        //signing out user thru Firebase Auth API
        // set(ref(firebaseDb, 'users/' + payload.userId), {
        //     name: payload.name,
        //     email: payload.email,
        //     online: true
        // })

        // var updates = {}
        // updates['/users/' + payload.userId] = payload.updates;

        if (payload.userId)
            update(ref(firebaseDb, 'users/' + payload.userId), payload.updates)
    },

    firebaseGetUsers({ commit }) {

        //signing out user thru Firebase Auth API
        // set(ref(firebaseDb, 'users/' + payload.userId), {
        //     name: payload.name,
        //     email: payload.email,
        //     online: true
        // })

        // var updates = {}
        // updates['/users/' + payload.userId] = payload.updates;
        onChildAdded(ref(firebaseDb, 'users'), (snapshot) => {

            let userDetails = snapshot.val()
            let userId = snapshot.key

            commit('addUser', {
                userId,
                userDetails
            })
        })
        onChildChanged(ref(firebaseDb, 'users'), (snapshot) => {

            let userDetails = snapshot.val()
            let userId = snapshot.key

            commit('updateUser', {
                userId,
                userDetails
            })
        })
    },
    firebaseGetMessages({ commit, state }, otherUserId) {

        let userId = state.userDetails.userId

        unsubscribeMessagesChildAdded = onChildAdded(ref(firebaseDb, 'chats/' + userId + '/' + otherUserId), (snapshot) => {

            let messageDetails = snapshot.val()
            let messageId = snapshot.key

            commit('addMessage', {
                messageId,
                messageDetails
            })
        })

    },
    firebaseStopGettingMessages({ commit }) {
        if (unsubscribeMessagesChildAdded) {
            unsubscribeMessagesChildAdded()
            commit('clearMessages')
        }
    },
    firebaseSendMessage({ commit, state }, payload) {

        let userId = state.userDetails.userId
        let otherUserId = payload.otherUserId

        push(ref(firebaseDb, 'chats/' + userId + '/' + otherUserId), payload.message)

        payload.message.from = 'them'

        push(ref(firebaseDb, 'chats/' + otherUserId + '/' + userId), payload.message)
    }
}

const getters = {
    users: state => {
        let filteredUsers = {}
        Object.keys(state.users).forEach(key => {
            if (key !== state.userDetails.userId) {
                filteredUsers[key] = state.users[key]
            }
        })
        return filteredUsers
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
