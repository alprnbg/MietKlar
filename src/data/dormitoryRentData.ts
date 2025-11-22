// Dormitory (Studentenwohnheim) rent data for Munich districts
// These represent average prices for a single room in student dormitories
// Dormitories are typically cheaper than WG rooms but often have waiting lists

export const dormitoryRentData: Record<string, {
  averageRent: number;
  minRent: number;
  maxRent: number;
  fairRent: number;
  pricePerSqm: number;
}> = {
  "01": { averageRent: 420, minRent: 280, maxRent: 580, fairRent: 380, pricePerSqm: 18.5 },
  "02": { averageRent: 390, minRent: 260, maxRent: 540, fairRent: 350, pricePerSqm: 17.2 },
  "03": { averageRent: 370, minRent: 250, maxRent: 510, fairRent: 330, pricePerSqm: 16.3 },
  "04": { averageRent: 350, minRent: 240, maxRent: 480, fairRent: 310, pricePerSqm: 15.4 },
  "05": { averageRent: 380, minRent: 260, maxRent: 530, fairRent: 340, pricePerSqm: 16.8 },
  "06": { averageRent: 330, minRent: 230, maxRent: 450, fairRent: 290, pricePerSqm: 14.5 },
  "07": { averageRent: 340, minRent: 235, maxRent: 470, fairRent: 300, pricePerSqm: 15.0 },
  "08": { averageRent: 350, minRent: 240, maxRent: 480, fairRent: 310, pricePerSqm: 15.4 },
  "09": { averageRent: 375, minRent: 255, maxRent: 520, fairRent: 335, pricePerSqm: 16.5 },
  "10": { averageRent: 310, minRent: 220, maxRent: 420, fairRent: 270, pricePerSqm: 13.6 },
  "11": { averageRent: 300, minRent: 215, maxRent: 410, fairRent: 260, pricePerSqm: 13.2 },
  "12": { averageRent: 365, minRent: 250, maxRent: 500, fairRent: 325, pricePerSqm: 16.1 },
  "13": { averageRent: 410, minRent: 275, maxRent: 570, fairRent: 370, pricePerSqm: 18.0 },
  "14": { averageRent: 320, minRent: 225, maxRent: 440, fairRent: 280, pricePerSqm: 14.1 },
  "15": { averageRent: 325, minRent: 230, maxRent: 450, fairRent: 285, pricePerSqm: 14.3 },
  "16": { averageRent: 315, minRent: 220, maxRent: 430, fairRent: 275, pricePerSqm: 13.9 },
  "17": { averageRent: 335, minRent: 235, maxRent: 460, fairRent: 295, pricePerSqm: 14.8 },
  "18": { averageRent: 340, minRent: 240, maxRent: 470, fairRent: 300, pricePerSqm: 15.0 },
  "19": { averageRent: 365, minRent: 250, maxRent: 500, fairRent: 325, pricePerSqm: 16.1 },
  "20": { averageRent: 330, minRent: 230, maxRent: 455, fairRent: 290, pricePerSqm: 14.5 },
  "21": { averageRent: 370, minRent: 255, maxRent: 515, fairRent: 330, pricePerSqm: 16.3 },
  "22": { averageRent: 320, minRent: 225, maxRent: 445, fairRent: 280, pricePerSqm: 14.1 },
  "23": { averageRent: 310, minRent: 220, maxRent: 420, fairRent: 270, pricePerSqm: 13.6 },
  "24": { averageRent: 295, minRent: 210, maxRent: 400, fairRent: 255, pricePerSqm: 13.0 },
  "25": { averageRent: 340, minRent: 240, maxRent: 465, fairRent: 300, pricePerSqm: 15.0 }
};
