export const getApartmentRentColor = (averageRent: number): string => {
  if (averageRent >= 1700) return '#d7191c';  // Red - very expensive
  if (averageRent >= 1500) return '#fdae61';  // Orange - expensive
  if (averageRent >= 1350) return '#ffffbf';  // Yellow - medium
  if (averageRent >= 1200) return '#a6d96a';  // Light green - moderate
  return '#1a9641';                            // Green - affordable
};

export const getWGRentColor = (averageRent: number): string => {
  if (averageRent >= 700) return '#d7191c';   // Red - very expensive (€700+)
  if (averageRent >= 630) return '#fdae61';   // Orange - expensive (€630-700)
  if (averageRent >= 570) return '#ffffbf';   // Yellow - medium (€570-630)
  if (averageRent >= 510) return '#a6d96a';   // Light green - moderate (€510-570)
  return '#1a9641';                            // Green - affordable (<€510)
};

export const getDormitoryRentColor = (averageRent: number): string => {
  if (averageRent >= 400) return '#d7191c';   // Red - very expensive (€400+)
  if (averageRent >= 370) return '#fdae61';   // Orange - expensive (€370-400)
  if (averageRent >= 340) return '#ffffbf';   // Yellow - medium (€340-370)
  if (averageRent >= 310) return '#a6d96a';   // Light green - moderate (€310-340)
  return '#1a9641';                            // Green - affordable (<€310)
};
