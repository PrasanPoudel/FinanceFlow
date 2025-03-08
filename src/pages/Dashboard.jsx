import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadExpenses } from '../store/expensesSlice';
import { loadBudget } from '../store/budgetSlice';
import { loadCategories } from '../store/categoriesSlice';
import BudgetOverview from '../components/BudgetOverview';
import ExpenseList from '../components/ExpenseList';
import ExpenseCharts from '../components/ExpenseCharts';
import './Styles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.expenses);
  const { budget } = useSelector((state) => state.budget);
  const { categories } = useSelector((state) => state.categories);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(loadExpenses());
    dispatch(loadBudget());
    dispatch(loadCategories());
  }, [dispatch]);

  // Filter expenses for the current month and year
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Calculate total spent for the current month
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Get month name
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long' });

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="dashboard">
      <div className="month-selector">
        <button onClick={handlePreviousMonth}>Previous</button>
        <h2> {monthName} {currentYear}</h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>

      <BudgetOverview 
        budget={budget.amount} 
        spent={totalSpent} 
      />

      <div className="dashboard-content">
        <div className="expense-stats">
          <ExpenseCharts 
            expenses={filteredExpenses} 
            categories={categories} 
          />
        </div>
        
        <div className="recent-expenses">
          <h3>Recent Expenses</h3>
          <ExpenseList 
            expenses={filteredExpenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)} 
            categories={categories} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;