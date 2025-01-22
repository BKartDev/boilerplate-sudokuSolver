'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const getRowIndex = (letter) =>
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].indexOf(letter.toLowerCase());

const coordinateRegex = /^([a-i])([1-9])$/i;
const valueRegex = /^[1-9]$/;

module.exports = function (app) {
  const solver = new SudokuSolver();

  // POST route for '/api/check'
  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check if all required fields are present
    let error = !puzzle || !coordinate || !value ? 'Required field(s) missing' : '';
    if (error) {
      return res.json({ error });
    }

    // Validate the puzzle, coordinate, and value
    error = solver.checkPuzzleString(puzzle) ||
      (!coordinate.match(coordinateRegex) && 'Invalid coordinate') ||
      (!value.match(valueRegex) && 'Invalid value');

    if (error) {
      return res.json({ error });
    }

    // Get row and column index from coordinate
    const rowIndex = getRowIndex(coordinate[0]);
    const colIndex = Number(coordinate[1]) - 1;

    // Return the check result
    return res.json(solver.check(puzzle, rowIndex, colIndex, value));
  });

  // POST route for '/api/solve'
  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    // Return the solved puzzle result
    return res.json(solver.solve(puzzle));
  });
};
