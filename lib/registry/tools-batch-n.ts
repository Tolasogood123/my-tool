import type { Tool } from "@/types/tool";

/** Batch N: time-zone and everyday planning tools. */
export const batchNTools: Tool[] = [
  {
    slug: "time-zone-converter",
    title: "Time Zone Converter",
    description:
      "Convert a date and time between IANA time zones with accurate daylight-saving adjustments. See local times, offsets and abbreviations for several zones at once, entirely in your browser.",
    category: "productivity",
    keywords: [
      "time zone converter",
      "world clock converter",
      "convert time between zones",
      "IANA time zone converter",
      "daylight saving time converter",
      "meeting time zone tool",
    ],
    icon: "Clock3",
    status: "ready",
    popularity: 86,
    addedAt: "2026-11-22",
    related: [
      "meeting-time-planner",
      "unix-timestamp-converter",
      "days-between-dates",
    ],
    content: {
      what: "The Time Zone Converter takes a wall-clock date and time in one IANA time zone and shows the exact same moment in any number of other zones. It relies on the browser's Intl.DateTimeFormat with named zones such as America/New_York or Asia/Tokyo, so daylight-saving rules and historical offset changes are handled by the runtime rather than a hardcoded table. The result includes each zone's local date and time, its abbreviation, its current UTC offset and the underlying ISO 8601 instant.",
      howTo: [
        "Choose the source time zone from the searchable list of IANA zones.",
        "Enter the date and 24-hour time as it appears on a clock in that zone.",
        "Add one or more target zones to the comparison list.",
        "Click Convert time to see the matching moment in every selected zone.",
        "Copy or download the report to share exact times with other people.",
      ],
      example:
        "A project lead in Berlin enters 2026-11-17 at 09:00 in Europe/Berlin and adds UTC, America/New_York and Asia/Tokyo. The tool shows the same instant as 08:00 UTC, 03:00 EST in New York and 17:00 JST in Tokyo, with each zone's offset derived from Intl.",
      benefits: [
        "Handles daylight-saving transitions automatically through Intl.",
        "No hardcoded UTC offsets that go stale when rules change.",
        "Compares several zones side by side in one view.",
        "Shows the exact ISO 8601 instant for unambiguous scheduling.",
        "Runs locally with no network requests or stored data.",
      ],
      faqs: [
        {
          q: "Why use named zones instead of GMT offsets?",
          a: "A fixed offset such as GMT-5 ignores daylight saving and regional rule changes. Named IANA zones carry their full rule set, so the same zone can resolve to different offsets at different dates, and the browser computes the right one for you.",
        },
        {
          q: "What happens on a daylight-saving gap or overlap?",
          a: "Some local clock times do not exist in spring or occur twice in autumn. The converter detects when a wall time cannot round-trip and shows a note that the time was interpreted with the closest valid offset. If the exact moment matters, check the displayed ISO instant.",
        },
        {
          q: "Can I convert times from past decades?",
          a: "Yes. The browser's IANA database includes historical transitions for most regions, so conversions for past dates use the rules in effect at that time rather than today's offset.",
        },
        {
          q: "Does the tool know every time zone?",
          a: "It lists the zones provided by your browser through Intl.supportedValuesOf. On very old browsers a smaller curated fallback list is used, but the most common zones are always available.",
        },
        {
          q: "Is my data sent anywhere?",
          a: "No. All conversion happens in your browser with built-in Intl APIs. Nothing is uploaded, logged or stored.",
        },
      ],
    },
  },
  {
    slug: "meeting-time-planner",
    title: "Meeting Time Planner",
    description:
      "Find a shared working-hours window across multiple time zones. Set each participant's local workday and date, then see the exact overlap in UTC and in every local zone automatically.",
    category: "productivity",
    keywords: [
      "meeting time planner",
      "find meeting time across time zones",
      "working hours overlap calculator",
      "global team scheduling tool",
      "time zone overlap finder",
      "schedule meeting worldwide",
    ],
    icon: "CalendarRange",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: [
      "time-zone-converter",
      "days-between-dates",
      "pomodoro-timer",
    ],
    content: {
      what: "The Meeting Time Planner answers a common remote-work question: when is everyone awake and at work? Add each participant's IANA time zone and normal working hours, choose a date, and the tool converts every workday into a UTC interval using Intl. It then computes the intersection of those intervals and reports the shared window in UTC and in each local zone. If no overlap exists, it still shows every UTC window so you can see where the conflict sits.",
      howTo: [
        "Pick the calendar date on which you want to schedule the meeting.",
        "Add at least two participants and choose each one's time zone.",
        "Set the start and end of each person's local working window in 24-hour time.",
        "Click Find shared time to calculate the overlap.",
        "Review the local time for each participant and copy the plan to share it.",
      ],
      example:
        "On 2026-11-17 a team has members working 09:00–17:00 in Europe/London and 09:00–17:00 in Asia/Kolkata. The planner converts both windows to UTC and finds a shared slot of 09:30–10:30 UTC, which is 09:30–10:30 in London and 15:00–16:00 in Kolkata.",
      benefits: [
        "Removes manual offset arithmetic from global scheduling.",
        "Adapts automatically to daylight-saving changes on the chosen date.",
        "Shows a clear no-overlap explanation instead of a blank result.",
        "Supports overnight shifts by carrying end times past midnight.",
        "Keeps all participant details in your browser.",
      ],
      faqs: [
        {
          q: "What if the working windows do not overlap?",
          a: "The tool reports that there is no shared window on that date and lists each participant's working hours in UTC. You can then try another date or widen someone's hours and recalculate.",
        },
        {
          q: "Can I include someone whose workday crosses midnight?",
          a: "Yes. If the end time is earlier than the start time, the planner treats the end as belonging to the following day so night shifts are represented correctly.",
        },
        {
          q: "Does it account for public holidays?",
          a: "No. The planner only knows the recurring daily working window you provide. It cannot know regional holidays or time-off calendars.",
        },
        {
          q: "How many participants can I compare?",
          a: "Up to twelve zones can be compared at once, which is enough for most cross-functional teams while keeping the interface readable.",
        },
        {
          q: "Does this book a calendar event?",
          a: "No. It only calculates a suitable window. You can copy the generated report and paste it into your calendar invitation or chat message.",
        },
      ],
    },
  },
  {
    slug: "sleep-cycle-calculator",
    title: "Sleep Cycle Calculator",
    description:
      "Plan bedtimes or wake times around 90-minute sleep cycles. Compare four, five and six cycle options, include time needed to fall asleep, and read a clear non-medical disclaimer.",
    category: "productivity",
    keywords: [
      "sleep cycle calculator",
      "90 minute sleep cycle planner",
      "best bedtime calculator",
      "wake time bedtime planner",
      "sleep duration calculator",
      "sleep schedule tool",
    ],
    icon: "Timer",
    status: "ready",
    popularity: 77,
    addedAt: "2026-11-22",
    related: [
      "pomodoro-timer",
      "time-zone-converter",
      "meeting-time-planner",
    ],
    content: {
      what: "The Sleep Cycle Calculator works backwards or forwards from a time you know. Tell it when you need to wake up and it suggests bedtimes that end on complete 90-minute cycles; tell it when you go to bed and it suggests matching wake times. You can include an estimate of how long it takes to fall asleep and compare four, five and six cycle options at once. The result is a planning aid based on average cycle length, accompanied by an explicit non-medical disclaimer.",
      howTo: [
        "Choose whether you know your wake time or your bedtime.",
        "Enter that time in 24-hour format.",
        "Set the average number of minutes it takes you to fall asleep.",
        "Select which cycle counts you want to compare.",
        "Click Calculate options and pick a realistic schedule.",
      ],
      example:
        "If you must wake at 07:00 and it takes about 15 minutes to fall asleep, five 90-minute cycles suggest going to bed around 23:15, while six cycles suggest roughly 21:45. The tool lists each option with its total sleep duration.",
      benefits: [
        "Makes a schedule that ends near the end of a sleep cycle.",
        "Compares several cycle counts at a glance.",
        "Accounts for the time it takes to fall asleep.",
        "Includes an original, prominent non-medical disclaimer.",
        "Computes instantly in the browser with no account required.",
      ],
      faqs: [
        {
          q: "Is 90 minutes the right cycle length for everyone?",
          a: "Ninety minutes is a population average. Individual cycles vary, and a single night contains a mix of cycle lengths. Treat the output as a loose guide rather than a precise biological prediction.",
        },
        {
          q: "Does this give medical advice?",
          a: "No. The calculator is a simple time-based planning tool and is not medical advice. If you have persistent insomnia, snoring or daytime sleepiness, speak with a qualified healthcare professional.",
        },
        {
          q: "Why is falling-asleep time subtracted?",
          a: "The clock time you get into bed is not the moment sleep begins. By including your typical delay, the suggested bedtime makes the actual sleep window line up with whole cycles.",
        },
        {
          q: "Can I plan for fewer than four cycles?",
          a: "Yes. The underlying calculation supports one to ten cycles. The interface highlights four, five and six because those are the most common adult ranges, but the math is not limited to them.",
        },
        {
          q: "Does the tool track my sleep over time?",
          a: "No. It stores nothing and makes no account. Each calculation is independent and the page forgets it when you leave.",
        },
      ],
    },
  },
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    description:
      "Estimate daily calories with the Mifflin-St Jeor equation. Get BMR, activity-adjusted TDEE and a goal-based target, with a clear estimate-only, not-medical-advice disclaimer.",
    category: "productivity",
    keywords: [
      "calorie calculator",
      "Mifflin St Jeor calculator",
      "BMR TDEE calculator",
      "daily calorie needs estimator",
      "maintenance calorie calculator",
      "weight goal calorie planner",
    ],
    icon: "CheckSquare",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: [
      "water-intake-calculator",
      "percentage-calculator",
      "sleep-cycle-calculator",
    ],
    content: {
      what: "The Calorie Calculator estimates your basal metabolic rate with the Mifflin-St Jeor equation, multiplies it by an activity factor to approximate total daily energy expenditure, and then applies a roughly 500 kcal adjustment for a lose or gain goal. It accepts metric inputs and shows BMR, TDEE, the goal adjustment and the final daily target separately so you can see how each step contributes. The result is an estimate only and is explicitly labelled as not medical advice.",
      howTo: [
        "Enter your sex, age, weight in kilograms and height in centimetres.",
        "Choose the activity level that best matches a typical week.",
        "Select whether your goal is to lose, maintain or gain weight.",
        "Click Calculate calories to see BMR, TDEE and your daily target.",
        "Copy or download the report to keep alongside your own notes.",
      ],
      example:
        "A 30-year-old woman who weighs 65 kg, is 168 cm tall and is moderately active has a Mifflin-St Jeor BMR near 1,403 kcal. With a 1.55 activity factor her TDEE is about 2,175 kcal, and a maintenance goal sets her estimated target at roughly 2,175 kcal per day.",
      benefits: [
        "Uses the widely taught Mifflin-St Jeor equation transparently.",
        "Shows each calculation step instead of a single opaque number.",
        "Offers five activity levels and three goal directions.",
        "States clearly that the result is an estimate, not medical advice.",
        "Runs entirely offline in the browser with no stored personal data.",
      ],
      faqs: [
        {
          q: "How accurate is the Mifflin-St Jeor equation?",
          a: "It is one of the better predictive equations for groups, but individual error can still be several hundred calories. It is a starting estimate, not a measurement of your metabolism.",
        },
        {
          q: "Why is my target different from a wearable's reading?",
          a: "Wearables and online calculators use different formulas, activity data and assumptions. Small differences are normal. Use one consistent method and adjust based on your own tracked results.",
        },
        {
          q: "Is a 500 calorie adjustment always appropriate?",
          a: "No. A 500 kcal daily deficit or surplus is a common rough guide, but the right size depends on body size, goals and timeframe. Very aggressive changes can be counterproductive.",
        },
        {
          q: "Does this account for pregnancy, illness or medication?",
          a: "No. Those factors can change energy needs substantially. The tool does not model them, and you should seek personalised advice from a qualified professional in those situations.",
        },
        {
          q: "Is this medical advice?",
          a: "Definitely not. The calculator is an educational estimate. For diagnosis, treatment or a supervised nutrition plan, consult a doctor or registered dietitian.",
        },
      ],
    },
  },
  {
    slug: "water-intake-calculator",
    title: "Water Intake Calculator",
    description:
      "Estimate a practical daily fluid target from body weight, activity and climate. See the result in millilitres, litres and cups, with an explicit estimate-only, not-medical-advice disclaimer.",
    category: "productivity",
    keywords: [
      "water intake calculator",
      "daily water need estimator",
      "how much water should I drink",
      "fluid intake calculator",
      "hydration calculator by weight",
      "water cups per day tool",
    ],
    icon: "Calculator",
    status: "ready",
    popularity: 75,
    addedAt: "2026-11-22",
    related: [
      "calorie-calculator",
      "percentage-calculator",
      "sleep-cycle-calculator",
    ],
    content: {
      what: "The Water Intake Calculator gives a simple starting estimate for daily fluid needs. It applies a baseline of 35 millilitres per kilogram of body weight, adds an allowance for general activity and exercise minutes, and optionally adds more for hot conditions or heavy sweating. It shows the baseline, activity and climate contributions separately and converts the total into litres and standard 250 ml cups. The result is an estimate only, not medical advice.",
      howTo: [
        "Enter your body weight in kilograms.",
        "Choose the activity level closest to your usual day.",
        "Add the number of minutes you expect to exercise.",
        "Tick the hot-climate option if you will be sweating heavily.",
        "Click Calculate water intake to see litres, millilitres and cups.",
      ],
      example:
        "A 70 kg person with a moderately active day and 30 minutes of exercise gets a baseline of 2,450 ml, an activity allowance of 800 ml and no climate bonus, for an estimated total of about 3.25 litres or roughly 13 cups.",
      benefits: [
        "Breaks the estimate into baseline, activity and climate parts.",
        "Shows familiar units including cups as well as litres.",
        "Lets you model extra exercise and hot weather separately.",
        "Includes a clear estimate-only, not-medical-advice disclaimer.",
        "Calculates locally with no input stored or transmitted.",
      ],
      faqs: [
        {
          q: "Where does the 35 ml per kilogram baseline come from?",
          a: "It is a commonly cited rule of thumb for everyday fluid needs in temperate conditions. It is deliberately simple, and real requirements vary widely between people and circumstances.",
        },
        {
          q: "Should I drink exactly this amount every day?",
          a: "No. Thirst, urine colour, diet, weather and exercise all matter. Use the number as a rough guide and adjust it to how you actually feel rather than forcing a fixed total.",
        },
        {
          q: "Does this include water from food?",
          a: "The estimate treats the total as general daily fluid intake. Water-rich foods such as fruit and soups contribute too, so you may not need to drink the entire amount as plain water.",
        },
        {
          q: "Can it account for medical conditions or pregnancy?",
          a: "No. Conditions affecting fluid balance and pregnancy can change requirements significantly. Follow advice from a qualified health professional in those cases.",
        },
        {
          q: "Is this medical advice?",
          a: "No. It is an educational estimate only, not medical advice. Persistent thirst, swelling or other symptoms should be discussed with a healthcare professional.",
        },
      ],
    },
  },
];
