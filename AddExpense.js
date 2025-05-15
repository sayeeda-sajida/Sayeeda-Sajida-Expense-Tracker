import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Importing the styles

const AddExpense = () => {
  const [formData, setFormData] = useState({ amount: "", category: "", date: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/expenses", formData)
      .then(() => navigate("/"))
      .catch((error) => console.error("Error adding expense:", error));
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <table className="form-table">
        <tbody>
          <tr>
            <td><label>Amount:</label></td>
            <td>
              <input 
                className="form-input" 
                name="amount" 
                placeholder="Amount" 
                onChange={handleChange} 
              />
            </td>
          </tr>
          <tr>
            <td><label>Category:</label></td>
            <td>
              <input 
                className="form-input" 
                name="category" 
                placeholder="Category" 
                onChange={handleChange} 
              />
            </td>
          </tr>
          <tr>
            <td><label>Date:</label></td>
            <td>
              <input 
                className="form-input" 
                type="date" 
                name="date" 
                placeholder="Date" 
                onChange={handleChange} 
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit">Add Expense</button><br />
      <a href="/">Back to Expense</a>
    </form>
  );
};

export default AddExpense;
