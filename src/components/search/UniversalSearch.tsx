import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';
import { mockPlants } from '@/lib/ai/plantRecommender';

interface UniversalSearchProps {
  onPlantSelect: (plant: PlantRecommendation) => void;
}

export default function UniversalSearch({ onPlantSelect }: UniversalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchPlants = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would be an API call
      const filteredPlants = mockPlants.filter(plant =>
        plant.name.toLowerCase().includes(query.toLowerCase()) ||
        plant.type.toLowerCase().includes(query.toLowerCase()) ||
        plant.description.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filteredPlants);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(searchPlants, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (plant: PlantRecommendation) => {
    onPlantSelect(plant);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search for any plant..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (query || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => handleSelect(plant)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500">{plant.type}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {plant.difficulty}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                No plants found matching "{query}"
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 