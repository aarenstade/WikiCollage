import { WAIT_PERIOD } from "../config";

export function nextInArrayRotate<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index + 1 > array.length - 1) {
    return array[0];
  } else {
    return array[index + 1];
  }
}

export function formatMillisecondsToReadableTimestamp(millis: number): string {
  var date = new Date(millis);
  var str = "";
  if (millis > 86400000) str += date.getUTCDate() - 1 + " days, ";
  if (millis > 3600000) str += date.getUTCHours() + " hours, ";
  if (millis > 60000) str += date.getUTCMinutes() + " minutes, ";
  str += date.getUTCSeconds() + " seconds";
  return str;
}

export function isTopicOpen(timestamp?: number): { isOpen: boolean; openTime?: number } {
  if (!timestamp) return { isOpen: true };
  const openTime = new Date(timestamp).getTime() + WAIT_PERIOD;
  if (openTime > Date.now()) return { isOpen: false, openTime };
  return { isOpen: true, openTime };
}
