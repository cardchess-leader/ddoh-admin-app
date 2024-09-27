const IS_PRODUCTION = true; // Set this to false for debugging

const HumorCategoryList = [
    "DAD_JOKES",
    "KNOCK_KNOCK_JOKES",
    "ONE_LINERS",
    "DARK_HUMORS",
    "TRICKY_RIDDLES",
    "TRIVIA_QUIZ",
    "FUNNY_QUOTES",
    "STORY_JOKES",
    "DETECTIVE_PUZZLES",
    "YOUR_HUMORS",
] as const;

const HumorDataKeyList = [
  'active',
  'author', // empty string will be treated as null, vise versa
  'category',
  'context',
  'context_list', // empty list will be treated as null, vise versa
  'release_date', // should be in format of yyyy-mm-dd
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
    active: boolean,
    author: string, // empty string will be treated as null, vise versa
    category: HumorCategory,
    context: string,
    context_list: string[], // empty list will be treated as null, vise versa
    release_date: DateString, // should be in format of yyyy-mm-dd
    index: number,
    punchline: string, // empty string will be treated as null, vise versa
    sender: string,
    source: string,
    uuid: string,
  }

const defaultHumor: Humor = {
  active: true,
  author: '', // empty string will be treated as null, vise versa
  category: HumorCategoryList[0],
  context: '',
  context_list: [], // empty list will be treated as null, vise versa
  release_date: '2024-01-01', // should be in format of yyyy-mm-dd
  index: 0,
  punchline: '', // empty string will be treated as null, vise versa
  sender: 'Board Collie',
  source: 'Daily Dose of Humors',
  uuid: '',
};

const firebaseFunctionUrl = IS_PRODUCTION ? 'https://us-central1-daily-dose-of-humors.cloudfunctions.net' : 'http://127.0.0.1:5001/daily-dose-of-humors/us-central1';

function formatDateToYYYYMMDD(date: Date): DateString {
  const year = date.getFullYear(); // Get the full year (e.g., 2024)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero if needed

  return `${year}-${month}-${day}` as DateString; // Format as 'yyyy-mm-dd'
}

function validateHumor(humor: Humor): string[] {
  const invalid_fields = [];
  if (humor.context.trim() === '') {
    invalid_fields.push('context');
  }
  if (humor.sender.trim() === '') {
    invalid_fields.push('sender');
  }
  if (humor.source.trim() === '') {
    invalid_fields.push('source');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(humor.release_date)) {
    invalid_fields.push('release_date');
  }
  return invalid_fields;
}

interface Bundle {
  active: boolean,
  bundle_name: string,
  bundle_description: string,
  category: HumorCategory,
  cover_img_list: string[],
  release_date: DateString,
  humor_count: number,
  language_code: string,
  set_list: string[],
  product_id: string,
  uuid: string,
}

const defaultBundle: Bundle = {
  active: true,
  bundle_name: '',
  bundle_description: '',
  category: 'DAD_JOKES',
  cover_img_list: [],
  release_date: '2024-01-01',
  humor_count: 100,
  language_code: 'EN',
  set_list: [],
  product_id: '',
  uuid: '',
};

export { HumorCategoryList, firebaseFunctionUrl, defaultHumor, formatDateToYYYYMMDD, validateHumor, defaultBundle };
export type { Humor, HumorDataKey, HumorCategory, Bundle };
