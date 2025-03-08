import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import './Styles/ExpenseCharts.css';

const ExpenseCharts = ({ expenses, categories }) => {
  const [chartType, setChartType] = useState('pie');

  // No data message
  if (expenses.length === 0) {
    return (
      <div className="expense-charts">
        <div className="chart-tabs">
          <button 
            className={chartType === 'pie' ? 'active' : ''} 
            onClick={() => setChartType('pie')}
          >
            Category Distribution
          </button>
          <button 
            className={chartType === 'bar' ? 'active' : ''} 
            onClick={() => setChartType('bar')}
          >
            Daily Spending
          </button>
        </div>
        <div className="no-data">
          <p>No expense data available for visualization.</p>
        </div>
      </div>
    );
  }

  // Prepare data for pie chart (category distribution)
  const preparePieData = () => {
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      if (categoryTotals[expense.categoryId]) {
        categoryTotals[expense.categoryId] += Number(expense.amount);
      } else {
        categoryTotals[expense.categoryId] = Number(expense.amount);
      }
    });
    
    return Object.keys(categoryTotals).map(categoryId => {
      const category = categories.find(cat => cat.id === categoryId) || 
                      { name: 'Uncategorized', color: '#AAAAAA' };
      
      return {
        name: category.name,
        value: categoryTotals[categoryId],
        color: category.color
      };
    });
  };

  // Prepare data for bar chart (daily spending)
  const prepareBarData = () => {
    const dailyTotals = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      
      if (dailyTotals[date]) {
        dailyTotals[date] += Number(expense.amount);
      } else {
        dailyTotals[date] = Number(expense.amount);
      }
    });
    
    return Object.keys(dailyTotals)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({
        date: date,
        amount: dailyTotals[date]
      }));
  };

  const pieData = preparePieData();
  const barData = prepareBarData();

  return (
    <div className="expense-charts">
      <div className="chart-tabs">
        <button 
          className={chartType === 'pie' ? 'active' : ''} 
          onClick={() => setChartType('pie')}
        >
          Category Distribution
        </button>
        <button 
          className={chartType === 'bar' ? 'active' : ''} 
          onClick={() => setChartType('bar')}
        >
          Daily Spending
        </button>
      </div>

      <div className="chart-container">
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={75}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`Rs.${value.toFixed(2)}`, 'Amount']} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`Rs.${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" name="Daily Spending" fill="#3f51b5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ExpenseCharts;