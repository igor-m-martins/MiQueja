export function truncateText(text, maxLength = 180) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export default { truncateText };
