# E-commerce System Design

## Auth Service

- **Login**: Email/password, Google, Facebook, Apple
- **Register**: Email/password, Google, Facebook, Apple
- **Forgot Password**: Email with OTP verification
- **Refresh token**: Auto refresh token with refresh token
- **Session Management**: Track active sessions and allow users to log out from all devices

---

## User Service

- **Profile Management**:
  - View profile
  - Edit profile (avatar, name, phone number, address, etc.)
- **User Preferences**:
  - Notification settings (email, push)

---

## Shop Service

- **Shop Details**:
  - View shop profile (name, description, location, contact)
- **Shop Management**:
  - Create/edit shop (profile, banner)

---

## Product Service

- **Product Details**:
  - View product detail, images
  - Check stock availability
- **Product Management**:
  - Add/edit/delete product

---

## Search Service

- **Search by Keyword**:
  - Advanced filters: Category, location, price range, brand, rating, availability
  - Sort options: Relevance, price (ascending/descending), popularity, newest
- **Search by Image**:
  - Image recognition for matching products
- **Suggestions**:
  - Autocomplete for search terms

---

## Chat Service

- **Chat Features**:
  - Real-time messaging (user and shop)
  - Message history

---

## Recommend Service

- **Product Recommendations**:
  - Top-selling products
  - Personalized recommendations (based on user browsing/purchase history)
- **Shop Recommendations**:
  - Popular shops in the user’s location/category

---

## Cart Service

- **Cart Management**:
  - Add/edit/remove products in the cart
- **Cart Calculations**:
  - Calculate total price (including discounts, taxes, shipping)
  - Real-time stock check for cart items

---

## Order Service

- **Order Management**:
  - Place an order (with multi-shop support)
  - View order details and status (processing, shipped, delivered)
  - Cancel/refund/return order
  - Order history
- **Order Tracking**:
  - Notifications for order status changes

---

## Payment Service

- **Payment Integration**:
  - Support multiple payment methods (credit/debit cards)
- **Transaction History**:
  - Log payment transactions for users and shops

---

## Notification Service

- **Push Notifications**: Mobile, web
- **Email Notifications**: Order updates, promotions

---

## Admin Service

- **Management**:
  - Users, shops, and products
- **Reports**:
  - Sales, traffic, performance
