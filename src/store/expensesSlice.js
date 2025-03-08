import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load expenses from localStorage
export const loadExpenses = createAsyncThunk(
  'expenses/loadExpenses',
  async () => {
    const storedExpenses = localStorage.getItem('expenses');
    return storedExpenses ? JSON.parse(storedExpenses) : [];
  }
);

// Save expenses to localStorage
const saveExpensesToStorage = (expenses) => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push({
        id: Date.now().toString(),
        ...action.payload,
        date: new Date(action.payload.date).toISOString(),
      });
      saveExpensesToStorage(state.expenses);
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      saveExpensesToStorage(state.expenses);
    },
    updateExpense: (state, action) => {
      const { id, ...updates } = action.payload;
      const expenseIndex = state.expenses.findIndex(expense => expense.id === id);
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = {
          ...state.expenses[expenseIndex],
          ...updates,
          date: new Date(updates.date).toISOString(),
        };
        saveExpensesToStorage(state.expenses);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(loadExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addExpense, deleteExpense, updateExpense } = expensesSlice.actions;
export default expensesSlice.reducer;