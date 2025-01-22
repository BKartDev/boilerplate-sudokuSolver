var attemptCount = 0;

class SudokuSolver {
  checkPuzzleString(puzzleString) {
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    let validCharacters = puzzleString.match(/([1-9]|\.)/g);
    if (validCharacters.length !== 81) {
      return 'Invalid characters in puzzle';
    }
    if (this.isNotSolvable(puzzleString)) {
      return 'Puzzle cannot be solved';
    }
    return '';
  }
  
  isNotSolvable(puzzle) {
    let numberPattern = /[1-9]/g;
    for (var i = 0; i < puzzle.length; i += 9) {
      let filteredNumbers = puzzle.slice(i, i + 9).replace(/\./g, '');
      let uniqueNumbers = new Set(filteredNumbers.match(numberPattern));
      if (uniqueNumbers.size !== filteredNumbers.length) {
        return true;
      }
    }
    return false;
  }

  scanForErrors(string, value) {
    return string.split(value).length > 1 ? 'error' : '';
  }

  getColumn(puzzleString, index) {
    let columnString = '';
    for (var i = index; i < 81; i += 9) {
      columnString += puzzleString[i];
    }
    return columnString;
  }

  checkRowPlacement(puzzle, rowIdx, value) {
    let start = rowIdx * 9;
    let rowString = puzzle.slice(start, start + 9);
    return this.scanForErrors(rowString, value);
  }

  checkColPlacement(puzzle, colIdx, value) {
    let colString = this.getColumn(puzzle, colIdx);
    return this.scanForErrors(colString, value);
  }

  checkRegionPlacement(puzzle, rowIdx, colIdx, value) {
    let regionString = this.getRegion(puzzle, rowIdx, colIdx);
    return this.scanForErrors(regionString, value);
  }

  getRegion(puzzle, rowIdx, colIdx) {
    let rowStart = (rowIdx < 3 ? 0 : rowIdx <= 5 ? 3 : 6) * 9;
    let rowEnd = rowStart + 27;
    let rowString = puzzle.slice(rowStart, rowEnd);

    let colStart = colIdx < 3 ? 0 : colIdx <= 5 ? 3 : 6;
    let regionString = '';

    for (var i = colStart; i < 28; i += 9) {
      regionString += rowString.slice(i, i + 3);
    }
    return regionString;
  }

  getCoordinateValue(string, start) {
    return string.slice(start, start + 1);
  }

  solveRows(puzzle, rowIdx, num) {
    var start = Math.floor(rowIdx / 9) * 9;
    for (var i = 0; i < 9; i += 1) {
      if (puzzle[start + i] === num) {
        return false;
      }
    }
    return true;
  }

  solveColumns(puzzle, index, number) {
    var start = index % 9;
    for (var i = 0; i < 9; i += 1) {
      if (puzzle[start + i * 9] === number) {
        return false;
      }
    }
    return true;
  }

  solveRegions(puzzle, index, number) {
    let regColIdx = (index % 9) % 3;
    let start = index - (regColIdx + 9 * (Math.floor(index / 9) % 3));
    for (var i = 0; i < 9; i++) {
      let value = puzzle[start + 9 * Math.floor(i / 3) + (i % 3)];
      if (value === number) {
        return false;
      }
    }
    return true;
  }

  threeChecks(puzzle, index, number) {
    return (
      this.solveRows(puzzle, index, number) &&
      this.solveColumns(puzzle, index, number) &&
      this.solveRegions(puzzle, index, number)
    );
  }

  iterateSolve(puzzle, index) {
    if (++attemptCount > 1024 * 2) {
      return { err: 'Puzzle cannot be solved' };
    }
    if (index >= 81) {
      return true;
    } else if (puzzle[index] !== 0) {
      return this.iterateSolve(puzzle, index + 1);
    }
    for (var number = 1; number <= 9; number += 1) {
      if (this.threeChecks(puzzle, index, number)) {
        puzzle[index] = number;
        if (this.iterateSolve(puzzle, index + 1)) {
          return true;
        }
      }
    }
    puzzle[index] = 0;
    return false;
  }

  solve(puzzle) {
    let error = this.checkPuzzleString(puzzle);
    if (error) {
      return { error };
    }
    puzzle = puzzle.split('').map((element) => {
      return element === '.' ? 0 : parseInt(element, 10);
    });
    if (!this.iterateSolve(puzzle, 0)) {
      return { error: 'Puzzle cannot be solved' };
    }
    return { solution: puzzle.join('') };
  }

  check(puzzle, rowIdx, colIdx, value) {
    let error = this.checkPuzzleString(puzzle);
    if (error) {
      return { error };
    }

    let conflict = [];

    let coordinateValue = this.getCoordinateValue(puzzle, rowIdx * 9 + colIdx);
    if (coordinateValue === value) {
      return { valid: true };
    }
    let rowConflict =
      this.checkRowPlacement(puzzle, rowIdx, value).length > 0
        ? conflict.push('row')
        : null;
    let columnConflict =
      this.checkColPlacement(puzzle, colIdx, value).length > 0
        ? conflict.push('column')
        : null;
    let regionConflict =
      this.checkRegionPlacement(puzzle, rowIdx, colIdx, value).length > 0
        ? conflict.push('region')
        : null;

    return conflict.length > 0 ? { valid: false, conflict } : { valid: true };
  }
}

module.exports = SudokuSolver;
