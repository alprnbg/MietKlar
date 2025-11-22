// WG (Wohngemeinschaft) room rent data for Munich districts
// These represent average prices for a single room in shared apartments

export const wgRentData: Record<string, {
  averageRent: number;
  minRent: number;
  maxRent: number;
  fairRent: number;
  pricePerSqm: number;
}> = {
  "01": { averageRent: 750, minRent: 550, maxRent: 1100, fairRent: 650, pricePerSqm: 23.5 },
  "02": { averageRent: 680, minRent: 500, maxRent: 950, fairRent: 600, pricePerSqm: 21.0 },
  "03": { averageRent: 650, minRent: 480, maxRent: 900, fairRent: 580, pricePerSqm: 19.8 },
  "04": { averageRent: 620, minRent: 450, maxRent: 850, fairRent: 550, pricePerSqm: 18.9 },
  "05": { averageRent: 670, minRent: 490, maxRent: 950, fairRent: 590, pricePerSqm: 20.6 },
  "06": { averageRent: 580, minRent: 420, maxRent: 800, fairRent: 520, pricePerSqm: 17.6 },
  "07": { averageRent: 600, minRent: 440, maxRent: 820, fairRent: 530, pricePerSqm: 18.1 },
  "08": { averageRent: 610, minRent: 450, maxRent: 850, fairRent: 540, pricePerSqm: 18.6 },
  "09": { averageRent: 660, minRent: 480, maxRent: 950, fairRent: 580, pricePerSqm: 20.1 },
  "10": { averageRent: 540, minRent: 400, maxRent: 750, fairRent: 480, pricePerSqm: 16.3 },
  "11": { averageRent: 530, minRent: 390, maxRent: 730, fairRent: 470, pricePerSqm: 15.9 },
  "12": { averageRent: 640, minRent: 470, maxRent: 900, fairRent: 570, pricePerSqm: 19.4 },
  "13": { averageRent: 720, minRent: 530, maxRent: 1050, fairRent: 640, pricePerSqm: 22.6 },
  "14": { averageRent: 560, minRent: 410, maxRent: 780, fairRent: 490, pricePerSqm: 16.8 },
  "15": { averageRent: 570, minRent: 420, maxRent: 800, fairRent: 500, pricePerSqm: 17.2 },
  "16": { averageRent: 550, minRent: 400, maxRent: 760, fairRent: 480, pricePerSqm: 16.5 },
  "17": { averageRent: 590, minRent: 430, maxRent: 820, fairRent: 520, pricePerSqm: 17.9 },
  "18": { averageRent: 600, minRent: 440, maxRent: 840, fairRent: 530, pricePerSqm: 18.4 },
  "19": { averageRent: 640, minRent: 470, maxRent: 900, fairRent: 570, pricePerSqm: 19.3 },
  "20": { averageRent: 580, minRent: 430, maxRent: 810, fairRent: 510, pricePerSqm: 17.7 },
  "21": { averageRent: 650, minRent: 480, maxRent: 920, fairRent: 580, pricePerSqm: 19.9 },
  "22": { averageRent: 560, minRent: 410, maxRent: 790, fairRent: 490, pricePerSqm: 17.1 },
  "23": { averageRent: 540, minRent: 400, maxRent: 750, fairRent: 470, pricePerSqm: 16.2 },
  "24": { averageRent: 520, minRent: 380, maxRent: 730, fairRent: 460, pricePerSqm: 15.8 },
  "25": { averageRent: 600, minRent: 440, maxRent: 830, fairRent: 530, pricePerSqm: 18.3 }
};
