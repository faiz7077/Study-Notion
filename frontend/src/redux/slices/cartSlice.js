import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';


const initialState = {
  cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  cartTotalAmount: localStorage.getItem('cartTotalAmount') ? JSON.parse(localStorage.getItem('cartTotalAmount')) : 0,
  cartItemsCount: localStorage.getItem('cartItemsCount') ? JSON.parse(localStorage.getItem('cartItemsCount')) : 0,
};

const cartSlice = createSlice({
  name: 'cart slice',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cartItems.findIndex((item) => item._id === course._id);

      if (index !== -1) {
        // Course is already added in cart
        toast.error('Course already in Cart');
        return;
      }

      state.cartItems.push(course);
      state.cartItemsCount++;
      state.cartTotalAmount += course.price;
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('cartItemsCount', JSON.stringify(state.cartItemsCount));
      localStorage.setItem('cartTotalAmount', JSON.stringify(state.cartTotalAmount));
      toast.success('Course added to cart');
    },

    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const index = state.cartItems.findIndex((item) => item._id === courseId);

      if (index !== -1) {
        // Course is present in cart
        state.cartItemsCount--;
        state.cartTotalAmount -= state.cartItems[index].price;
        state.cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        localStorage.setItem('cartItemsCount', JSON.stringify(state.cartItemsCount));
        localStorage.setItem('cartTotalAmount', JSON.stringify(state.cartTotalAmount));
        toast.success('Course removed from cart');
      }
    },

    resetCart: (state, action) => {
      state.cartItems = [];
      state.cartItemsCount = 0;
      state.cartTotalAmount = 0;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartItemsCount');
      localStorage.removeItem('cartTotalAmount');
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
