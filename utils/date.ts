import dayjs from 'dayjs';
import {CalendarActiveDateRange} from "@marceloterreiro/flash-calendar";


export function getDateRangesFromArray(dates: string[]) {
    if (!dates.length) return [];

    const sorted = [...new Set(dates)].sort();

    const ranges: CalendarActiveDateRange[] = [];
    let rangeStart = sorted[0];
    let prev = dayjs(rangeStart);

    for (let i = 1; i < sorted.length; i++) {
        const current = dayjs(sorted[i]);

        // Check if the current date is NOT the next day
        if (!current.isSame(prev.add(1, 'day'), 'day')) {
            ranges.push({ startId: rangeStart, endId: prev.format('YYYY-MM-DD') });
            rangeStart = sorted[i]; // new range starts here
        }

        prev = current;
    }

    // Push the final range
    ranges.push({ startId: rangeStart, endId: prev.format('YYYY-MM-DD') });

    return ranges;
}
