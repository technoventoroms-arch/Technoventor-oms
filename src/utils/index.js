/**
 * Formats an address object into a comma-separated string.
 * @param {Object|string} addr - The address object or string.
 * @returns {string} - The formatted address.
 */
export const formatAddress = (addr) => {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  const { line1, line2, city, state, zip, country } = addr;
  const parts = [line1, line2, city, state, zip, country].filter(part => part && part.toString().trim() !== '');
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

/**
 * Formats a given date string into a human readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

/**
 * Formats a given date string into a human readable format with time.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date and time.
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    return dateString;
  }
};
/**
 * Triggers a download of a CSV file.
 * @param {string} csvContent - The row-separated CSV content.
 * @param {string} filename - The name of the file to download.
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
