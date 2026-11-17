/** Pure matrix arithmetic with dimension validation. */

export type Matrix = number[][];

export interface MatrixResult {
  matrix: Matrix | null;
  scalar: number | null;
  error: string | null;
}

export interface MatrixDimensions {
  rows: number;
  cols: number;
}

const EPSILON = 1e-10;

/** Parses pasted matrix text: rows on new lines, cells separated by spaces/commas/tabs. */
export function parseMatrix(text: string): { matrix: Matrix | null; error: string | null } {
  if (!text || text.trim() === "") return { matrix: null, error: null };

  const rows: Matrix = [];
  const lines = text.replace(/[\[\]]/g, "").split(/\r?\n/);
  for (const line of lines) {
    if (line.trim() === "") continue;
    const cells = line
      .split(/[\s,;]+/)
      .map((cell) => cell.trim())
      .filter(Boolean);
    if (cells.length === 0) continue;
    const parsed = cells.map(Number);
    if (parsed.some((value) => !Number.isFinite(value))) {
      return { matrix: null, error: `Row ${rows.length + 1} contains a value that is not a number.` };
    }
    rows.push(parsed);
  }

  if (rows.length === 0) return { matrix: null, error: null };
  const cols = rows[0].length;
  if (cols === 0) return { matrix: null, error: "Each row needs at least one number." };
  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i].length !== cols) {
      return {
        matrix: null,
        error: `Row ${i + 1} has ${rows[i].length} values but row 1 has ${cols}. All rows must be the same length.`,
      };
    }
  }
  return { matrix: rows, error: null };
}

export function dimensions(matrix: Matrix): MatrixDimensions {
  return { rows: matrix.length, cols: matrix.length > 0 ? matrix[0].length : 0 };
}

function clean(value: number): number {
  if (Math.abs(value) < EPSILON) return 0;
  return Number(value.toPrecision(12));
}

function ok(matrix: Matrix): MatrixResult {
  return { matrix: matrix.map((row) => row.map(clean)), scalar: null, error: null };
}

function fail(error: string): MatrixResult {
  return { matrix: null, scalar: null, error };
}

export function addMatrices(a: Matrix, b: Matrix): MatrixResult {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    return fail(`Addition needs equal dimensions. A is ${da.rows}×${da.cols}, B is ${db.rows}×${db.cols}.`);
  }
  return ok(a.map((row, i) => row.map((value, j) => value + b[i][j])));
}

export function subtractMatrices(a: Matrix, b: Matrix): MatrixResult {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.rows !== db.rows || da.cols !== db.cols) {
    return fail(`Subtraction needs equal dimensions. A is ${da.rows}×${da.cols}, B is ${db.rows}×${db.cols}.`);
  }
  return ok(a.map((row, i) => row.map((value, j) => value - b[i][j])));
}

export function multiplyMatrices(a: Matrix, b: Matrix): MatrixResult {
  const da = dimensions(a);
  const db = dimensions(b);
  if (da.cols !== db.rows) {
    return fail(`Multiplication needs A's columns (${da.cols}) to equal B's rows (${db.rows}).`);
  }
  const result: Matrix = [];
  for (let i = 0; i < da.rows; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < db.cols; j += 1) {
      let sum = 0;
      for (let k = 0; k < da.cols; k += 1) {
        sum += a[i][k] * b[k][j];
      }
      row.push(sum);
    }
    result.push(row);
  }
  return ok(result);
}

export function transposeMatrix(a: Matrix): MatrixResult {
  const { rows, cols } = dimensions(a);
  const result: Matrix = [];
  for (let j = 0; j < cols; j += 1) {
    const row: number[] = [];
    for (let i = 0; i < rows; i += 1) row.push(a[i][j]);
    result.push(row);
  }
  return ok(result);
}

/** Determinant by Gaussian elimination with partial pivoting. */
export function determinantMatrix(a: Matrix): MatrixResult {
  const { rows, cols } = dimensions(a);
  if (rows !== cols) return fail(`A determinant needs a square matrix. This one is ${rows}×${cols}.`);
  if (rows === 0) return fail("Enter a matrix first.");

  const work = a.map((row) => row.slice());
  let det = 1;
  for (let col = 0; col < rows; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < rows; r += 1) {
      if (Math.abs(work[r][col]) > Math.abs(work[pivot][col])) pivot = r;
    }
    if (Math.abs(work[pivot][col]) < EPSILON) {
      return { matrix: null, scalar: 0, error: null };
    }
    if (pivot !== col) {
      const swap = work[col];
      work[col] = work[pivot];
      work[pivot] = swap;
      det *= -1;
    }
    det *= work[col][col];
    for (let r = col + 1; r < rows; r += 1) {
      const factor = work[r][col] / work[col][col];
      for (let c = col; c < rows; c += 1) {
        work[r][c] -= factor * work[col][c];
      }
    }
  }
  return { matrix: null, scalar: clean(det), error: null };
}

/** Inverse by Gauss-Jordan elimination. Returns an error for singular matrices. */
export function inverseMatrix(a: Matrix): MatrixResult {
  const { rows, cols } = dimensions(a);
  if (rows !== cols) return fail(`An inverse needs a square matrix. This one is ${rows}×${cols}.`);
  if (rows === 0) return fail("Enter a matrix first.");

  const n = rows;
  const augmented: number[][] = [];
  for (let i = 0; i < n; i += 1) {
    const row = a[i].slice();
    for (let j = 0; j < n; j += 1) row.push(i === j ? 1 : 0);
    augmented.push(row);
  }

  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(augmented[r][col]) > Math.abs(augmented[pivot][col])) pivot = r;
    }
    if (Math.abs(augmented[pivot][col]) < EPSILON) {
      return fail("This matrix is singular (determinant is zero), so it has no inverse.");
    }
    if (pivot !== col) {
      const swap = augmented[col];
      augmented[col] = augmented[pivot];
      augmented[pivot] = swap;
    }
    const divisor = augmented[col][col];
    for (let c = 0; c < n * 2; c += 1) augmented[col][c] /= divisor;
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const factor = augmented[r][col];
      if (factor === 0) continue;
      for (let c = 0; c < n * 2; c += 1) {
        augmented[r][c] -= factor * augmented[col][c];
      }
    }
  }

  return ok(augmented.map((row) => row.slice(n)));
}

/** Aligns a matrix into a monospace-friendly text block. */
export function formatMatrix(matrix: Matrix): string {
  if (matrix.length === 0) return "";
  const widths = matrix[0].map((_, col) =>
    Math.max(...matrix.map((row) => formatCell(row[col]).length)),
  );
  return matrix
    .map((row) => row.map((value, col) => formatCell(value).padStart(widths[col])).join("  "))
    .join("\n");
}

function formatCell(value: number): string {
  const cleaned = clean(value);
  return Number.isInteger(cleaned) ? String(cleaned) : cleaned.toFixed(4).replace(/\.?0+$/, "");
}
