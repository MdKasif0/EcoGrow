import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Clock3, Zap, Lightbulb, Recycle } from 'lucide-react';

const commitmentLevels = [
  { value: 1, label: 'Minimal', description: '~1-2 hours/week (e.g., very low maintenance herbs)' },
  { value: 2, label: 'Low', description: '~2-4 hours/week (e.g., some hardy vegetables)' },
  { value: 3, label: 'Moderate', description: '~4-6 hours/week (e.g., a small mixed garden)' },
  { value: 4, label: 'High', description: '~6-8 hours/week (e.g., a larger, more diverse garden)' },
  { value: 5, label: 'Very High', description: '8+ hours/week (e.g., intensive gardening, greenhouse)' },
];

const automationOptions = [
  { id: 'manual', label: 'Manual', icon: Lightbulb, description: 'I prefer to do everything myself.' },
  { id: 'some_automation', label: 'Some Automation', icon: Zap, description: 'I like some smart tools, but still want to be hands-on.' },
  { id: 'full_automation', label: 'Full Automation', icon: Recycle, description: 'Automate as much as possible.' },
];

interface TimeCommitmentStepProps {
  onNext: (data: { timeCommitment: string; automation: string }) => void;
  onBack: () => void;
  data: { timeCommitment: string; automation: string };
}

const TimeCommitmentStep: React.FC<TimeCommitmentStepProps> = ({ onNext, onBack, data }) => {
  const [commitment, setCommitment] = useState<string>(data.timeCommitment);
  const [automation, setAutomation] = useState<string>(data.automation);

  useEffect(() => {
    setCommitment(data.timeCommitment);
    setAutomation(data.automation);
  }, [data]);

  const handleSubmit = () => {
    if (commitment && automation) {
      onNext({
        timeCommitment: commitment,
        automation: automation,
      });
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (value.length > 0) {
      const selectedCommitment = commitmentLevels.find(level => level.value === value[0]);
      if (selectedCommitment) {
        setCommitment(selectedCommitment.label); // Store label instead of value
      }
    }
  };

  const currentLevel = commitmentLevels.find(level => level.label === commitment);

  return (
    <div className="space-y-8 py-4">
      <h2 className="text-xl font-semibold text-gray-900">
        How much time can you dedicate per week? 🕰️
      </h2>

      <div className="w-full">
        <Slider
          value={[currentLevel?.value || 3]} // Default to moderate if not set
          onValueChange={handleSliderChange}
          min={commitmentLevels[0].value}
          max={commitmentLevels[commitmentLevels.length - 1].value}
          step={1}
          className="w-full py-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="flex items-center"><Clock3 className="inline h-4 w-4 mr-1"/>{commitmentLevels[0].label}</span>
          <span className="flex items-center">{commitmentLevels[commitmentLevels.length - 1].label}<Zap className="inline h-4 w-4 ml-1"/></span>
        </div>
      </div>

      {currentLevel && (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="font-medium text-lg text-gray-800">{currentLevel.label}</p>
          <p className="text-sm text-gray-600">{currentLevel.description}</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          How much automation do you prefer? 🤖
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {automationOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = automation === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setAutomation(option.id)}
                title={option.description}
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
        <Button onClick={handleSubmit} disabled={!commitment || !automation}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default TimeCommitmentStep;
