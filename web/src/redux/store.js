import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import categoryReducer from './reducers/categorySlice';
import brandReducer from './reducers/brandSlice';
import productReducer from './reducers/productSlice';
import cartReducer from './reducers/cartSlice';
import orderReducer from './reducers/orderSlice';
import userReducer from './reducers/userSlice';
import paymentReducer from './reducers/paymentSlice';
import homeReducer from './reducers/homeSlice';
import dashboardReducer from './reducers/dashboardSlice';
const store = configureStore({
  reducer: {
    home: homeReducer,
    auth: authReducer,
    categories: categoryReducer,
    brands: brandReducer,
    products: productReducer,
    carts: cartReducer,
    orders: orderReducer,
    user: userReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
  },
});

export default store;