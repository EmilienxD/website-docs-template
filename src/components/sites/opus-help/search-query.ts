"use client";

import { useSyncExternalStore } from "react";

const queryEvent = "forma-search-query-change";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(queryEvent, callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener(queryEvent, callback); };
}

function querySnapshot() {
  return new URLSearchParams(window.location.search).get("search") ?? "";
}

export function useSearchQuery() {
  return useSyncExternalStore(subscribe, querySnapshot, () => "");
}

export function setSearchQuery(query: string) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("search", query);
  else url.searchParams.delete("search");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(queryEvent));
}
