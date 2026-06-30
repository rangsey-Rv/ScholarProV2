// utils/current-user.ts
import { AsyncLocalStorage } from "async_hooks";

interface Context {
  userId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<Context>();

// Set the current user in the context
export const setCurrentUser = (userId: string) => {
  asyncLocalStorage.enterWith({ userId });
};

// Get the current user from context
export const getCurrentUser = (): string | null => {
  const store = asyncLocalStorage.getStore();
  return store?.userId ?? null;
};

// Wrap async function to maintain context
export const runWithUserContext = async <T>(userId: string, fn: () => Promise<T>) => {
  return asyncLocalStorage.run({ userId }, fn);
};
