export function nextInArray<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index + 1 > array.length - 1) {
    return array[0];
  } else {
    return array[index + 1];
  }
}
