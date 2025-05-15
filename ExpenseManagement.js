import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styles.css';

// Utility function to format date to MM/DD/YYYY
const formatDate = (date) => {
  const newDate = new Date(date);
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();
  const year = newDate.getFullYear();
  return `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}/${year}`;
};

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/expenses")
      .then((response) => setExpenses(response.data))
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8000/expenses/${id}`)
      .then(() => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      })
      .catch((error) => console.error("Error deleting expense:", error));
  };

  // Calculate the total amount
  const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  return (
    <div className="container">
      <h2>Expense Management</h2>
      <button onClick={() => navigate("/add")}>Add Expense</button>

      <h3>Total Expenses: ₹{totalExpenses.toFixed(2)}</h3>

      <div className="expense-list">
        {expenses.map((expense) => (
          <div className="expense-item" key={expense.id}>
            <span>{expense.category} - ₹{expense.amount} - {formatDate(expense.date)}</span>
            <button onClick={() => navigate(`/edit/${expense.id}`)}>Edit</button>
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseManagement;
