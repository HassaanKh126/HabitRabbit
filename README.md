# Habit Rabbit 🚀

![Project Banner](./assets/banner.png)

## About
Habit Rabbit is an app that helps build habits in a fun and productive way.
You build habits and on completing the habits you get points (carrots) which can be used for the rabbit.

## Features
- User Authentication to keep your data synced across devices.
- Build Habits in a fun and productive way.

## Installation
1. Initialize a new React Native project:
   ```bash
   npx @react-native-community/cli init MyApp
   ```

2. Remove typescript:
    ```bash
    yarn remove typescript
    ```

3. Clone the repository:
    ```bash
    git clone https://github.com/HassaanKh126/HabitRabbit
    ```


4. Replace the default App entry:
    - Remove App.tsx.
    - Copy App.js and paste it in your project's root directory.

5. Add resources:
    - Copy the screens and assets folder and paste it in the root directory.
    - Copy and paste react-native.config.js.

6. Modify babel.config.js:
    - Open babel.config.js and add the worklets plugin
    ```bash
    plugins: ['react-native-worklets/plugin'],
    ```

7. Install dependencies: 
    ```bash
    yarn install
    ```

8. Build the release or debug APK(Android):
    - For Debug:
    ```bash
    cd android && ./gradlew assembleDebug
    ```

    - For Release:
    ```bash
    cd android && ./gradlew assembleRelease
    ```

9. Running Locally:
    ```bash
    yarn andorid
    ```
    The app should be working on the android emulator or the device connected to the PC/Laptop.

## Tech Stack
- React Native