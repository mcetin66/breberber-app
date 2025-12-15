export const formatPhoneNumber = (text: string) => {
    let cleaned = ('' + text).replace(/\D/g, '');
    // Strip leading zero if present
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    // Limit to 10 digits
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (match) {
        let formatted = match[1];
        if (match[2]) formatted = `(${match[1]}) ${match[2]}`;
        if (match[3]) formatted += ` ${match[3]}`;
        if (match[4]) formatted += ` ${match[4]}`;
        return formatted;
    }
    return cleaned;
};

/**
 * Format price using Turkish currency standards without decimals (e.g., 1.250 ₺)
 */
export const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0 ₺';

    // Manual format to ensure consistency across engines
    const integerPart = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${integerPart} ₺`;
};

export const formatCurrencyNoSymbol = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0';

    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
