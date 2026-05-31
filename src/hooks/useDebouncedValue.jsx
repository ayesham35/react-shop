import { useEffect, useState } from 'react';

export function useDebouncedValue(value, delayMs = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        // set a timer to update the debounced value after the delay
        const id = setTimeout(() => setDebounced(value), delayMs);

        // if value changes before the timer fires, cancel it and start over
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}