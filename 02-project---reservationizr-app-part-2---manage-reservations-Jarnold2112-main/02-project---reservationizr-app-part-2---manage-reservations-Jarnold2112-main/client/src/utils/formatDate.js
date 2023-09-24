import { format, parseISO } from "date-fns";

const formatDate = (date) => format(parseISO(date), "h:mmaaa EEE d LLL, yyyy");

export { formatDate };
