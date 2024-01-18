export const formikhelpr = <T extends Object>(
  touched: { [K in keyof T]?: boolean | undefined },
  errors:T,
  values: T
): string[] => {
  const toucheKey = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });

  const finalError: string[] = [];
  Object.entries(errors).forEach(([key, value]) => {
    if (toucheKey.includes(key) && values && typeof value === "string")
      finalError.push(value as string);
  });
  return finalError;
};
