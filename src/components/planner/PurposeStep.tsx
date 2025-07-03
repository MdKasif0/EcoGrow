import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carrot, Leaf, Grape, Flower2, HeartPulse, ShieldCheck, Target } from 'lucide-react';

const plantTypeOptions = [
  { id: 'vegetables', label: 'Vegetables', icon: Carrot, description: "Grow your own food like tomatoes, cucumbers, peppers, etc." },
  { id: 'herbs', label: 'Herbs', icon: Leaf, description: "Fresh herbs like basil, mint, rosemary for culinary or aromatic uses." },
  { id: 'fruits', label: 'Fruits', icon: Grape, description: "Enjoy homegrown fruits such as berries, melons, or even dwarf fruit trees." },
  { id: 'flowers', label: 'Flowers', icon: Flower2, description: "Beautify your space with ornamental flowers." },
  { id: 'medicinal', label: 'Medicinal', icon: HeartPulse, description: "Grow plants known for their traditional medicinal properties." },
  { id: 'pet_safe', label: 'Pet-Safe', icon: ShieldCheck, description: "Choose plants that are non-toxic to your beloved pets." },
];

const goalsOptions = [
  { id: 'food', label: 'Food Production', description: 'Grow edible plants for cooking and consumption.' },
  { id: 'ornamental', label: 'Ornamental Display', description: 'Enhance aesthetic appeal with beautiful plants.' },
  { id: 'medicinal', label: 'Medicinal Use', description: 'Cultivate plants for their health benefits.' },
  { id: 'mixed', label: 'Mixed Goals', description: 'A combination of different gardening purposes.' },
];

interface PurposeStepProps {
  onNext: (data: { goals: string; plantTypes: string[] }) => void;
  onBack: () => void;
  data: { goals: string; plantTypes: string[] };
}

const PurposeStep: React.FC<PurposeStepProps> = ({ onNext, onBack, data }) => {
  const [selectedPlantTypes, setSelectedPlantTypes] = useState<string[]>(data.plantTypes);
  const [selectedGoal, setSelectedGoal] = useState<string>(data.goals);

  useEffect(() => {
    if (Array.isArray(data.plantTypes)) {
      setSelectedPlantTypes(data.plantTypes);
    }
    setSelectedGoal(data.goals);
  }, [data]);

  const handleTogglePlantType = (plantTypeId: string) => {
    setSelectedPlantTypes(prev =>
      prev.includes(plantTypeId)
        ? prev.filter(id => id !== plantTypeId)
        : [...prev, plantTypeId]
    );
  };

  const handleSubmit = () => {
    if (selectedPlantTypes.length > 0 && selectedGoal) {
      onNext({
        goals: selectedGoal,
        plantTypes: selectedPlantTypes,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        What are your gardening goals and what do you want to grow? 🌱
      </h2>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Primary Gardening Goal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {goalsOptions.map((option) => {
            const isSelected = selectedGoal === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedGoal(option.id)}
                title={option.description}
                className={`p-3 border rounded-lg flex items-center space-x-2.5 transition-all min-w-[130px] justify-start hover:shadow-md
                            ${isSelected
                              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-100 shadow-md'
                              : 'border-gray-300 hover:border-blue-400 bg-white'
                            }
                            text-gray-800`}
              >
                <Target className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">What types of plants are you interested in? <span className="text-sm font-normal text-gray-600">(Select all that apply)</span></h3>
        <div className="flex flex-wrap gap-3">
          {plantTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPlantTypes.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleTogglePlantType(option.id)}
                title={option.description}
                className={`p-3 border rounded-lg flex items-center space-x-2.5 transition-all min-w-[130px] justify-start hover:shadow-md
                            ${isSelected
                              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-100 shadow-md'
                              : 'border-gray-300 hover:border-blue-400 bg-white'
                            }
                            text-gray-800`}
              >
                <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={selectedPlantTypes.length === 0 || !selectedGoal}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default PurposeStep;
