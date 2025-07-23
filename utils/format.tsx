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

export function formatMinutes(totalMinutes: number): string {
    if (isNaN(totalMinutes) || totalMinutes < 0) {
        return '0 минут';
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];

    // Форматирование часов
    if (hours > 0) {
        let hourWord = 'часов';
        if (hours % 100 >= 5 && hours % 100 <= 20) {
            hourWord = 'часов';
        } else {
            switch (hours % 10) {
                case 1: hourWord = 'час'; break;
                case 2:
                case 3:
                case 4: hourWord = 'часа'; break;
                default: hourWord = 'часов';
            }
        }
        parts.push(`${hours} ${hourWord}`);
    }

    // Форматирование минут
    if (minutes > 0 || totalMinutes === 0) {
        let minuteWord = 'минут';
        if (minutes % 100 >= 5 && minutes % 100 <= 20) {
            minuteWord = 'минут';
        } else {
            switch (minutes % 10) {
                case 1: minuteWord = 'минута'; break;
                case 2:
                case 3:
                case 4: minuteWord = 'минуты'; break;
                default: minuteWord = 'минут';
            }
        }
        parts.push(`${minutes} ${minuteWord}`);
    }

    return parts.join(' ');
}

