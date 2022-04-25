# QUASAR-VUE-VUEX-FIREBASE-REAL-TIME-CHAT

A Quasar Project: Real time chat app using quasar, vue, vuex, and firebase

## Add Firebase configuration info

Open src/boot folder, rename **firebase.config.sample.js** to **firebase.config.js** and add the Firebase Configuration

- apiKey: "YOUR FIREBASE API KEY"
- authDomain: "YOUR FIREBASE AUTH DOMAIN"
- databaseURL: "YOUR FIREBASE DATABASE URL"
- projectId: "YOUR FIREBASE PROJECT ID"
- storageBucket: "YOUR FIREBASE STORAGE BUCKET"
- messagingSenderId: "YOUR FIREBASE MESSAGING SENDER ID"
- appId: "YOUR FIREBASE APP ID"

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Run as desktop app in development mode
```bash
quasar dev -m electron
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v1.quasar.dev/quasar-cli/quasar-conf-js).