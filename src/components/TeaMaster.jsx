import React, { useState, useEffect } from 'react';

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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">TeaMaster</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Eistee Name</label>
            <input
              type="text"
              value={teeName}
              onChange={(e) => setTeeName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tester Name</label>
            <input
              type="text"
              value={testerName}
              onChange={(e) => setTesterName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {Object.entries(criteria).map(([key, { name, description }]) => (
          <div key={key} className="mb-6">
            <label className="block text-sm font-medium">{name}</label>
            <p className="text-xs text-gray-500 mb-2">{description}</p>
            <div className="relative pt-6 pb-2">
              <div className="flex justify-between absolute top-0 w-full px-2">
                {[0,2,4,6,8,10].map(num => (
                  <span key={num} className="text-xs text-gray-500">{num}</span>
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
              <div className="text-center mt-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  {ratings[key]}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Notizen</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Gesamtwertung: {calculateScore()}/10
          </div>
          <button
            onClick={handleSave}
            disabled={!teeName || !testerName}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Bewertung speichern
          </button>
        </div>
      </div>

      {savedRatings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Gespeicherte Bewertungen</h2>
          <div className="space-y-4">
            {savedRatings.map((rating, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rating.name}</h3>
                    <p className="text-sm text-gray-500">Getestet von: {rating.tester}</p>
                  </div>
                  <span className="text-lg font-bold">{rating.score}/10</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  {Object.entries(rating.ratings).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{criteria[key].name}:</span> {value}/10
                    </div>
                  ))}
                </div>
                {rating.notes && (
                  <p className="mt-2 text-sm text-gray-600">{rating.notes}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{rating.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeaMaster;
