import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, updateCategory, deleteCategory } from '../store/categoriesSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './Styles/Categories.css';

const Categories = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { expenses } = useSelector((state) => state.expenses);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#333333' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Start adding a new category
  const handleAddNew = () => {
    setIsAddingCategory(true);
    setIsEditingCategory(false);
    setFormData({ name: '', color: '#333333' });
    setErrors({});
  };

  // Start editing a category
  const handleEdit = (category) => {
    setIsEditingCategory(true);
    setIsAddingCategory(false);
    setEditingId(category.id);
    setFormData({ name: category.name, color: category.color });
    setErrors({});
  };

  // Handle category deletion
  const handleDelete = (categoryId) => {
    // Check if category is in use
    const isInUse = expenses.some(expense => expense.categoryId === categoryId);
    
    if (isInUse) {
      alert('Cannot delete category that is being used by expenses. Please reassign those expenses first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(categoryId));
    }
  };

  // Validate category form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (
      categories.some(
        category => 
          category.name.toLowerCase() === formData.name.toLowerCase() &&
          category.id !== editingId
      )
    ) {
      newErrors.name = 'A category with this name already exists';
    }
    
    if (!formData.color) {
      newErrors.color = 'Color is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEditingCategory) {
        dispatch(updateCategory({ 
          id: editingId,
          ...formData
        }));
        setIsEditingCategory(false);
      } else {
        dispatch(addCategory(formData));
        setIsAddingCategory(false);
      }
      setFormData({ name: '', color: '#333333' });
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsAddingCategory(false);
    setIsEditingCategory(false);
    setFormData({ name: '', color: '#333333' });
    setErrors({});
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Expense Categories</h2>
        <button className="add-button" onClick={handleAddNew}>
          <FaPlus /> Add Category
        </button>
      </div>
      
      {(isAddingCategory || isEditingCategory) && (
        <div className="category-form-container">
          <form onSubmit={handleSubmit} className="category-form">
            <h3>{isEditingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Groceries"
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="color">Category Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
              {errors.color && <div className="error">{errors.color}</div>}
            </div>
            
            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {isEditingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="categories-list">
        {categories.length === 0 ? (
          <div className="no-categories">
            <p>No categories found. Add your first category to start organizing expenses.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div 
                      className="color-swatch" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </td>
                  <td>{category.name}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(category)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Categories;
