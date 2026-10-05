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

// Checks that the id in the address is a positive whole number
function validId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
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

// GET one opportunity by id
router.get('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive number' });
    }
    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE an opportunity (send only the fields you want to change)
router.put('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive number' });
    }
    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Keep the old values, replace only what the user sent
    const merged = { ...rows[0], ...req.body };
    const error = validate(merged);
    if (error) return res.status(400).json({ error });

    await pool.query(
      `UPDATE opportunities SET title = ?, description = ?, research_area = ?,
       faculty_name = ?, department = ?, required_skills = ?, positions = ?,
       deadline = ?, status = ? WHERE id = ?`,
      [merged.title, merged.description, merged.research_area, merged.faculty_name,
       merged.department, merged.required_skills, merged.positions,
       merged.deadline, merged.status, req.params.id]
    );

    const [updated] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    res.status(200).json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE an opportunity
router.delete('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ error: 'id must be a positive number' });
    }
    const [result] = await pool.query('DELETE FROM opportunities WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;