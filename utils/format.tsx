
export function formatNumber(n: number) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCompactNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0';
    }

    const absNumber = Math.abs(number);
    const sign = number < 0 ? '-' : '';

    if (absNumber < 1000) {
        return sign + absNumber.toString(); // Меньше 1000 — без изменений
    }

    const units = ['k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y']; // Тысячи, миллионы, миллиарды и т. д.
    const exponent = Math.min(
        Math.floor(Math.log10(absNumber) / 3), // Логарифм для определения порядка
        units.length - 1
    );
    const scaledNumber = absNumber / Math.pow(1000, exponent);
    const roundedNumber = Math.round(scaledNumber * 10) / 10; // Округление до 1 знака после запятой

    // Убираем .0, если число целое (например, 2.0 → 2)
    const formattedNumber = roundedNumber % 1 === 0
        ? roundedNumber.toFixed(0)
        : roundedNumber.toFixed(1);

    return sign + formattedNumber + units[exponent - 1];
}