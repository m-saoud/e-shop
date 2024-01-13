export const formikhelpr = <T extends Object>(
  touched: { [key: string]: boolean },
  errors: T,
  values: T
) => {
  const toucheKey = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });
  const finalError: any[] = [];
  Object.entries(errors).forEach(([key, value]) => {
    if (toucheKey.includes(key) && values) finalError.push(value);
  });
  return finalError;
};


