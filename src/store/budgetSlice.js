import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load budget from localStorage
export const loadBudget = createAsyncThunk(
  'budget/loadBudget',
  async () => {
    const storedBudget = localStorage.getItem('budget');
    return storedBudget ? JSON.parse(storedBudget) : { amount: 0 };
  }
);

// Save budget to localStorage
const saveBudgetToStorage = (budget) => {
  localStorage.setItem('budget', JSON.stringify(budget));
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budget: { amount: 0 },
    status: 'idle',
    error: null,
  },
  reducers: {
    setBudget: (state, action) => {
      state.budget = { amount: action.payload };
      saveBudgetToStorage(state.budget);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBudget.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadBudget.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budget = action.payload;
      })
      .addCase(loadBudget.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;