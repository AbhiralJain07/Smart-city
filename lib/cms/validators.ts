export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function requiredString(
  value: unknown,
  field: string,
  minimumLength = 1,
) {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} is required.`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < minimumLength) {
    throw new ValidationError(`${field} must be at least ${minimumLength} characters.`);
  }

  return trimmedValue;
}

export function optionalString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function requiredNumber(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
) {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  if (Number.isNaN(numericValue)) {
    throw new ValidationError(`${field} must be a number.`);
  }

  if (numericValue < minimum || numericValue > maximum) {
    throw new ValidationError(
      `${field} must be between ${minimum} and ${maximum}.`,
    );
  }

  return numericValue;
}

export function requiredStringArray(value: unknown, field: string) {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${field} must be a list.`);
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  if (items.length === 0) {
    throw new ValidationError(`${field} must include at least one item.`);
  }

  return items;
}

export function booleanValue(value: unknown) {
  return value === true;
}

export function enumValue<T extends string>(
  value: unknown,
  field: string,
  options: readonly T[],
): T {
  if (typeof value !== "string" || !options.includes(value as T)) {
    throw new ValidationError(
      `${field} must be one of: ${options.join(", ")}.`,
    );
  }

  return value as T;
}
