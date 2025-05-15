// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExpenseManagement from "./ExpenseManagement";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import "./App.css";

const App = () => {
  return (
  
      <div className="App">
        <Routes>
          <Route path="/" element={<ExpenseManagement />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/edit/:id" element={<EditExpense />} />
        </Routes>
      </div>
 
  );
};

export default App;
