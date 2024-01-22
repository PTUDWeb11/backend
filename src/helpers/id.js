import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-', 11);

export const generateId = () => nanoid();
