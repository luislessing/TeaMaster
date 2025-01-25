import React, { useState, useEffect } from 'react';
import Logo from '../assets/tea-14.svg'

const TeaMaster = () => {
  const [ratings, setRatings] = useState({
    geschmack: 0,
    suesse: 0,
    erfrischung: 0,
    natuerlichkeit: 0,
    preis: 0
  });

  const [teeName, setTeeName] = useState('');
  const [testerName, setTesterName] = useState('');
  const [notes, setNotes] = useState('');
  const [savedRatings, setSavedRatings] = useState([]);

  const criteria = {
    geschmack: {
      name: 'Geschmack',
      weight: 0.35,
      description: 'Ausgewogenheit und Intensität'
    },
    suesse: {
      name: 'Süße',
      weight: 0.15,
      description: 'Balance der Süße'
    },
    erfrischung: {
      name: 'Erfrischung',
      weight: 0.25,
      description: 'Durstlöschend'
    },
    natuerlichkeit: {
      name: 'Natürlichkeit',
      weight: 0.15,
      description: 'Natürlicher vs. künstlicher Geschmack'
    },
    preis: {
      name: 'Preis-Leistung',
      weight: 0.10,
      description: 'Wert für den Preis'
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('ratings');
    if (stored) setSavedRatings(JSON.parse(stored));
  }, []);

  const calculateScore = () => {
    return Object.entries(ratings).reduce((total, [key, value]) => {
      return total + (value * criteria[key].weight);
    }, 0).toFixed(2);
  };

  const handleSave = () => {
    if (!teeName || !testerName) return;

    const newRating = {
      name: teeName,
      tester: testerName,
      ratings,
      score: calculateScore(),
      notes,
      date: new Date().toLocaleDateString()
    };

    const updated = [...savedRatings, newRating].sort((a, b) => b.score - a.score);
    localStorage.setItem('ratings', JSON.stringify(updated));
    setSavedRatings(updated);

    setTeeName('');
    setTesterName('');
    setNotes('');
    setRatings({
      geschmack: 0,
      suesse: 0,
      erfrischung: 0,
      natuerlichkeit: 0,
      preis: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              </span>
            </h2>
            <div className="flex items-center justify-between mb-6">
  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
    <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
      TeaMaster
    </span>
  </h2>
  <img src={Logo} alt="TeaMaster Logo" className="h-20 w-20" />

</div>          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Eistee Name</label>
              <input
                type="text"
                value={teeName}
                onChange={(e) => setTeeName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="z.B. Classic Lemon"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tester Name</label>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Dein Name"
              />
            </div>
          </div>

          {Object.entries(criteria).map(([key, { name, description }]) => (
            <div key={key} className="mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">{name}</label>
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {ratings[key]}
                </span>
              </div>
              <div className="relative pt-6">
                <div className="flex justify-between absolute top-0 w-full px-2">
                  {[0,2,4,6,8,10].map(num => (
                    <span key={num} className="text-xs text-gray-400">{num}</span>
                  ))}
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={ratings[key]}
                  onChange={(e) => setRatings(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows="3"
              placeholder="Zusätzliche Bemerkungen..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-lg">
            <div className="text-xl font-bold text-gray-800">
              Gesamtwertung: <span className="text-blue-500">{calculateScore()}/10</span>
            </div>
            <button
              onClick={handleSave}
              disabled={!teeName || !testerName}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Bewertung speichern
            </button>
          </div>
        </div>

        {savedRatings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gespeicherte Bewertungen</h2>
            <div className="space-y-6">
              {savedRatings.map((rating, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{rating.name}</h3>
                      <p className="text-sm text-gray-500">Getestet von: {rating.tester}</p>
                    </div>
                    <span className="text-lg font-bold text-blue-500">{rating.score}/10</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
                    {Object.entries(rating.ratings).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-2 rounded">
                        <span className="font-medium text-gray-700">{criteria[key].name}:</span>
                        <span className="text-gray-600"> {value}/10</span>
                      </div>
                    ))}
                  </div>
                  {rating.notes && (
                    <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">{rating.notes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{rating.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeaMaster;