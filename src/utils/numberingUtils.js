// Consecutive Document Numbering and Counter Management for Eliotte MUA

export const STORAGE_COUNTERS_KEY = 'eliotte_mua_counters_v3';

// Load stored counters from localStorage
export function getStoredCounters() {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading counters from localStorage', e);
  }
  return {
    lastQuoteNum: 1,
    lastInvoiceNum: 1,
    currentYear: new Date().getFullYear(),
  };
}

// Save counters to localStorage
export function saveStoredCounters(counters) {
  try {
    localStorage.setItem(STORAGE_COUNTERS_KEY, JSON.stringify(counters));
  } catch (e) {
    console.error('Error saving counters to localStorage', e);
  }
}

// Format document number (e.g. prefix = 'COT', num = 1 -> 'COT-2026-001')
export function formatDocumentNumber(prefix, num, year = new Date().getFullYear()) {
  const padded = String(Math.max(1, Number(num) || 1)).padStart(3, '0');
  return `${prefix}-${year}-${padded}`;
}

// Parse document number (e.g. 'COT-2026-005' -> { prefix: 'COT', year: 2026, num: 5 })
export function parseDocumentNumber(numStr, defaultPrefix = 'COT') {
  if (!numStr || typeof numStr !== 'string') {
    return { prefix: defaultPrefix, year: new Date().getFullYear(), num: 1 };
  }
  const match = numStr.trim().match(/^([A-Za-z]+)-(\d{4})-(\d+)$/);
  if (match) {
    return {
      prefix: match[1].toUpperCase(),
      year: parseInt(match[2], 10),
      num: parseInt(match[3], 10),
    };
  }
  // Fallback if user typed custom string
  return { prefix: defaultPrefix, year: new Date().getFullYear(), num: 1 };
}

// Find highest number used in history or counters
export function getNextConsecutiveNumber(docType, history = [], currentNumberStr = '') {
  const prefix = docType === 'invoice' ? 'FAC' : 'COT';
  const year = new Date().getFullYear();
  const counters = getStoredCounters();
  
  let maxNum = docType === 'invoice' 
    ? (counters.lastInvoiceNum || 1) 
    : (counters.lastQuoteNum || 1);

  // Also check all items in history
  if (Array.isArray(history)) {
    history.forEach((entry) => {
      if (entry.type === docType && entry.data) {
        const numStr = docType === 'invoice' 
          ? entry.data.invoiceNumber 
          : (entry.data.quoteNumber || entry.data.title);
        const parsed = parseDocumentNumber(numStr, prefix);
        if (parsed.prefix === prefix && parsed.num > maxNum) {
          maxNum = parsed.num;
        }
      }
    });
  }

  // Also check currently loaded number
  if (currentNumberStr) {
    const currentParsed = parseDocumentNumber(currentNumberStr, prefix);
    if (currentParsed.prefix === prefix && currentParsed.num >= maxNum) {
      maxNum = currentParsed.num;
    }
  }

  const nextNum = maxNum + 1;

  // Update counters
  if (docType === 'invoice') {
    counters.lastInvoiceNum = nextNum;
  } else {
    counters.lastQuoteNum = nextNum;
  }
  saveStoredCounters(counters);

  return formatDocumentNumber(prefix, nextNum, year);
}

// Check if a document number is duplicated in history
export function isNumberDuplicated(docType, numStr, history = [], excludeId = null) {
  if (!numStr || !Array.isArray(history) || history.length === 0) return false;
  const cleanTarget = numStr.trim().toUpperCase();

  return history.some((entry) => {
    if (excludeId && entry.id === excludeId) return false;
    if (entry.type !== docType || !entry.data) return false;

    const existingNum = docType === 'invoice'
      ? entry.data.invoiceNumber
      : entry.data.quoteNumber;

    if (!existingNum) return false;
    return existingNum.trim().toUpperCase() === cleanTarget;
  });
}

