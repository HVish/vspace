/** unix-timestamp in milliseconds */
type UnixTime = number;
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
