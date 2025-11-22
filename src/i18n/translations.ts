export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Header
    appTitle: 'München Mietenübersicht',
    appSubtitle: 'Faire Mieten für Münchner Stadtteile',
    apartments: 'Wohnungen',
    wgRooms: 'WG-Zimmer',
    dormitories: 'Studentenwohnheime',
    rentSimulator: 'Mieterhöhung Simulator',
    addRent: 'Ihre Miete eingeben',
    editRent: 'Miete bearbeiten',

    // Rent Type Switcher
    apartmentsBtn: 'Wohnungen',
    wgRoomsBtn: 'WG-Zimmer',
    dormitoriesBtn: 'Wohnheim',

    // Legend
    averageRent: 'Durchschnittsmiete',
    avgWgRent: 'Ø WG-Zimmer Miete',
    avgDormRent: 'Ø Wohnheim Miete',
    affordable: 'Günstig',
    moderate: 'Moderat',
    medium: 'Mittel',
    expensive: 'Teuer',
    veryExpensive: 'Sehr teuer',

    // District Detail
    rentOverview: 'Mietübersicht',
    averageRentLabel: 'Durchschnittsmiete:',
    fairRentLabel: 'Faire Miete:',
    pricePerSqm: 'Preis pro m²:',
    minRent: 'Min. Miete:',
    maxRent: 'Max. Miete:',
    savingsPotential: 'Sparpotenzial',
    savingsText: 'Bei fairer Miete könnten Sie durchschnittlich',
    perMonth: 'pro Monat sparen',
    alreadyFair: 'Die Mieten in diesem Stadtteil liegen bereits im fairen Bereich.',

    // Pressure Index
    pressureIndex: 'Marktdruck-Index',
    listingCount: 'Anzahl Anzeigen:',
    daysOnline: 'Tage online:',
    growthRate: 'Wachstumsrate:',
    studentRate: 'Studentenanteil:',
    highIncomeRate: 'Hohe Einkommen:',
    days: 'Tage',

    // Fair Rent Info
    whatIsFairRent: 'Was ist faire Miete?',
    fairRentExplanation: 'Die faire Miete basiert auf dem Mietspiegel München und berücksichtigt Lage, Ausstattung und Wohnqualität. Sie dient als Orientierung für angemessene Mietpreise.',

    // Rent Increase Simulator
    simulatorTitle: 'Mieterhöhungs-Simulator',
    simulatorDescription: 'Überprüfen Sie, ob Ihre Mieterhöhung innerhalb der gesetzlichen Grenzen liegt.',
    currentRent: 'Aktuelle Monatsmiete (€)',
    proposedRent: 'Vorgeschlagene neue Miete (€)',
    yearsSinceIncrease: 'Jahre seit letzter Erhöhung',
    calculate: 'Berechnen',
    legal: '✓ Innerhalb gesetzlicher Grenzen',
    illegal: '✗ Überschreitet gesetzliche Grenzen',
    increase: 'Erhöhung',
    monthlyIncrease: 'monatliche Erhöhung',
    legalLimits: 'Gesetzliche Grenzen (Deutschland)',
    maxIncrease3Years: '3-Jahres-Max. Erhöhung:',
    maxRent3Years: 'Max. Miete (3 Jahre):',
    estimatedInflation: 'Geschätzte Inflation:',
    inflationBasedMax: 'Inflationsbasiert Max:',
    mietspiegelPlus: 'Mietspiegel + 10%:',
    excess: 'Überschuss',
    simulatorNote: 'Hinweis:',
    simulatorNoteText: 'Diese Berechnung zeigt allgemeine gesetzliche Grenzen. Die Mietpreisbremse-Regeln gelten für München. Konsultieren Sie einen Anwalt für genaue rechtliche Informationen.',
  },
  en: {
    // Header
    appTitle: 'Munich Rent Overview',
    appSubtitle: 'Fair Rents for Munich Districts',
    apartments: 'Apartments',
    wgRooms: 'Shared Rooms',
    dormitories: 'Student Dormitories',
    rentSimulator: 'Rent Increase Simulator',
    addRent: 'Enter Your Rent',
    editRent: 'Edit Rent',

    // Rent Type Switcher
    apartmentsBtn: 'Apartments',
    wgRoomsBtn: 'Shared Rooms',
    dormitoriesBtn: 'Dormitory',

    // Legend
    averageRent: 'Average Rent',
    avgWgRent: 'Avg. Shared Room Rent',
    avgDormRent: 'Avg. Dormitory Rent',
    affordable: 'Affordable',
    moderate: 'Moderate',
    medium: 'Medium',
    expensive: 'Expensive',
    veryExpensive: 'Very Expensive',

    // District Detail
    rentOverview: 'Rent Overview',
    averageRentLabel: 'Average Rent:',
    fairRentLabel: 'Fair Rent:',
    pricePerSqm: 'Price per sqm:',
    minRent: 'Min. Rent:',
    maxRent: 'Max. Rent:',
    savingsPotential: 'Savings Potential',
    savingsText: 'With fair rent you could save on average',
    perMonth: 'per month',
    alreadyFair: 'Rents in this district are already within the fair range.',

    // Pressure Index
    pressureIndex: 'Market Pressure Index',
    listingCount: 'Listing Count:',
    daysOnline: 'Days Online:',
    growthRate: 'Growth Rate:',
    studentRate: 'Student Rate:',
    highIncomeRate: 'High Income:',
    days: 'days',

    // Fair Rent Info
    whatIsFairRent: 'What is Fair Rent?',
    fairRentExplanation: 'Fair rent is based on the Munich rent index and considers location, amenities, and housing quality. It serves as a guideline for reasonable rent prices.',

    // Rent Increase Simulator
    simulatorTitle: 'Rent Increase Simulator',
    simulatorDescription: 'Check if your rent increase is within legal limits.',
    currentRent: 'Current Monthly Rent (€)',
    proposedRent: 'Proposed New Rent (€)',
    yearsSinceIncrease: 'Years Since Last Increase',
    calculate: 'Calculate',
    legal: '✓ Within Legal Limits',
    illegal: '✗ Exceeds Legal Limits',
    increase: 'Increase',
    monthlyIncrease: 'monthly increase',
    legalLimits: 'Legal Limits (Germany)',
    maxIncrease3Years: '3-Year Max Increase:',
    maxRent3Years: 'Max Rent (3 years):',
    estimatedInflation: 'Estimated Inflation:',
    inflationBasedMax: 'Inflation-based Max:',
    mietspiegelPlus: 'Rent Index + 10%:',
    excess: 'excess',
    simulatorNote: 'Note:',
    simulatorNoteText: 'This calculation shows general legal limits. Rent control (Mietpreisbremse) rules apply in Munich. Consult a lawyer for precise legal information.',
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations.de): string {
  return translations[lang][key] || translations.de[key];
}
