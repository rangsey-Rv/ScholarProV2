export function formatDate(dateStr: string | Date | null) {
  return dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : null;
}

export function formatTime(dateStr: string | Date | null) {
  return dateStr
    ? new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;
}
