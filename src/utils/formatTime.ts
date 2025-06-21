export function getTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "just now";
  }
  if (diffInMinutes === 1) {
    return "1m";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  if (diffInHours === 1) {
    return "1h";
  }
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  if (diffInDays === 1) {
    return "1d";
  }
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  if (diffInWeeks < 3) {
    return `${diffInWeeks}w`;
  }
  if (diffInMonths === 1) {
    return "1mo";
  }
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  }
  if (diffInYears === 1) {
    return "1y";
  }
  return `${diffInYears}y`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  return `${month} ${day}`;
}

export function formatMonthYear(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${month} ${year}`;
}