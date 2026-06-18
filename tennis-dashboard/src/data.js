export const player = {
  name: "Jon Caldwell",
  ntrp: "4.0 C",
  ntrpDate: "12/31/2025",
  dynamicRating: 3.8784,
  dynamicRatingDate: "6/12/2026",
  projectedYearEnd: null,
  location: "Ann Arbor, MI",
  section: "Midwest",
  area: "S.E. Michigan",
  profileUrl: "https://www.tennisrecord.com/adult/profile.aspx?playername=Jon%20Caldwell",
};

export const teams = [
  { name: "RCAA-Boodakian (doubles on clay) 18s 4.5M F1", type: "Adult 18+", section: "Midwest", rating: 4.5, matchStart: "05/20/2026" },
  { name: "LIB-Briceno 40s 4.0M F1", type: "Adult 40+", section: "Midwest", rating: 4.0, matchStart: "05/14/2026" },
  { name: "RCAA-Shaw 18s 4.0M F2", type: "Adult 18+", section: "Midwest", rating: 4.0, matchStart: "05/12/2026" },
  { name: "LIB-Theriot 40 MEN SINGLES F", type: "Adult Other", section: "Midwest", rating: 8.0, matchStart: "02/14/2026" },
  { name: "4CHIP-Beltran 7S COMBO MEN F3", type: "Combo", section: "Midwest", rating: 7.5, matchStart: "10/04/2025" },
];

export const yearlyRecord = [
  { year: 2026, matches: 6, wins: 4, losses: 2, winPct: 66.7, sets: 14, setsWon: 8, setsLost: 6, setWinPct: 57.1, games: 117, gamesWon: 60, gamesLost: 57, gameWinPct: 51.3, defaults: 0 },
  { year: 2025, matches: 11, wins: 8, losses: 3, winPct: 72.7, sets: 25, setsWon: 17, setsLost: 8, setWinPct: 68.0, games: 207, gamesWon: 122, gamesLost: 85, gameWinPct: 58.9, defaults: 0 },
  { year: 2024, matches: 9, wins: 8, losses: 1, winPct: 88.9, sets: 18, setsWon: 16, setsLost: 2, setWinPct: 88.9, games: 167, gamesWon: 108, gamesLost: 59, gameWinPct: 64.7, defaults: 0 },
];

export const careerRecord = {
  matches: 26, wins: 20, losses: 6, winPct: 76.9,
  sets: 57, setsWon: 41, setsLost: 16, setWinPct: 71.9,
  games: 491, gamesWon: 290, gamesLost: 201, gameWinPct: 59.1,
  defaults: 0,
};

export const matches = [
  { date: "2026-06-01", opponent: "Opponent", type: "Doubles", event: "RCAA-Boodakian 4.5M", score: "6-4, 6-3", result: "W" },
  { date: "2026-05-25", opponent: "Opponent", type: "Singles", event: "RCAA-Shaw 4.0M", score: "4-6, 6-3, 6-7(5)", result: "L" },
  { date: "2026-05-18", opponent: "Opponent", type: "Singles", event: "LIB-Briceno 40s 4.0M", score: "6-4, 6-2", result: "W" },
  { date: "2026-05-14", opponent: "Opponent", type: "Singles", event: "RCAA-Shaw 4.0M", score: "6-3, 6-4", result: "W" },
  { date: "2026-03-15", opponent: "Opponent", type: "Singles", event: "LIB-Theriot 40 Singles", score: "3-6, 4-6", result: "L" },
  { date: "2026-02-22", opponent: "Opponent", type: "Singles", event: "LIB-Theriot 40 Singles", score: "6-2, 6-4", result: "W" },
  { date: "2025-12-07", opponent: "Opponent", type: "Doubles", event: "4CHIP-Beltran Combo 7.5", score: "6-3, 6-4", result: "W" },
  { date: "2025-11-16", opponent: "Opponent", type: "Doubles", event: "4CHIP-Beltran Combo 7.5", score: "6-4, 7-5", result: "W" },
  { date: "2025-11-02", opponent: "Opponent", type: "Doubles", event: "4CHIP-Beltran Combo 7.5", score: "4-6, 3-6", result: "L" },
  { date: "2025-10-19", opponent: "Opponent", type: "Singles", event: "4CHIP-Beltran Combo 7.5", score: "6-1, 6-3", result: "W" },
  { date: "2025-10-12", opponent: "Opponent", type: "Doubles", event: "4CHIP-Beltran Combo 7.5", score: "6-2, 6-1", result: "W" },
  { date: "2025-10-05", opponent: "Opponent", type: "Singles", event: "4CHIP-Beltran Combo 7.5", score: "6-4, 6-2", result: "W" },
];

export const ratingHistory = [
  { month: "Jan '24", rating: 3.65 },
  { month: "Jun '24", rating: 3.78 },
  { month: "Dec '24", rating: 3.92 },
  { month: "Jun '25", rating: 3.85 },
  { month: "Dec '25", rating: 3.90 },
  { month: "Mar '26", rating: 3.85 },
  { month: "Jun '26", rating: 3.88 },
];

export const monthlyActivity = [
  { month: "Oct '25", matches: 3, wins: 3, losses: 0 },
  { month: "Nov '25", matches: 2, wins: 1, losses: 1 },
  { month: "Dec '25", matches: 1, wins: 1, losses: 0 },
  { month: "Feb '26", matches: 1, wins: 1, losses: 0 },
  { month: "Mar '26", matches: 1, wins: 0, losses: 1 },
  { month: "May '26", matches: 3, wins: 3, losses: 0 },
  { month: "Jun '26", matches: 1, wins: 1, losses: 0 },
];

export const projections = {
  currentPace: {
    matchesPlayed: 6,
    monthsElapsed: 5.5,
    matchesPerMonth: 1.09,
    monthsRemaining: 6.5,
  },
  yearEnd: {
    projectedMatches: 13,
    projectedWins: 9,
    projectedLosses: 4,
    projectedWinPct: 66.7,
    projectedDynamic: 3.90,
  },
  milestones: [
    { target: "Career 30 Matches", projectedDate: "Sep 2026", confidence: "High" },
    { target: "Career 25 Wins", projectedDate: "Oct 2026", confidence: "High" },
    { target: "4.0 Dynamic Rating", projectedDate: "Dec 2026", confidence: "Medium" },
    { target: "80% Career Win Rate", projectedDate: "Needs 5W streak", confidence: "Low" },
  ],
};
