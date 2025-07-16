import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCart, addToCartAPI, removeFromCartAPI } from '../services/cartApi';

export const fetchCartItems = createAsyncThunk('cart/fetchCart', async (userId) => {
  const data = await fetchCart(userId);
  return data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product }, { getState, rejectWithValue }) => {
    const state = getState().cart.items;
    const exists = state.some((item) => item.productId === product.id);
    if (exists) {
      return rejectWithValue('Sản phẩm đã có trong giỏ hàng');
    }
    await addToCartAPI(userId, product.id);
    return await fetchCart(userId);
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }) => {
    await removeFromCartAPI(userId, productId);
    return await fetchCart(userId);
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.items = action.payload;
        state.error = null;
      });
  },
});

export const { clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
