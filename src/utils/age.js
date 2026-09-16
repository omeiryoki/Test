/**
 * Calculates exact age in years, months, and days from a birthdate string (YYYY-MM-DD).
 * Returns a formatted string in Thai (or English fallback).
 */
export function calculateAge(birthdateStr) {
  if (!birthdateStr) return { years: 0, months: 0, days: 0, text: 'ไม่ทราบวันเกิด' };

  const birthDate = new Date(birthdateStr);
  const today = new Date();

  if (isNaN(birthDate.getTime()) || birthDate > today) {
    return { years: 0, months: 0, days: 0, text: 'วันเกิดไม่ถูกต้อง' };
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let parts = [];
  if (years > 0) parts.push(`${years} ขวบ`);
  if (months > 0) parts.push(`${months} เดือน`);
  if (days > 0 || parts.length === 0) parts.push(`${days} วัน`);

  return {
    years,
    months,
    days,
    text: parts.join(' ')
  };
}

/**
 * Returns a short formatted date (e.g. 16 ก.ย. 2026)
 */
export function formatDateThai(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const monthsTH = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  return `${date.getDate()} ${monthsTH[date.getMonth()]} ${date.getFullYear() + 543}`;
}

export function formatDateISO(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
