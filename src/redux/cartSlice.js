import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCart,
  addToCartAPI,
  removeFromCartAPI,
  updateCartItemQuantityAPI,
} from '../services/cartApi';

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await fetchCart(userId);
      return data;
    } catch (err) {
      return rejectWithValue('Lỗi khi lấy giỏ hàng');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product, quantity = 1 }, { rejectWithValue }) => {
    try {
      await addToCartAPI(userId, product.id, quantity);
      const updatedCart = await fetchCart(userId);
      return updatedCart;
    } catch (err) {
      return rejectWithValue('Không thể thêm sản phẩm vào giỏ hàng');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await removeFromCartAPI(userId, productId);
      const updatedCart = await fetchCart(userId);
      return updatedCart;
    } catch (err) {
      return rejectWithValue('Không thể xoá sản phẩm khỏi giỏ hàng');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      await updateCartItemQuantityAPI(userId, productId, quantity);
      const updatedCart = await fetchCart(userId);
      return updatedCart;
    } catch (err) {
      return rejectWithValue('Không thể cập nhật số lượng');
    }
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
      state.error = null;
    },
    setCart: (state, action) => {
      state.items = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
