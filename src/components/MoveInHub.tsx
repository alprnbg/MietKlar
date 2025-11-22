import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface CommunityTip {
  id: string;
  category: 'shopping' | 'furniture' | 'neighborhood' | 'transport' | 'checklist';
  title: string;
  description: string;
  author: string;
  votes: number;
  date: string;
}

const mockTips: CommunityTip[] = [
  {
    id: '1',
    category: 'shopping',
    title: 'Günstige Lebensmittel bei ALDI Süd',
    description: 'ALDI Süd in der Nähe von Sendlinger Tor hat die besten Preise für frisches Obst und Gemüse. Dienstags gibt es oft Sonderangebote!',
    author: 'Maria K.',
    votes: 127,
    date: '2025-01-10'
  },
  {
    id: '2',
    category: 'furniture',
    title: 'Second-Hand Möbel bei Haidhausen Flohmarkt',
    description: 'Jeden Samstag ab 8 Uhr am Wiener Platz. Ich habe dort meine komplette Küche für unter 200€ bekommen!',
    author: 'Thomas M.',
    votes: 98,
    date: '2025-01-08'
  },
  {
    id: '3',
    category: 'transport',
    title: 'MVG Semesterticket nicht vergessen!',
    description: 'Als Student bekommst du das Semesterticket für nur 69€/Semester. Gilt für alle U-Bahnen, Busse und Trams in München.',
    author: 'Lisa S.',
    votes: 145,
    date: '2025-01-05'
  },
  {
    id: '4',
    category: 'neighborhood',
    title: 'Schwabing - Perfekt für Studenten',
    description: 'Viele Cafés, LMU in der Nähe, gute Atmosphäre. Etwas teurer aber es lohnt sich. Leopoldstraße ist super für Einkäufe.',
    author: 'Ahmed R.',
    votes: 89,
    date: '2025-01-03'
  },
  {
    id: '5',
    category: 'checklist',
    title: 'Anmeldung nicht vergessen!',
    description: 'Innerhalb von 14 Tagen nach Einzug musst du dich beim Kreisverwaltungsreferat anmelden. Online Termin buchen!',
    author: 'Julia W.',
    votes: 156,
    date: '2025-01-01'
  },
  {
    id: '6',
    category: 'furniture',
    title: 'IKEA Rabatt-Ecke in Eching',
    description: 'IKEA Eching hat eine große Fundgrube mit bis zu 70% Rabatt. Perfekt für Budget-Möbel!',
    author: 'Max P.',
    votes: 112,
    date: '2024-12-28'
  }
];

const checklist = [
  { id: 1, task: 'Wohnungsübergabeprotokoll erstellen', priority: 'high' },
  { id: 2, task: 'Strom-/Gasanbieter anmelden', priority: 'high' },
  { id: 3, task: 'Internet/WLAN bestellen', priority: 'high' },
  { id: 4, task: 'Bei Stadt anmelden (Kreisverwaltungsreferat)', priority: 'high' },
  { id: 5, task: 'Rundfunkbeitrag anmelden', priority: 'medium' },
  { id: 6, task: 'Hausratversicherung abschließen', priority: 'medium' },
  { id: 7, task: 'Nachsendeauftrag bei Post einrichten', priority: 'medium' },
  { id: 8, task: 'Bank über Adressänderung informieren', priority: 'medium' },
  { id: 9, task: 'Nachbarn begrüßen', priority: 'low' },
  { id: 10, task: 'Mülltrennungssystem verstehen', priority: 'low' }
];

export const MoveInHub = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const categories = [
    { key: 'all', label: language === 'de' ? 'Alle' : 'All', icon: '📋' },
    { key: 'shopping', label: language === 'de' ? 'Einkaufen' : 'Shopping', icon: '🛒' },
    { key: 'furniture', label: language === 'de' ? 'Möbel' : 'Furniture', icon: '🛋️' },
    { key: 'transport', label: language === 'de' ? 'Transport' : 'Transport', icon: '🚇' },
    { key: 'neighborhood', label: language === 'de' ? 'Viertel' : 'Neighborhood', icon: '🏘️' },
    { key: 'checklist', label: language === 'de' ? 'Checkliste' : 'Checklist', icon: '✅' }
  ];

  const filteredTips = mockTips.filter(tip =>
    selectedCategory === 'all' || tip.category === selectedCategory
  );

  const toggleCheckItem = (id: number) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#ffebee', color: '#c62828', label: 'Hoch' };
      case 'medium': return { bg: '#fff3e0', color: '#e65100', label: 'Mittel' };
      default: return { bg: '#e8f5e9', color: '#2e7d32', label: 'Niedrig' };
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          🏠 Move-in Hub
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          {language === 'de'
            ? 'Community-getriebene Tipps & Tricks für neue Bewohner in München. Von Studenten für Studenten.'
            : 'Community-driven tips & tricks for new residents in Munich. By students for students.'}
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '12px',
              background: selectedCategory === cat.key
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'white',
              color: selectedCategory === cat.key ? 'white' : '#333',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: selectedCategory === cat.key
                ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                : '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {selectedCategory === 'checklist' || selectedCategory === 'all' ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
            ✅ {language === 'de' ? 'Umzugs-Checkliste' : 'Moving Checklist'}
          </h2>
          <div style={{ marginBottom: '16px', color: '#666' }}>
            {checkedItems.length} / {checklist.length} {language === 'de' ? 'erledigt' : 'completed'}
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              width: `${(checkedItems.length / checklist.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {checklist.map(item => {
              const isChecked = checkedItems.includes(item.id);
              const priorityConfig = getPriorityColor(item.priority);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: isChecked ? '#f5f5f5' : 'white',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.6 : 1
                  }}
                  onClick={() => toggleCheckItem(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      accentColor: '#667eea'
                    }}
                  />
                  <div style={{ flex: 1, fontSize: '16px', color: '#333' }}>
                    {item.task}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: priorityConfig.bg,
                    color: priorityConfig.color
                  }}>
                    {priorityConfig.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Community Tips */}
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
          💡 {language === 'de' ? 'Community Tipps' : 'Community Tips'}
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredTips.map(tip => (
            <div
              key={tip.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                  {tip.title}
                </h3>
                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                  {tip.description}
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e0e0e0'
              }}>
                <div style={{ fontSize: '14px', color: '#999' }}>
                  👤 {tip.author} · {new Date(tip.date).toLocaleDateString()}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: '#e8f5e9',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>👍</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2e7d32' }}>
                    {tip.votes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
