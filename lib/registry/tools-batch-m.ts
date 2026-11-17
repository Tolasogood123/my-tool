import type { Tool } from "@/types/tool";

/** Batch M: student-education tools (scientific calculator through study planner). */
export const batchMTools: Tool[] = [
  {
    slug: "scientific-calculator",
    title: "Scientific Calculator",
    description:
      "Evaluate expressions with powers, brackets and functions such as sin, cos, sqrt and log. Switch between radians and degrees and calculate safely without eval.",
    category: "student-education",
    keywords: [
      "scientific calculator",
      "online calculator with steps",
      "trigonometry calculator",
      "square root calculator",
      "expression evaluator",
      "powers and exponents calculator",
    ],
    icon: "Calculator",
    status: "ready",
    popularity: 85,
    addedAt: "2026-11-22",
    related: ["matrix-calculator", "equation-solver", "percentage-calculator", "grade-calculator"],
    content: {
      what: "The Scientific Calculator evaluates mathematical expressions typed with ordinary keyboard characters. It supports the four basic operations, powers with ^, grouping brackets, and functions including sin, cos, tan, sqrt, log, ln and absolute value. Constants pi, e and tau are built in, and you can switch trigonometry between radians and degrees. A tokenizer and the shunting-yard algorithm turn your expression into a value; the browser's eval and Function constructors are never used, so text you type is always treated as mathematics rather than code.",
      howTo: [
        "Type an expression such as (sin(pi/2) + sqrt(16)) * 2 into the expression field, or use the token buttons to insert functions and operators.",
        "Choose Radians or Degrees depending on the unit your trigonometry question uses.",
        "Press Calculate or hit Enter to see the result.",
        "Copy the answer from the result box, or reset to start a new calculation.",
      ],
      example:
        "A student checks (sin(pi/2) + sqrt(16)) * 2. sin(pi/2) is 1 and sqrt(16) is 4, so the calculator returns 10. Switching to degrees, cos(60) returns 0.5.",
      benefits: [
        "Handles operator precedence and nested brackets the way a textbook expects.",
        "Radian and degree modes cover both GCSE/A-level and college trigonometry.",
        "No dynamic code execution, so expressions are evaluated safely in your browser.",
        "Quick-insert buttons reduce typos for brackets and function names.",
      ],
      faqs: [
        {
          q: "Why does 2^3^2 give 512 instead of 64?",
          a: "Exponentiation is right-associative in mathematics, so 2^3^2 means 2^(3^2) = 2^9 = 512. Add brackets as (2^3)^2 if you want 64.",
        },
        {
          q: "What is the difference between log and ln?",
          a: "log is the base-10 logarithm and ln is the natural logarithm (base e). Both are provided, along with exp for e raised to a power.",
        },
        {
          q: "Does it run code from my expression?",
          a: "No. The expression is tokenized and converted to reverse Polish notation with the shunting-yard algorithm, then evaluated numerically. No eval, Function, or script execution takes place.",
        },
        {
          q: "Why do I get a domain error for sqrt(-1)?",
          a: "This calculator returns real numbers only. The square root of a negative number is not real, so it reports a domain error. Use the Equation Solver if you need complex roots of an equation.",
        },
      ],
    },
  },
  {
    slug: "matrix-calculator",
    title: "Matrix Calculator",
    description:
      "Add, subtract and multiply matrices, and compute determinants, inverses and transposes with clear dimension validation and a copyable result.",
    category: "student-education",
    keywords: [
      "matrix calculator",
      "determinant calculator",
      "inverse matrix calculator",
      "matrix multiplier",
      "transpose calculator",
      "linear algebra tool",
    ],
    icon: "Braces",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["scientific-calculator", "equation-solver", "gpa-calculator", "grade-calculator"],
    content: {
      what: "The Matrix Calculator performs the core operations of linear algebra in your browser. Enter each matrix as rows of numbers, one row per line and cells separated by spaces or commas. You can add, subtract or multiply two matrices, or work with a single matrix to find its determinant, inverse or transpose. Before calculating, the tool checks that dimensions are compatible and explains exactly why an operation is not allowed when they are not.",
      howTo: [
        "Type matrix A into the first box and matrix B into the second, using one line per row.",
        "Check the live dimension labels (for example 2×3) shown under each box.",
        "Choose an operation from the dropdown: add, subtract, multiply, determinant, inverse or transpose.",
        "Click Calculate and read the result grid, then copy or download the text version.",
      ],
      example:
        "With A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]], multiplication gives [[19, 22], [43, 50]] and the determinant of A is -2. Adding a 2×3 matrix to a 3×2 one shows an equal-dimension error.",
      benefits: [
        "Immediate dimension validation prevents silent, wrong answers.",
        "Gaussian elimination gives reliable determinants and inverses.",
        "Results are shown as a readable grid and as plain text you can export.",
        "No installation or account needed; everything runs locally.",
      ],
      faqs: [
        {
          q: "How should I type a matrix?",
          a: "Put each row on its own line and separate values with spaces, commas or tabs. Square brackets are optional, so both '1 2' on a line and '[1, 2]' are accepted.",
        },
        {
          q: "Why can't I add my two matrices?",
          a: "Addition and subtraction require identical dimensions. If A is 2×3 and B is 3×2, they cannot be added even though both contain six numbers.",
        },
        {
          q: "When does a matrix have no inverse?",
          a: "A square matrix is invertible only when its determinant is nonzero. If elimination finds a zero pivot, the tool reports that the matrix is singular and has no inverse.",
        },
        {
          q: "Can I transpose matrix B instead of A?",
          a: "Yes. The operation menu includes transpose for both matrices, so you can flip whichever one you need without swapping the text in the input boxes.",
        },
      ],
    },
  },
  {
    slug: "equation-solver",
    title: "Equation Solver",
    description:
      "Solve linear and quadratic equations with the discriminant, real roots and a full list of working steps. Handles decimals and negative discriminants clearly.",
    category: "student-education",
    keywords: [
      "equation solver",
      "quadratic formula calculator",
      "linear equation solver",
      "discriminant calculator",
      "solve for x",
      "algebra steps calculator",
    ],
    icon: "Calculator",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: ["scientific-calculator", "matrix-calculator", "final-grade-calculator", "percentage-calculator"],
    content: {
      what: "The Equation Solver handles equations of the form ax + b = 0 and ax² + bx + c = 0. It returns the roots, the discriminant for quadratics, and a numbered set of working steps you can follow or copy into your notes. Decimal coefficients are supported, repeated roots are identified, and a negative discriminant produces a clear 'no real roots' answer together with the complex pair for reference. Coefficients can be positive, negative or zero.",
      howTo: [
        "Select Linear or Quadratic as the equation type.",
        "Enter the coefficients a, b and (for quadratics) c. Decimals and negative values are fine.",
        "Check the live equation preview to confirm it matches your question.",
        "Click Solve equation to see the roots, discriminant and each working step.",
      ],
      example:
        "For x² − 3x + 2 = 0, the discriminant is 1 and the roots are x = 2 and x = 1. For x² + 1 = 0, the discriminant is -4 and the tool reports no real roots with the complex pair x = 0 ± 1i.",
      benefits: [
        "Shows the method, not just the answer, so you can learn the process.",
        "Detects repeated roots and inconsistent or identity linear equations.",
        "Accepts decimal coefficients without forcing awkward rounding.",
        "Exports the full solution as text for homework or revision notes.",
      ],
      faqs: [
        {
          q: "What happens when the quadratic coefficient a is zero?",
          a: "The equation is no longer quadratic. The solver notes this and solves the remaining bx + c = 0 as a linear equation, so you still get a correct answer.",
        },
        {
          q: "How are no-real-root cases shown?",
          a: "When the discriminant is negative, the solver states that there are no real roots, explains why the graph does not cross the x-axis, and lists the complex conjugate pair separately.",
        },
        {
          q: "Can I enter fractions such as 1/2?",
          a: "Enter their decimal equivalents, for example 0.5. The coefficient fields are numeric, so a typed fraction like 1/2 would not be interpreted as division.",
        },
        {
          q: "Are answers rounded?",
          a: "Displayed values keep up to six decimal places and remove trailing zeroes, while the internal calculation uses full floating-point precision. Exact-looking results such as roots of 4 are shown as whole numbers.",
        },
      ],
    },
  },
  {
    slug: "citation-generator",
    title: "Citation Generator",
    description:
      "Build APA 7 and MLA 9 references for websites, books and journal articles from simple form fields, complete with in-text citations and one-click copy.",
    category: "student-education",
    keywords: [
      "citation generator",
      "APA citation maker",
      "MLA citation generator",
      "bibliography builder",
      "works cited generator",
      "reference formatter",
    ],
    icon: "FileText",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["ai-writing-assistant", "ai-summarizer", "word-counter", "study-timetable-generator"],
    content: {
      what: "The Citation Generator turns a few form fields into a correctly punctuated bibliography entry. Choose APA 7th or MLA 9th edition, then pick a website, book or journal article. Fill in authors, title, publication details and a URL or DOI, and the tool assembles the reference list line plus the matching in-text citation. Author names can be entered as 'Last, First' and multiple authors are separated with & or the word 'and'.",
      howTo: [
        "Pick APA 7 or MLA 9, then choose the source type: website, book or journal article.",
        "Fill in the author name(s) and the title. The remaining fields adapt to the chosen source type.",
        "Add the year and any month, day, publisher, volume, issue, pages, URL or DOI you have.",
        "Click Generate citation, then copy the reference and in-text form into your document.",
      ],
      example:
        "For Smith, John with the page 'Note-taking that works' on Example Site dated 14 March 2026, APA gives: Smith, J. (2026, Mar. 14). Note-taking that works. Example Site. https://example.com/notes. MLA gives: Smith, John. “Note-taking that works.” Example Site, 14 Mar. 2026, https://example.com/notes.",
      benefits: [
        "Follows common APA 7 and MLA 9 patterns for the most-used source types.",
        "Adapts the form so you only see fields relevant to your source.",
        "Produces both the reference entry and the short in-text citation.",
        "Copy or download the result as plain text for any word processor.",
      ],
      faqs: [
        {
          q: "How should I enter multiple authors?",
          a: "Separate names with an ampersand (&) or the word 'and'. Two authors are joined correctly in both styles; with three or more, the tool uses the common 'et al.' shortened form.",
        },
        {
          q: "Do I need both a URL and a DOI?",
          a: "No. Provide whichever you have. If you enter a DOI without a URL, it is converted to a https://doi.org/ link in the final citation.",
        },
        {
          q: "Is this a substitute for my style manual?",
          a: "It covers standard cases only. Unusual sources such as edited volumes, datasets, theses or works with more than twenty authors should be checked against the official APA or MLA guide.",
        },
        {
          q: "Why does MLA use quotation marks around the title?",
          a: "MLA places article, page and chapter titles in quotation marks and italicises the container, while book titles are italicised. The generator applies the correct punctuation pattern for each source type.",
        },
      ],
    },
  },
  {
    slug: "study-timetable-generator",
    title: "Study Timetable Generator",
    description:
      "Turn a list of subjects and weekly hours into a balanced study timetable across your chosen days, then export it as CSV or print a clean weekly plan.",
    category: "student-education",
    keywords: [
      "study timetable generator",
      "study planner",
      "revision schedule maker",
      "weekly study plan",
      "timetable creator",
      "homework planner tool",
    ],
    icon: "CalendarDays",
    status: "ready",
    popularity: 76,
    addedAt: "2026-11-22",
    related: ["pomodoro-timer", "citation-generator", "days-between-dates", "gpa-calculator"],
    content: {
      what: "The Study Timetable Generator allocates your weekly study hours across the days you are free. Add subjects with hours per week and a priority, choose your study days, and set a session length and daily time window. The planner breaks each subject into sessions, places higher-priority work first, spreads sessions evenly across days, and inserts short breaks where they fit. The result is a day-by-day schedule with start and end times, a CSV export and a printer-friendly view.",
      howTo: [
        "Add each subject with the number of hours you want to study it per week and a priority from 1 to 10.",
        "Tick the days of the week you are available to study.",
        "Set the session length in minutes and the earliest and latest study hour.",
        "Click Generate timetable, then export the CSV or use Print for a tidy paper copy.",
      ],
      example:
        "With Mathematics 5 hours at priority 5, Biology 4 hours at priority 4 and History 3 hours at priority 3 across Monday to Friday, 50-minute sessions between 09:00 and 18:00, the tool builds a balanced week of roughly fourteen study blocks and reports the total hours planned.",
      benefits: [
        "Converts an abstract weekly target into concrete time slots.",
        "Balances workload so no single day is overloaded when alternatives exist.",
        "CSV export drops straight into spreadsheets or calendar imports.",
        "Warnings appear when the chosen window is too small to fit every session.",
      ],
      faqs: [
        {
          q: "What does the priority number do?",
          a: "Higher-priority subjects are placed first and receive earlier, more convenient slots. All subjects are still scheduled; priority only changes the order in which sessions are assigned.",
        },
        {
          q: "Why did some hours not get scheduled?",
          a: "If your daily window and chosen days do not provide enough minutes, the planner shows a warning naming the subject and the minutes it could not place. Widen the window, add a day or shorten sessions.",
        },
        {
          q: "Can I use it for a revision timetable before exams?",
          a: "Yes. Set each subject's weekly hours based on how much revision it needs, give weaker topics a higher priority, and regenerate the plan whenever your availability changes.",
        },
        {
          q: "Does the timetable include breaks?",
          a: "A short ten-minute break is inserted between sessions when it fits inside your time window. If the window is tight, sessions run back to back so no planned study time is lost.",
        },
      ],
    },
  },
];
