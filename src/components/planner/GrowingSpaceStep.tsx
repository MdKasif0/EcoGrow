import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Building, Trees, Sprout, Warehouse, Sun } from 'lucide-react'; // Example icons

const spaceTypeOptions = [
  { id: 'indoor', label: 'Indoor', icon: Home, description: "Growing inside your home, perhaps on a windowsill or with grow lights." },
  { id: 'balcony', label: 'Balcony', icon: Building, description: "Utilizing a balcony space for pots and containers." },
  { id: 'small_yard', label: 'Small Yard', icon: Trees, description: "A compact outdoor area, like a small backyard or patio." },
  { id: 'large_garden', label: 'Large Garden', icon: Sprout, description: "A spacious outdoor plot with ample room for various plants." },
  { id: 'greenhouse', label: 'Greenhouse', icon: Warehouse, description: "A dedicated structure for controlled environment growing." },
];

const sunlightOptions = [
  { id: 'full', label: 'Full Sun', icon: Sun, description: '6+ hours of direct sunlight per day.' },
  { id: 'partial', label: 'Partial Sun/Shade', icon: Sun, description: '3-6 hours of direct sunlight per day.' },
  { id: 'shade', label: 'Full Shade', icon: Sun, description: 'Less than 3 hours of direct sunlight per day.' },
];

interface GrowingSpaceStepProps {
  onNext: (data: { type: string; size: string; sunlight: string }) => void;
  onBack: () => void;
  data: { type: string; size: string; sunlight: string };
}

const GrowingSpaceStep: React.FC<GrowingSpaceStepProps> = ({ onNext, onBack, data }) => {
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>(data.type);
  const [spaceSize, setSpaceSize] = useState<string>(data.size);
  const [selectedSunlight, setSelectedSunlight] = useState<string>(data.sunlight);

  useEffect(() => {
    setSelectedSpaceType(data.type);
    setSpaceSize(data.size);
    setSelectedSunlight(data.sunlight);
  }, [data]);

  const handleSubmit = () => {
    if (selectedSpaceType && spaceSize && selectedSunlight) {
      onNext({
        type: selectedSpaceType,
        size: spaceSize,
        sunlight: selectedSunlight,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Tell us about your growing space 🌱
      </h2>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">What kind of space?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {spaceTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedSpaceType === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedSpaceType(option.id)}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center text-center space-y-2 transition-all h-full
                            ${isSelected
                              ? 'ring-2 ring-green-500 border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-300 hover:border-gray-400 hover:shadow-md bg-white'
                            }
                             text-gray-800`}
              >
                <Icon className={`h-10 w-10 mb-2 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="font-medium">{option.label}</span>
                <p className="text-xs text-gray-500 px-2">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="spaceSize" className="block text-lg font-medium text-gray-800 mb-3">
          Estimated Space Size (sq ft)
        </label>
        <input
          type="number"
          id="spaceSize"
          value={spaceSize}
          onChange={(e) => setSpaceSize(e.target.value)}
          placeholder="e.g., 100"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Sunlight Exposure</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sunlightOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedSunlight === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedSunlight(option.id)}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center text-center space-y-2 transition-all h-full
                            ${isSelected
                              ? 'ring-2 ring-green-500 border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-300 hover:border-gray-400 hover:shadow-md bg-white'
                            }
                             text-gray-800`}
              >
                <Icon className={`h-10 w-10 mb-2 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="font-medium">{option.label}</span>
                <p className="text-xs text-gray-500 px-2">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedSpaceType || !spaceSize || !selectedSunlight}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default GrowingSpaceStep;
