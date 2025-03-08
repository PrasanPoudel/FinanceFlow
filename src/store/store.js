import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './expensesSlice';
import budgetReducer from './budgetSlice';
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    budget: budgetReducer,
    categories: categoriesReducer,
  },
});