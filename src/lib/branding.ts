export function getInitials(name?: string | null) {
  const cleaned = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (cleaned.length === 0) {
    return "PP";
  }

  if (cleaned.length === 1) {
    return cleaned[0].slice(0, 2).toUpperCase();
  }

  const first = cleaned[0][0] ?? "";
  const last = cleaned[cleaned.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
}
