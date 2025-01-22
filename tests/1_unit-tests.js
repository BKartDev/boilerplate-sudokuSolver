const chai = require('chai')
const assert = chai.assert

const Solver = require('../controllers/sudoku-solver.js')
let solver = new Solver()

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

suite('UnitTests', () => {
  test('logic handles a valid puzzle string of 81 characters', function () {
    assert.equal('', solver.checkPuzzleString(puzzlesAndSolutions[0][0]))
  })

  test('logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    assert.equal(
      'Invalid characters in puzzle',
      solver.checkPuzzleString(puzzlesAndSolutions[0][0].replace('8', '0'))
    )
  })

  test("logic handles a puzzle string that's not 81 characters in length", function () {
    assert.equal(
      'Expected puzzle to be 81 characters long',
      solver.checkPuzzleString(puzzlesAndSolutions[0][0].slice(0, 80))
    )
  })

  test('Logic handles a valid row placement', function () {
    assert.equal(
      '',
      solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 3)
    )
  })
  test('Logic handles an invalid row placement', function () {
    assert.equal(
      'error',
      solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 5),
      'Logic handles an invalid row placement'
    )
  })

  test('Logic handles a valid column placement', function () {
    assert.equal(
      solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 0, 7),
      ''
    )
  })

  test('Logic handles an invalid column placement', function () {
    assert.equal(
      solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 2),
      'error'
    )
  })

  test('Logic handles a valid region (3x3 grid) placement', function () {
    assert.equal(
      solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 4, 4, 4),
      ''
    )
  })

  test('Logic handles an invalid region (3x3 grid) placement', function () {
    assert.equal(
      solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 1, 1),
      'error'
    )
  })

  test('Valid puzzle strings pass the solver', function () {
    let {solution} = solver.solve(puzzlesAndSolutions[0][0])
    assert.equal( solution, puzzlesAndSolutions[0][1])
  })

  test('Invalid puzzle strings fail the solver', function () {
    let {error} = solver.solve(puzzlesAndSolutions[0][0].replace(/\./g, '8'))
    assert.equal( error, 'Puzzle cannot be solved')
  })

  test('Solver returns the expected solution for an incomplete puzzle', function () {

    let {solution} = solver.solve(puzzlesAndSolutions[0][0])
    assert.equal(solution, puzzlesAndSolutions[0][1])
  })
})