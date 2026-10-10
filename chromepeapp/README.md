# ChromePe

A PhonePe-inspired UPI payments Android app built with React Native (TypeScript). V1 uses mock/dummy data — no backend required.

## Features

- 🏠 **Home Dashboard** — balance card, quick actions, recent transactions
- 💸 **Send Money** — UPI ID input, amount, success screen
- 📷 **Scan & Pay** — static QR viewfinder + manual UPI entry
- 🕐 **Transaction History** — filterable list with detail view
- 👛 **Wallet** — linked bank accounts, add money / transfer (mock)
- 📱 **Recharge** — mobile recharge with plan selection
- 🧾 **Pay Bills** — electricity, water, gas, broadband (mock)
- 👤 **Profile** — user info, UPI ID, settings

## Prerequisites

- Node.js 18+
- JDK 17
- Android Studio with emulator (API 29+) OR physical Android device with USB debugging enabled

## Setup

```bash
git clone <repo>
cd chrome-pay
npm install
```

## Run on Android

Terminal 1 — start Metro bundler:
```bash
npx react-native start
```

Terminal 2 — build & install on device/emulator:
```bash
npx react-native run-android
```

## Project Structure

```
src/
├── components/   Reusable UI components
├── data/         Mock data (no backend)
├── navigation/   Tab + stack navigators
├── screens/      One file per screen
└── theme/        Color palette
App.tsx           Entry point
```
# App-Payment-Infra
