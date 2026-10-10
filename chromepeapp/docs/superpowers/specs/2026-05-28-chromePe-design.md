# ChromePe — V1 Design Spec

**Date:** 2026-05-28  
**Stack:** React Native (TypeScript)  
**Theme:** PhonePe purple `#5f259f`  
**Data:** Mock/dummy data only (no backend)

---

## 1. Overview

ChromePe is an Android payments app modelled after PhonePe. V1 delivers the essential UPI + wallet experience: send/receive money, scan QR, check balance, recharge mobile, and pay bills — all with hardcoded mock data.

---

## 2. Screens & Navigation

### Navigation Structure
- **Root:** React Navigation bottom tab navigator (5 tabs)
- Each tab owns a stack navigator for its internal flows

### Tabs
| Tab | Icon | Screen |
|-----|------|--------|
| Home | 🏠 | Dashboard |
| Scan | 📷 | Scan & Pay |
| History | 🕐 | Transaction History |
| Wallet | 👛 | Wallet & Bank |
| Profile | 👤 | Profile |

### Screen Inventory
1. **Splash Screen** — ChromePe logo, purple bg, auto-navigates to Home after 2s
2. **Home / Dashboard**
   - Greeting + user name
   - Balance card (wallet + linked bank)
   - Quick actions: Send, Request, Recharge, Pay Bills
   - Recent transactions list (last 5, mock data)
3. **Send Money** (from Home → Send)
   - Contact search / UPI ID input
   - Amount entry
   - Confirm & Pay (mock success)
   - Success screen with confetti / checkmark
4. **Scan & Pay**
   - Camera QR scanner placeholder (static viewfinder UI)
   - Manual UPI ID entry fallback
   - Recent contacts row
5. **Transaction History**
   - Full list of mock transactions
   - Filter tabs: All / Sent / Received / Recharge
   - Transaction detail on tap
6. **Wallet & Bank**
   - Total balance card with Add Money / Transfer actions (mock)
   - Linked accounts list (2 mock banks)
   - Link new account button (mock)
7. **Recharge** (from Home → Recharge)
   - Mobile number input
   - Operator + plan selection (mock plans)
   - Confirm recharge (mock success)
8. **Pay Bills** (from Home → Bills)
   - Category grid: Electricity, Water, Gas, Broadband
   - Bill entry form (mock)
   - Confirm payment (mock success)
9. **Profile**
   - User avatar, name, phone number
   - UPI ID display
   - Settings list items (mock, no navigation)

---

## 3. Architecture

```
chrome-pay/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Root tab + stack navigators
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SendMoneyScreen.tsx
│   │   ├── ScanPayScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── RechargeScreen.tsx
│   │   ├── BillsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── TransactionDetailScreen.tsx
│   ├── components/
│   │   ├── BalanceCard.tsx
│   │   ├── QuickActionButton.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── ContactAvatar.tsx
│   │   └── SuccessOverlay.tsx
│   ├── data/
│   │   └── mockData.ts            # All dummy data
│   ├── theme/
│   │   └── colors.ts              # #5f259f + palette
│   └── App.tsx
├── android/
├── package.json
└── README.md
```

---

## 4. Tech Stack

| Concern | Library |
|---------|---------|
| Framework | React Native 0.73+ |
| Language | TypeScript |
| Navigation | `@react-navigation/native` + bottom-tabs + stack |
| Icons | `react-native-vector-icons` (MaterialIcons) |
| Safe area | `react-native-safe-area-context` |
| Gesture | `react-native-gesture-handler` |
| Status bar | `react-native-status-bar` |

---

## 5. Color Palette

```ts
primary:    '#5f259f'   // ChromePe purple
primaryDark:'#4a1a7d'
accent:     '#f5a623'   // gold for highlights
background: '#f5f5f5'
card:       '#ffffff'
success:    '#28a745'
error:      '#dc3545'
textPrimary:'#1a1a1a'
textSecondary:'#666666'
```

---

## 6. Mock Data

- 1 user: Prasad, +91-98765-43210, prasad@chrompe
- 2 linked banks: HDFC ₹8,200 / SBI ₹4,250
- Wallet balance: ₹12,450
- 10 mock transactions (mix of sent/received/recharge)
- 3 recent contacts: Amit, Rahul, Priya

---

## 7. Error Handling

- All flows terminate with a success screen (no real errors in mock mode)
- Invalid UPI ID → inline validation message
- Empty amount → disabled Pay button

---

## 8. Out of Scope (V1)

- Real QR scanning (camera hardware)
- Authentication / PIN / biometrics
- Real UPI / bank integration
- Push notifications
- Dark mode
