# ShopEZ 

DSW02B1 Test 2 - Student: 224038893

## Features
- User Authentication (Register/Login)
- Product Listing from Fake Store API
- Product Details View
- Shopping Cart with real-time sync
- Offline cart persistence
- Firebase Realtime Database integration

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
Firebase Configuration

### 3. Run the App
```bash
npx expo start
```

### 4. Testing the App
1. Register a new account or login
2. Browse products from Fake Store API
3. View product details
4. Add items to cart
5. Test cart functionality (add/remove/quantity)
6. Test offline persistence by restarting the app

## Project Structure
```
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ProductsScreen.js
│   ├── ProductDetailScreen.js
│   └── CartScreen.js
├── App.js
├── firebaseConfig.js
└── package.json
```