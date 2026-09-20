export function formatPrice(price) {
  if (!price && price !== 0) return 'Price on request';

  const num = Number(price);
  if (isNaN(num)) return 'Price on request';

  if (num >= 10000000) {
    return `PKR ${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `PKR ${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `PKR ${(num / 1000).toFixed(1)} K`;
  }
  return `PKR ${num.toLocaleString()}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatArea(size, unit) {
  if (!size || !unit) return '';
  return `${size} ${unit}`;
}

export function normalizeWhatsAppPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  // Strip all non-digit characters
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return '';

  // 03XXXXXXXXX -> 923XXXXXXXXX
  if (digits.startsWith('03') && digits.length === 11) {
    digits = `92${digits.substring(1)}`;
  } else if (digits.startsWith('3') && digits.length === 10) {
    digits = `92${digits}`;
  } else if (digits.startsWith('0092')) {
    digits = digits.substring(2);
  }

  return digits;
}

export function getWhatsAppLink(phone, message = '') {
  const cleanPhone = normalizeWhatsAppPhone(phone);
  if (!cleanPhone) return '#';
  const encodedText = message ? `?text=${encodeURIComponent(message.trim())}` : '';
  return `https://wa.me/${cleanPhone}${encodedText}`;
}