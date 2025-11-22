// Color scale based on rent unfairness (percentage above fair rent)
// Negative values = below fair rent (good for tenants)
// Positive values = above fair rent (unfair to tenants)
export const getUnfairnessColor = (unfairnessPercentage: number): string => {
  if (unfairnessPercentage >= 20) return '#d7191c';  // Dark red - very unfair (>20% above)
  if (unfairnessPercentage >= 15) return '#f46d43';  // Red - highly unfair (15-20% above)
  if (unfairnessPercentage >= 10) return '#fdae61';  // Orange - unfair (10-15% above)
  if (unfairnessPercentage >= 5) return '#fee08b';   // Light orange - moderately unfair (5-10% above)
  if (unfairnessPercentage >= 0) return '#d9ef8b';   // Yellow-green - slightly above fair (0-5% above)
  if (unfairnessPercentage >= -5) return '#a6d96a';  // Light green - fair (0-5% below)
  return '#66bd63';                                  // Green - very fair (<5% below)
};

// Legacy color scales (kept for backward compatibility if needed elsewhere)
export const getApartmentRentColor = (pricePerSqm: number): string => {
  if (pricePerSqm >= 28) return '#d7191c';
  if (pricePerSqm >= 24) return '#fdae61';
  if (pricePerSqm >= 21) return '#ffffbf';
  if (pricePerSqm >= 18) return '#a6d96a';
  return '#1a9641';
};

export const getWGRentColor = (pricePerSqm: number): string => {
  if (pricePerSqm >= 25) return '#d7191c';
  if (pricePerSqm >= 22) return '#fdae61';
  if (pricePerSqm >= 19) return '#ffffbf';
  if (pricePerSqm >= 16) return '#a6d96a';
  return '#1a9641';
};

export const getDormitoryRentColor = (pricePerSqm: number): string => {
  if (pricePerSqm >= 22) return '#d7191c';
  if (pricePerSqm >= 19) return '#fdae61';
  if (pricePerSqm >= 17) return '#ffffbf';
  if (pricePerSqm >= 15) return '#a6d96a';
  return '#1a9641';
};
