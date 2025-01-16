import { ApiError } from "./errors";
import { Quote } from "./types";

export function checkInvalidQuotes(quotes: Pick<Quote, "main" | "sub">[]) {
  const invalidQuotes = quotes.filter(
    (quote) =>
      !quote.main ||
      typeof quote.main !== "string" ||
      (quote.sub !== undefined && typeof quote.sub !== "string"),
  );

  if (invalidQuotes.length) {
    throw new ApiError(
      'Each quote must have a "main" field as string and optional "sub" field as string.',
      400,
    );
  }
}
