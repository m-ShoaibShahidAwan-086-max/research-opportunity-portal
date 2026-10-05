const express = require('express');
const router = express.Router();
const pool = require('../db');

// Checks the data sent by the user. Returns a message if something is wrong.
function validate(b) {
  const required = ['title', 'description', 'research_area', 'faculty_name',
                    'department', 'required_skills', 'positions', 'deadline'];
  for (const field of required) {
    if (b[field] === undefined || b[field] === null || String(b[field]).trim() === '') {
      return field + ' is required';
    }
  }
  if (!Number.isInteger(Number(b.positions)) || Number(b.positions) < 1) {
    return 'positions must be a whole number of 1 or more';
  }
  if (isNaN(Date.parse(b.deadline))) {
    return 'deadline must be a valid date like 2026-12-31';
  }
  if (b.status && !['Open', 'Closed'].includes(b.status)) {
    return 'status must be Open or Closed';
  }
  return null;
}

// CREATE a new opportunity
router.post('/', async (req, res) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });

    const b = req.body;
    const [result] = await pool.query(
      `INSERT INTO opportunities
       (title, description, research_area, faculty_name, department,
        required_skills, positions, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.title, b.description, b.research_area, b.faculty_name, b.department,
       b.required_skills, b.positions, b.deadline, b.status || 'Open']
    );

    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all opportunities
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;