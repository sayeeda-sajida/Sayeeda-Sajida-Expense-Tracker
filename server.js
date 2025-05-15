import express from "express";
import cors from "cors";
import db from "./db.js";

const expense = express();
expense.use(cors());
expense.use(express.urlencoded({ extended: true }));
expense.use(express.json());

// Centralized Error Handler
const handleError = (res, error, message, status = 500) => {
  console.error(message, error.message);
  res.status(status).json({ message });
};

// Route to add New expense
expense.post("/expenses", (request, response) => {
  const { amount, category, date } = request.body;

  if (!amount || !category || !date) {
    return response.status(400).json({ message: "All fields are required" });
  }

  if (isNaN(amount)) {
    return response.status(400).json({ message: "Amount must be a number" });
  }

  const query = `INSERT INTO expenses (amount, category, date) VALUES (?, ?, ?)`;
  db.query(query, [amount, category, date], (error, result) => {
    if (error) {
      return handleError(response, error, "Error adding expense");
    }

    const newExpense = {
      id: result.insertId,
      amount,
      category,
      date,
    };

    response.status(201).json({
      message: "Expense added successfully!",
      expense: newExpense,
    });
  });
});

// Delete expense by ID
expense.delete("/expenses/:id", (request, response) => {
  const expenseId = parseInt(request.params.id);

  if (isNaN(expenseId)) {
    return response.status(400).json({ error: "Invalid Expense ID" });
  }

  const query = "DELETE FROM expenses WHERE id = ?";
  db.query(query, [expenseId], (err, results) => {
    if (err) {
      return handleError(response, err, "Error deleting Expense");
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({ message: "Expense not found" });
    }
    response.json({ message: "Expense deleted successfully" });
  });
});

// Fetch single expense by ID
expense.get("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Expense ID" });
  }
  
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM expenses WHERE id = ?",
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    handleError(res, err, "Database error");
  }
});

// Edit and update single expense
expense.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Expense ID" });
  }
  if (!amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (isNaN(amount)) {
    return res.status(400).json({ message: "Amount must be a number" });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE expenses SET amount = ?, category = ?, date = ? WHERE id = ?",
      [amount, category, date, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Expense details updated successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (err) {
    handleError(res, err, "Error updating Expense details");
  }
});

// Get all expenses
expense.get("/expenses", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM expenses");
    res.status(200).json(rows);
  } catch (err) {
    handleError(res, err, "Database error");
  }
});

// Start server
expense.listen(8000, () => {
  console.log("Server started on port 8000");
});
