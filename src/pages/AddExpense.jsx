import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addExpense, updateExpense } from '../store/expensesSlice';
import './Styles/AddExpense.css';

const AddExpense = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { expenses } = useSelector((state) => state.expenses);
  const { categories } = useSelector((state) => state.categories);
  
  // Get expense ID from URL query params if editing
  const queryParams = new URLSearchParams(location.search);
  const expenseId = queryParams.get('id');
  
  // Initialize form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().substr(0, 10),
    categoryId: categories.length > 0 ? categories[0].id : '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Load expense data if editing
  useEffect(() => {
    if (expenseId) {
      const expenseToEdit = expenses.find(expense => expense.id === expenseId);
      if (expenseToEdit) {
        setFormData({
          description: expenseToEdit.description,
          amount: expenseToEdit.amount,
          date: new Date(expenseToEdit.date).toISOString().substr(0, 10),
          categoryId: expenseToEdit.categoryId,
          notes: expenseToEdit.notes || ''
        });
        setIsEditing(true);
      }
    }
  }, [expenseId, expenses]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEditing) {
        dispatch(updateExpense({ 
          id: expenseId,
          ...formData,
          amount: Number(formData.amount)
        }));
      } else {
        dispatch(addExpense({
          ...formData,
          amount: Number(formData.amount)
        }));
      }
      navigate('/');
    }
  };

  return (
    <div className="add-expense">
      <h2>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.amount && <div className="error">{errors.amount}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <div className="error">{errors.date}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <div className="error">{errors.categoryId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional details..."
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;