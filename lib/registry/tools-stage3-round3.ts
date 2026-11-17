import type { Tool } from "@/types/tool";

/** Stage 3, Round 3 tools. */
export const stage3Round3Tools: Tool[] = [
  {
    slug: "cgpa-calculator",
    title: "CGPA Calculator",
    description:
      "Calculate cumulative GPA across multiple semesters by credit hours. Add or remove semesters and see total credits, grade points and the final CGPA instantly.",
    category: "student-education",
    keywords: ["cgpa calculator", "cumulative gpa calculator", "semester gpa calculator", "cgpa 4.0", "college cgpa"],
    icon: "GraduationCap",
    status: "ready",
    popularity: 86,
    addedAt: "2026-11-18",
    related: ["gpa-calculator", "final-grade-calculator", "grade-calculator"],
    content: {
      what: "The CGPA Calculator combines semester GPAs into one cumulative average, weighted by each semester's credit hours. A semester with 20 credits affects the result more than one with 12 credits. Each row shows a semester name, credits and SGPA on the 4.0 scale, and the result includes total credits and grade points so you can check the math.",
      howTo: [
        "Enter a semester label and its credit hours for each completed term.",
        "Enter that semester's GPA on the 4.0 scale.",
        "Add more semester rows as needed, or remove any row that does not belong.",
        "Click Calculate CGPA and check the total credits and points.",
      ],
      example:
        "18 credits at SGPA 3.5 plus 20 credits at SGPA 3.8 gives (18×3.5 + 20×3.8) ÷ 38 = 139 ÷ 38 = 3.66 CGPA.",
      benefits: [
        "See how difficult semesters affect your overall average.",
        "Plan graduation requirements with a clear cumulative figure.",
        "Formula and totals are shown so results can be verified by hand.",
        "No transcript data is stored or uploaded.",
      ],
      faqs: [
        {
          q: "What is the difference between GPA and CGPA?",
          a: "GPA usually refers to one term, while CGPA is the credit-weighted average across all terms. This tool takes per-semester GPAs and combines them.",
        },
        {
          q: "Can I enter grades instead of SGPA?",
          a: "Not here. Use the GPA Calculator for individual courses with letter grades. If you already know each semester's GPA, this tool is faster.",
        },
        {
          q: "Does it include pass/fail courses?",
          a: "Only if your school assigns them grade points. Enter zero-weight or exclude them based on your institution's rules; the tool uses exactly what you enter.",
        },
        {
          q: "What if my university uses a 10-point scale?",
          a: "Convert each semester GPA to the 4.0 scale first using your institution's conversion table, then enter those values here.",
        },
      ],
    },
  },
  {
    slug: "grade-calculator",
    title: "Grade Calculator",
    description:
      "Work out your current weighted grade from assessments, scores and weights. See each contribution and a total-weight warning before you calculate.",
    category: "student-education",
    keywords: ["grade calculator", "weighted grade calculator", "course grade calculator", "assessment grade", "score weight calculator"],
    icon: "TrendingUp",
    status: "ready",
    popularity: 85,
    addedAt: "2026-11-18",
    related: ["final-grade-calculator", "gpa-calculator", "cgpa-calculator"],
    content: {
      what: "The Grade Calculator computes a weighted course grade from any number of assessments. For each item you enter a score and the percentage it contributes to the course. The tool reports the current grade, the total counted weight, and each assessment's contribution in points. It also tells you when the entered weights do not yet add up to 100%.",
      howTo: [
        "Add each completed assessment with its score out of 100.",
        "Enter the weight of that assessment as a percentage of the course.",
        "Check the total weight line: it should reach 100% for a final grade.",
        "Click Calculate grade and review the per-assessment contributions.",
      ],
      example:
        "A midterm scored 85 worth 30% and a quiz scored 90 worth 20% give (85×30 + 90×20) ÷ 50 = 87% across the 50% of the course completed so far.",
      benefits: [
        "Understand how much each assessment moves your grade.",
        "Spot missing assessments when the weight total is under 100%.",
        "Transparent formula shown next to the result.",
        "Works on mobile with no account and no stored marks.",
      ],
      faqs: [
        {
          q: "How is this different from the Final Grade Calculator?",
          a: "This tool calculates the grade you currently have from completed work. The Final Grade Calculator answers the reverse question: what score you need on remaining work to hit a target.",
        },
        {
          q: "What if my weights add up to less than 100?",
          a: "The result is the grade for the portion completed so far. The tool shows the counted weight so you know which assessments are still missing.",
        },
        {
          q: "Can I use points instead of percentages?",
          a: "Enter the score as a percentage of the maximum for that assessment, and the weight as its share of the course. Raw points need to be converted first.",
        },
        {
          q: "Does it round intermediate results?",
          a: "No. All math uses full precision and only the displayed values are rounded, so your result stays accurate.",
        },
      ],
    },
  },
  {
    slug: "pomodoro-timer",
    title: "Pomodoro Timer",
    description:
      "Run focus sessions and breaks with a simple Pomodoro timer. Customize durations, track completed sessions and get a short tone when each interval ends.",
    category: "productivity",
    keywords: ["pomodoro timer", "focus timer", "study timer", "productivity timer", "25 minute timer"],
    icon: "Timer",
    status: "ready",
    popularity: 88,
    addedAt: "2026-11-18",
    related: ["days-between-dates", "word-counter", "age-calculator"],
    content: {
      what: "The Pomodoro Timer alternates focused work with short and long breaks. The classic pattern is 25 minutes of focus, a 5-minute break, and a 15-minute long break after every fourth focus session. You can change each duration from 1 to 120 minutes, pause or reset at any time, and see a progress bar plus a count of completed focus sessions. A quiet tone plays when an interval finishes, if your browser allows audio.",
      howTo: [
        "Choose Focus, Short break, or Long break.",
        "Adjust the minute values if the defaults do not suit you.",
        "Click Start and work until the timer reaches zero.",
        "Use Pause or Reset as needed; the next mode is suggested automatically.",
      ],
      example:
        "A student runs four 25-minute focus sessions with 5-minute breaks between them, then takes the suggested 15-minute long break before starting again.",
      benefits: [
        "Build focus in manageable chunks without another account.",
        "Automatic long break after every fourth session.",
        "Visible progress bar and session counter for motivation.",
        "Runs entirely in the open tab with no tracking or sync.",
      ],
      faqs: [
        {
          q: "Do I need to keep the tab open?",
          a: "Yes. The timer runs in the browser tab using JavaScript intervals. Background tabs may be throttled by the browser, so keep the page visible for accurate timing.",
        },
        {
          q: "Does it send notifications?",
          a: "No. It plays a short tone through the Web Audio API and shows an on-page message. It does not request notification permission.",
        },
        {
          q: "Why is the sound silent?",
          a: "Browsers block audio until a user gesture. Sound is enabled when you click Start; some browsers or devices may still mute it.",
        },
        {
          q: "Is my session history saved?",
          a: "No. The counter resets when you leave the page. It is a lightweight focus aid, not a time-tracking service.",
        },
      ],
    },
  },
];
