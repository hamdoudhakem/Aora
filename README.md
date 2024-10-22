# Aora

Aora is a React Native application that allows users to share and explore AI-generated videos. Engage with a community of creators by liking and discovering unique AI-driven content.

## Features

- **Share AI-Generated Videos**: Upload and showcase your own AI-created videos.

- **Like and Discover**: Interact with videos from other users and see trending content.

- **User Authentication**: Secure sign-up and login system to manage your content and interactions.

## Getting Started

To get started with Aora, follow these steps:

1. Clone the repository:

```
git clone https://github.com/hamdoudhakem/Aora.git
cd Aora
```

2. Install dependencies:

```
npm install
```

3. Run the app:

```
npm run android (or ios)
```

## Troubleshooting

If you face some problems regarding notifee when running `npm run android` then go to the `android/build.gradle` file and make sure that this line is there (if not add it!) :

```
maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }
```
