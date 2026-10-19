import { createContext, useContext } from "react";

export const NoticeContext = createContext(null);

export function useNotices() {
  const value = useContext(NoticeContext);
  if (!value) throw new Error("useNotices requires NoticeProvider");
  return value;
}
