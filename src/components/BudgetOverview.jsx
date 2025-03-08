import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Styles/BudgetOverview.css';

const BudgetOverview = ({ budget, spent }) => {
  // Calculate percentage spent
  const percentage = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 50) return '#4CAF50'; // Green
    if (percentage < 75) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <div className="budget-overview">
      <div className="budget-chart">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: '16px',
            pathColor: getColor(),
            textColor: '#333',
            trailColor: '#d6d6d6',
          })}
        />
      </div>
      <div className="budget-details">
        <h2>Monthly Budget</h2>
        <div className="budget-item">
          <span>Budget:</span>
          <span>Rs.{budget.toFixed(2)}</span>
        </div>
        <div className="budget-item">
          <span>Spent:</span>
          <span>Rs.{spent.toFixed(2)}</span>
        </div>
        <div className="budget-item">
          <span>Remaining:</span>
          <span className={budget - spent < 0 ? 'negative' : 'positive'}>
            Rs.{(budget - spent).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
