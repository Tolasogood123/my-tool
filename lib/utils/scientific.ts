/**
 * Safe scientific expression evaluator.
 *
 * The expression is tokenized and evaluated with the shunting-yard algorithm.
 * `eval`, `new Function` and other dynamic code paths are never used, so any
 * string the user types is treated strictly as mathematics.
 */

export type AngleMode = "rad" | "deg";

export interface ExpressionResult {
  result: number | null;
  error: string | null;
}

type Token =
  | { kind: "number"; value: number }
  | { kind: "name"; value: string }
  | { kind: "op"; value: string; prec: number; rightAssoc: boolean }
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "comma" };

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
  tau: Math.PI * 2,
};

const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "cbrt",
  "log",
  "ln",
  "abs",
  "exp",
  "round",
  "floor",
  "ceil",
]);

function binaryOp(value: string): { prec: number; rightAssoc: boolean } {
  switch (value) {
    case "+":
    case "-":
      return { prec: 1, rightAssoc: false };
    case "*":
    case "/":
      return { prec: 2, rightAssoc: false };
    case "^":
      return { prec: 4, rightAssoc: true };
    default:
      return { prec: 0, rightAssoc: false };
  }
}

/** Converts the input string into tokens, or returns an error message. */
function tokenize(input: string): Token[] | string {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input.charAt(i);

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    // Numbers, including decimals and scientific notation such as 1.5e-3.
    if (/[0-9.]/.test(ch)) {
      let literal = "";
      while (i < input.length && /[0-9.]/.test(input.charAt(i))) {
        literal += input.charAt(i);
        i += 1;
      }
      if (i < input.length && /[eE]/.test(input.charAt(i))) {
        const exponentStart = i;
        let j = i + 1;
        if (j < input.length && /[+-]/.test(input.charAt(j))) j += 1;
        if (j < input.length && /[0-9]/.test(input.charAt(j))) {
          literal += input.charAt(i);
          i += 1;
          if (i < input.length && /[+-]/.test(input.charAt(i))) {
            literal += input.charAt(i);
            i += 1;
          }
          while (i < input.length && /[0-9]/.test(input.charAt(i))) {
            literal += input.charAt(i);
            i += 1;
          }
        } else {
          i = exponentStart;
        }
      }
      const value = Number(literal);
      if (!Number.isFinite(value) || literal.split(".").length > 2) {
        return `Invalid number "${literal}".`;
      }
      tokens.push({ kind: "number", value });
      continue;
    }

    // Names: functions and constants.
    if (/[a-zA-Z]/.test(ch)) {
      let name = "";
      while (i < input.length && /[a-zA-Z]/.test(input.charAt(i))) {
        name += input.charAt(i);
        i += 1;
      }
      tokens.push({ kind: "name", value: name.toLowerCase() });
      continue;
    }

    if ("+-*/^".includes(ch)) {
      const { prec, rightAssoc } = binaryOp(ch);
      tokens.push({ kind: "op", value: ch, prec, rightAssoc });
      i += 1;
      continue;
    }

    if (ch === "(") {
      tokens.push({ kind: "lparen" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "rparen" });
      i += 1;
      continue;
    }
    if (ch === ",") {
      tokens.push({ kind: "comma" });
      i += 1;
      continue;
    }

    return `Unexpected character "${ch}". Use numbers, operators, brackets and supported functions.`;
  }

  return tokens;
}

function isUnaryContext(previous: Token | null): boolean {
  if (!previous) return true;
  return previous.kind === "op" || previous.kind === "lparen" || previous.kind === "comma";
}

function stackPrecedence(token: Token): number {
  if (token.kind === "op") return token.prec;
  if (token.kind === "name") return 6;
  return 0;
}

function toRadians(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * Math.PI) / 180 : value;
}

function fromRadians(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * 180) / Math.PI : value;
}

function applyFunction(name: string, value: number, mode: AngleMode): number {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(value, mode));
    case "cos":
      return Math.cos(toRadians(value, mode));
    case "tan":
      return Math.tan(toRadians(value, mode));
    case "asin":
      return fromRadians(Math.asin(value), mode);
    case "acos":
      return fromRadians(Math.acos(value), mode);
    case "atan":
      return fromRadians(Math.atan(value), mode);
    case "sqrt":
      return Math.sqrt(value);
    case "cbrt":
      return Math.cbrt(value);
    case "log":
      return Math.log10(value);
    case "ln":
      return Math.log(value);
    case "abs":
      return Math.abs(value);
    case "exp":
      return Math.exp(value);
    case "round":
      return Math.round(value);
    case "floor":
      return Math.floor(value);
    case "ceil":
      return Math.ceil(value);
    default:
      return Number.NaN;
  }
}

/** Evaluates an expression. Returns either a finite result or a helpful error. */
export function evaluateExpression(input: string, mode: AngleMode = "rad"): ExpressionResult {
  if (!input || input.trim() === "") {
    return { result: null, error: "Enter an expression to evaluate." };
  }

  const tokenized = tokenize(input);
  if (typeof tokenized === "string") {
    return { result: null, error: tokenized };
  }
  const tokens = tokenized;

  const output: Token[] = [];
  const operators: Token[] = [];
  let previous: Token | null = null;

  for (const token of tokens) {
    if (token.kind === "number") {
      output.push(token);
    } else if (token.kind === "name") {
      if (Object.prototype.hasOwnProperty.call(CONSTANTS, token.value)) {
        output.push({ kind: "number", value: CONSTANTS[token.value] });
      } else if (FUNCTIONS.has(token.value)) {
        operators.push(token);
      } else {
        return { result: null, error: `Unknown name "${token.value}". Supported functions: sin, cos, tan, sqrt, log, ln and more.` };
      }
    } else if (token.kind === "op") {
      let current = token;
      if ((current.value === "+" || current.value === "-") && isUnaryContext(previous)) {
        const afterPower = previous?.kind === "op" && previous.value === "^";
        current = {
          kind: "op",
          value: current.value === "-" ? "u-" : "u+",
          prec: afterPower ? 5 : 3,
          rightAssoc: false,
        };
      }
      while (operators.length > 0) {
        const top = operators[operators.length - 1];
        if (top.kind === "lparen") break;
        const topPrec = stackPrecedence(top);
        if (topPrec > current.prec || (topPrec === current.prec && !current.rightAssoc)) {
          output.push(operators.pop() as Token);
        } else {
          break;
        }
      }
      operators.push(current);
    } else if (token.kind === "lparen") {
      operators.push(token);
    } else if (token.kind === "rparen") {
      let matched = false;
      while (operators.length > 0) {
        const top = operators.pop() as Token;
        if (top.kind === "lparen") {
          matched = true;
          break;
        }
        output.push(top);
      }
      if (!matched) return { result: null, error: "Mismatched brackets: a closing bracket has no matching opening bracket." };
      if (operators.length > 0 && operators[operators.length - 1].kind === "name") {
        output.push(operators.pop() as Token);
      }
    } else if (token.kind === "comma") {
      let matched = false;
      while (operators.length > 0) {
        const top = operators.pop() as Token;
        if (top.kind === "lparen") {
          operators.push(top);
          matched = true;
          break;
        }
        output.push(top);
      }
      if (!matched) return { result: null, error: "A comma can only be used inside brackets." };
    }
    previous = token;
  }

  while (operators.length > 0) {
    const top = operators.pop() as Token;
    if (top.kind === "lparen") {
      return { result: null, error: "Mismatched brackets: an opening bracket was never closed." };
    }
    output.push(top);
  }

  const stack: number[] = [];
  for (const token of output) {
    if (token.kind === "number") {
      stack.push(token.value);
      continue;
    }

    if (token.kind === "name") {
      if (stack.length < 1) return { result: null, error: `Function "${token.value}" is missing an input.` };
      const value = applyFunction(token.value, stack.pop() as number, mode);
      if (!Number.isFinite(value)) {
        return { result: null, error: `${token.value}() has no real value for that input (check the domain).` };
      }
      stack.push(value);
      continue;
    }

    if (token.kind === "op") {
      if (token.value === "u-" || token.value === "u+") {
        if (stack.length < 1) return { result: null, error: "A sign is missing its value." };
        const value = stack.pop() as number;
        stack.push(token.value === "u-" ? -value : value);
        continue;
      }
      if (stack.length < 2) {
        return { result: null, error: `Operator "${token.value}" is missing a value on one side.` };
      }
      const right = stack.pop() as number;
      const left = stack.pop() as number;
      let value: number;
      switch (token.value) {
        case "+":
          value = left + right;
          break;
        case "-":
          value = left - right;
          break;
        case "*":
          value = left * right;
          break;
        case "/":
          value = left / right;
          break;
        case "^":
          value = Math.pow(left, right);
          break;
        default:
          return { result: null, error: `Unsupported operator "${token.value}".` };
      }
      if (!Number.isFinite(value)) {
        return { result: null, error: "That calculation does not produce a finite number (check division by zero or the exponent)." };
      }
      stack.push(value);
      continue;
    }

    return { result: null, error: "The expression could not be read. Check brackets and operators." };
  }

  if (stack.length !== 1) {
    return { result: null, error: "The expression is incomplete. Check that every operator has two values." };
  }

  return { result: stack[0], error: null };
}

/** Cleans up floating-point noise such as 0.30000000000000004. */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const cleaned = Number(value.toPrecision(12));
  return Object.is(cleaned, -0) ? "0" : String(cleaned);
}
