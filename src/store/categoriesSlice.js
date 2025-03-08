import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Default categories
const defaultCategories = [
  { id: '1', name: 'Food', color: '#FF5733' },
  { id: '2', name: 'Transportation', color: '#33FF57' },
  { id: '3', name: 'Housing', color: '#3357FF' },
  { id: '4', name: 'Entertainment', color: '#F033FF' },
  { id: '5', name: 'Utilities', color: '#FF9033' },
  { id: '6', name: 'Shopping', color: '#339FFF' },
  { id: '7', name: 'Health', color: '#FF3390' },
  { id: '8', name: 'Other', color: '#AAAAAA' },
];

// Load categories from localStorage
export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async () => {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : defaultCategories;
  }
);

// Save categories to localStorage
const saveCategoriesToStorage = (categories) => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: defaultCategories,
    status: 'idle',
    error: null,
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({
        id: Date.now().toString(),
        ...action.payload,
      });
      saveCategoriesToStorage(state.categories);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
      saveCategoriesToStorage(state.categories);
    },
    updateCategory: (state, action) => {
      const { id, ...updates } = action.payload;
      const categoryIndex = state.categories.findIndex(category => category.id === id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = {
          ...state.categories[categoryIndex],
          ...updates,
        };
        saveCategoriesToStorage(state.categories);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addCategory, deleteCategory, updateCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;