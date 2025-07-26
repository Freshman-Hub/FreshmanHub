export const cleanFirestoreData = (data: any): any => {
  const cleaned: any = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Only add fields that are not undefined
    if (value !== undefined) {
      // Handle nested objects
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const cleanedNested = cleanFirestoreData(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });

  return cleaned;
};
