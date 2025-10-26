import { nanoid } from 'nanoid';

export function generateRandomAlphaNumeric(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function createNewData<T>(data: T): { id: string } & T {
  return {
    ...data,
    id: nanoid(15),
  };
}

export const cleanAndParseNumber = (value: string | undefined): number => {
  if (!value || value.trim() === '') {
    return 0;
  }
  // Menghapus koma (pemisah ribuan yang mungkin) sebelum parsing.
  const cleanedValue = value.replace(/,/g, '').trim();
  const num = Number(cleanedValue);
  return isNaN(num) ? 0 : num;
};
