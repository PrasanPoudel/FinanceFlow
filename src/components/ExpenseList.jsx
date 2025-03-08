import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteExpense } from '../store/expensesSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Styles/ExpenseList.css';

const ExpenseList = ({ expenses, categories }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  // Find category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(category => category.id === categoryId) || { name: 'Uncategorized', color: '#AAAAAA' };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <div className="no-expenses">
          <p>No expenses found for this period.</p>
          <Link to="/add-expense" className="btn">Add Your First Expense</Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const category = getCategoryById(expense.categoryId);
              return (
                <tr key={expense.id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span 
                      className="category-chip" 
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  </td>
                  <td>Rs.{Number(expense.amount).toFixed(2)}</td>
                  <td className="actions">
                    <Link to={`/add-expense?id=${expense.id}`} className="edit-btn">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDelete(expense.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
