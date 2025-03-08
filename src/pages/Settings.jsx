import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBudget } from '../store/budgetSlice';
import './Styles/Settings.css';

const Settings = () => {
  const dispatch = useDispatch();
  const { budget } = useSelector((state) => state.budget);
  
  const [budgetAmount, setBudgetAmount] = useState(budget.amount);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle budget input change
  const handleBudgetChange = (e) => {
    setBudgetAmount(e.target.value);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate budget
    if (!budgetAmount) {
      setError('Please enter a budget amount');
      return;
    }
    
    const amount = Number(budgetAmount);
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    
    // Update budget
    dispatch(setBudget(amount));
    
    // Show success message
    setSuccessMessage('Budget updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>Monthly Budget</h3>
        
        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-group">
            <label htmlFor="budgetAmount">Set Your Monthly Budget (Rs)</label>
            <input
              type="number"
              id="budgetAmount"
              value={budgetAmount}
              onChange={handleBudgetChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {error && <div className="error">{error}</div>}
          </div>
          
          <button type="submit" className="save-btn">Save Budget</button>
          
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </form>
      </div>
      
      <div className="settings-section">
        <h3>Data Management</h3>
        
        <button 
          className="danger-btn"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          Reset All Data
        </button>
        
        <p className="warning-text">
          Warning: This will delete all your expenses, categories, and budget settings. 
          This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default Settings;
