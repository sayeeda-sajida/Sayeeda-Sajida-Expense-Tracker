import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css"; // Importing the styles

const EditExpense = () => {
  const [formData, setFormData] = useState({ amount: "", category: "", date: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/expenses/${id}`)
      .then((response) => {
        const expenseData = response.data;
        if (expenseData.date) {
          expenseData.date = new Date(expenseData.date).toISOString().split("T")[0];
        }
        setFormData(expenseData);
      })
      .catch((error) => console.error("Error fetching expense:", error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/expenses/${id}`, formData)
      .then(() => navigate("/"))
      .catch((error) => console.error("Error updating expense:", error));
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2 className="form-title">Edit Expense</h2>

      <table className="form-table">
        <tbody>
          <tr>
            <td><label>Amount:</label></td>
            <td>
              <input 
                className="form-input" 
                name="amount" 
                value={formData.amount} 
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
                value={formData.category} 
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
                value={formData.date} 
                onChange={handleChange} 
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button  type="submit">Update Expense</button><br />
      <a href="/" >Back to Expense</a>
    </form>
  );
};

export default EditExpense;
