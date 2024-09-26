/**
 * Utility function to truncate a given text to a specified length.
 * If the text is longer than the specified length, it appends "..." at the end.
 *
 * @param text - The text to be truncated.
 * @param maxLength - The maximum length of the text after truncation.
 * @returns The truncated text with "..." if needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}
