function formatDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeString?: string) {
  if (!timeString) return "";
  try {
    // Accept either a plain time like "09:30" / "09:30:00" or a full ISO datetime
    const date =
      timeString.includes("T") || /\d{4}-\d{2}-\d{2}/.test(timeString)
        ? new Date(timeString)
        : new Date(`1970-01-01T${timeString}`);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeString;
  }
}
//
export { formatDate, formatTime };
