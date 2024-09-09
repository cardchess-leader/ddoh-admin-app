const isProduction = false; // Set this to false for debugging

const HumorCategoryList = [
    "DAD_JOKES",
    "KNOCK_KNOCK_JOKES",
    "ONE_LINERS",
    "DARK_HUMORS",
    "TRICKY_RIDDLES",
    "OX_QUIZ",
    "FUNNY_QUOTES",
    "STORY_JOKES",
    "DETECTIVE_PUZZLES",
    "YOUR_HUMORS",
] as const;

const HumorDataKeyList = [
  'author', // empty string will be treated as null, vise versa
  'category',
  'context',
  'context_list', // empty list will be treated as null, vise versa
  'created_date', // should be in format of yyyy-mm-dd
  'index',
  'punchline', // empty string will be treated as null, vise versa
  'sender',
  'source',
  'uuid',
] as const;

type HumorCategory = typeof HumorCategoryList[number];
type HumorDataKey = typeof HumorDataKeyList[number];
type DateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

interface Humor {
    author: string, // empty string will be treated as null, vise versa
    category: HumorCategory,
    context: string,
    context_list: string[], // empty list will be treated as null, vise versa
    created_date: DateString, // should be in format of yyyy-mm-dd
    index: number,
    punchline: string, // empty string will be treated as null, vise versa
    sender: string,
    source: string,
    uuid: string,
  }

interface HumorDB {
  author: string | null,
  category: HumorCategory,
  context: string,
  context_list: string[] | null,
  created_date: DateString, // should be in format of yyyy-mm-dd
  index: number,
  punchline: string | null,
  sender: string,
  source: string,
  uuid: string,
  }

const defaultHumor: Humor = {
  author: '', // empty string will be treated as null, vise versa
  category: HumorCategoryList[0],
  context: '',
  context_list: [], // empty list will be treated as null, vise versa
  created_date: '2024-01-01', // should be in format of yyyy-mm-dd
  index: 0,
  punchline: '', // empty string will be treated as null, vise versa
  sender: '',
  source: '',
  uuid: '',
};

const firebaseFunctionUrl = isProduction ? 'https://us-central1-daily-dose-of-humors.cloudfunctions.net' : 'http://127.0.0.1:5001/daily-dose-of-humors/us-central1';

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear(); // Get the full year (e.g., 2024)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero if needed

  return `${year}-${month}-${day}`; // Format as 'yyyy-mm-dd'
}

export { HumorCategoryList, firebaseFunctionUrl, defaultHumor, formatDateToYYYYMMDD };
export type { Humor, HumorDataKey };
