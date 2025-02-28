const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

// Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to the Prismatic Employees API.");
});

// Retrieve all employees
app.get("/employees", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// Add new employee
app.post("/employees", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name is required and must be a valid string." });
    }

    const newEmployee = await prisma.employee.create({
      data: { name: name.trim() },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
});

// Retrieve employee by ID
app.get("/employees/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

app.put("/employees/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Name is required and must be a valid." });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.json(updatedEmployee);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Employee not found." });
    }
    next(error);
  }
});

// DELETE employee by ID
app.delete("/employees/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.employee.delete({ where: { id } });

    res.status(204).send(); 
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Employee not found." });
    }
    next(error);
  }
});

// Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
