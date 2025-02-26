import { Days, Hours, Minutes, TimeInMilliseconds } from '../../../types';

// export async function generateEmbedding(text: string): Promise<number[]> {
//     // Use OpenAI API or local embedding model
//     const response = await axios.post('https://api.openai.com/v1/embeddings', {
//       input: text,
//       model: "text-embedding-ada-002"
//     }, {
//       headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
//     });
//     return response.data.data[0].embedding;
//   }

/** Generates and returns an object whose keys in number represent ***time*** in `hour` and values expressed in `milliseconds`
 * @description Ranges from 1 to 24 ***hours***
 */
export const generateHours = (): TimeInMilliseconds<Hours> => {
  const hours = {} as TimeInMilliseconds<Hours>;
  for (let i = 1; i <= 24; i++) {
    hours[i as keyof typeof hours] = i * 60 * 60 * 1000; // Convert hours to milliseconds
  }
  return hours;
};

/** Generates and returns an object whose keys in number represent ***time*** in `day` and values expressed in `milliseconds`
 * @description Ranges from 1 to 7 ***days***
 */
export const generateDays = (): TimeInMilliseconds<Days> => {
  const days = {} as TimeInMilliseconds<Days>;
  for (let i = 1; i <= 7; i++) {
    days[i as keyof typeof days] = i * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  }
  return days;
};

/** Generates and returns an object whose keys in number represent ***time*** in `minute` and values expressed in `milliseconds`
 * @description Ranges from 1 to 59 ***minutes***
 */
export const generateMinutes = (): TimeInMilliseconds<Minutes> => {
  const minutes = {} as TimeInMilliseconds<Minutes>;
  for (let i = 1; i <= 59; i++) {
    minutes[i as keyof typeof minutes] = i * 60 * 1000; // Convert minutes to milliseconds
  }
  return minutes;
};

export async function generateUUID(length: number): Promise<string> {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let accountNumber = '';
  for (let i = 0; i < length; i++) {
    accountNumber += digits[Math.floor(Math.random() * digits.length)];
  }
  return accountNumber;
}

/**
 * Used to generate random positive integers of length, 4 by default, otherwise the passed in length,
 * @param length
 * @returns random string code
 */
export async function generateCode(length: number = 4): Promise<string> {
  const digits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // Array of number strings
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex]; // Pick a random digit string
  }

  return code;
}

/**
 * Used to generate random positive integers of length, 4 by default, otherwise the passed in length, and expiration time for the code which by default is 15 minutes, otherwise the passed in expiration time.
 * @param length
 * @param exp Code expiration time in `minutes` [15 minutes by default] expressed in milliseconds
 * @returns random code [positive integers] and expiration time
 */

export function getRandomNumbers(length: number = 4, exp: number = 15) {
  const code = generateCode(length);
  //set code expiration
  const expiresAt = Date.now() + exp * 60 * 1000; // by default, code expires 15 minutes after it's generated.

  return {
    /** Random number */
    code: +code,
    /** Code expiration time expressed in `milliseconds` */
    expiresAt,
  };
}
