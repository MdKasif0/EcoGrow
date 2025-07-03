import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlantRecommendation } from '@/lib/ai/plantRecommender';
import { Calendar, Camera, BookOpen, Droplets, Sun, Thermometer, Leaf, FlaskConical, Users, Lightbulb, Info } from 'lucide-react';
import PlantHealthScanner from '../homefeatures/PlantHealthScanner';
import SmartCalendarReminders from '../homefeatures/SmartCalendarReminders';

interface PlantOverviewProps {
  plant: PlantRecommendation;
  onBack: () => void;
}

export default function PlantOverview({ plant, onBack }: PlantOverviewProps) {
  const [showFullGrowingGuide, setShowFullGrowingGuide] = useState(false);

  // Helper function to parse duration string (e.g., "7-14 days") into min/max days
  const parseDurationToDays = (duration: string): { min: number, max: number } => {
    const parts = duration.split(' ');
    if (parts.length < 2) return { min: 0, max: 0 };
    const [num1, num2] = parts[0].split('-').map(Number);
    const unit = parts[1].toLowerCase();

    let minDays = num1;
    let maxDays = num2 || num1;

    if (unit.includes('month')) {
      minDays *= 30; // Approximation
      maxDays *= 30; // Approximation
    } else if (unit.includes('week')) {
      minDays *= 7;
      maxDays *= 7;
    }

    return { min: minDays, max: maxDays };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 flex items-center space-x-2 mb-8"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-8"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-2">{plant.name}</h1>
          {plant.scientificName && (
            <p className="text-gray-500 italic mb-2">{plant.scientificName}</p>
          )}
          <p className="text-gray-700 leading-relaxed">{plant.description}</p>
        </motion.div>

        {/* 1. Plant Info Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2 text-green-600" />
            Plant Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
            <div>
              <p className="font-medium">Type:</p>
              <p>{plant.type}</p>
            </div>
            <div>
              <p className="font-medium">Difficulty:</p>
              <p>{plant.difficulty}</p>
            </div>
            <div>
              <p className="font-medium">Growing Time:</p>
              <p>{plant.growingTime}</p>
            </div>
            <div>
              <p className="font-medium">Sunlight:</p>
              <p>{plant.sunlight}</p>
            </div>
            <div>
              <p className="font-medium">Water:</p>
              <p>{plant.water}</p>
            </div>
            {plant.commonNames && plant.commonNames.length > 0 && (
              <div>
                <p className="font-medium">Common Names:</p>
                <p>{plant.commonNames.join(', ')}</p>
              </div>
            )}
            {plant.careInstructions && (
              <div className="md:col-span-2 space-y-2 mt-4">
                <h3 className="font-semibold text-lg text-green-800">Care Tips:</h3>
                {plant.careInstructions.watering && <p><span className="font-medium">Watering:</span> {plant.careInstructions.watering}</p>}
                {plant.careInstructions.sunlight && <p><span className="font-medium">Sunlight:</span> {plant.careInstructions.sunlight}</p>}
                {plant.careInstructions.soil && <p><span className="font-medium">Soil:</span> {plant.careInstructions.soil}</p>}
                {plant.careInstructions.temperature && <p><span className="font-medium">Temperature:</span> {plant.careInstructions.temperature}</p>}
                {plant.careInstructions.humidity && <p><span className="font-medium">Humidity:</span> {plant.careInstructions.humidity}</p>}
                {plant.careInstructions.fertilizing && <p><span className="font-medium">Fertilizing:</span> {plant.careInstructions.fertilizing}</p>}
                {plant.careInstructions.pruning && <p><span className="font-medium">Pruning:</span> {plant.careInstructions.pruning}</p>}
              </div>
            )}
            {plant.benefits && plant.benefits.length > 0 && (
              <div className="md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg text-green-800">Benefits:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {plant.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                </ul>
              </div>
            )}
            {plant.warnings && plant.warnings.length > 0 && (
              <div className="md:col-span-2 mt-4">
                <h3 className="font-semibold text-lg text-red-700">Warnings:</h3>
                <ul className="list-disc list-inside text-red-600">
                  {plant.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                </ul>
              </div>
            )}
          </div>
        </motion.section>

        {/* 2. Step-by-Step Growing Guide */}
        {plant.growingStages && plant.growingStages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-600" />
              Step-by-Step Growing Guide
            </h2>
            <div className="space-y-6">
              {plant.growingStages.slice(0, showFullGrowingGuide ? plant.growingStages.length : 3).map((stage, index) => (
                <div key={index} className="relative pl-8 pb-4">
                  {index < (showFullGrowingGuide ? plant.growingStages.length : 3) - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">{stage.stage}</h4>
                    <p className="text-sm text-gray-600 mb-1">{stage.duration}</p>
                    {Array.isArray(stage.instructions) ? (
                      <ul className="list-disc list-inside text-gray-700">
                        {stage.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">{stage.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
              {plant.growingStages.length > 3 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowFullGrowingGuide(!showFullGrowingGuide)}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {showFullGrowingGuide ? 'Show Less' : 'Show All Stages'}
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* 3. Seed-to-Harvest Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Seed-to-Harvest Timeline
          </h2>
          <div className="relative h-48 w-full bg-gray-50 rounded-lg p-4 flex items-center justify-center overflow-hidden">
            {plant.growingStages && plant.growingStages.length > 0 ? (
              <div className="flex w-full h-full items-center">
                {plant.growingStages.map((stage, index) => {
                  const { min: stageMinDays, max: stageMaxDays } = parseDurationToDays(stage.duration);
                  const totalDays = plant.growingStages.reduce((sum, s) => {
                    const { min, max } = parseDurationToDays(s.duration);
                    return sum + max; // Use max for total length
                  }, 0);
                  const stageWidth = totalDays > 0 ? (stageMaxDays / totalDays) * 100 : 0;

                  let stageColor = 'bg-green-400';
                  if (stage.stage.toLowerCase().includes('germination')) stageColor = 'bg-yellow-400';
                  if (stage.stage.toLowerCase().includes('seedling')) stageColor = 'bg-blue-400';
                  if (stage.stage.toLowerCase().includes('fruiting') || stage.stage.toLowerCase().includes('harvest')) stageColor = 'bg-red-400';

                  return (
                    <div
                      key={index}
                      style={{ width: `${stageWidth}%` }}
                      className={`h-24 flex flex-col justify-center items-center relative group ${stageColor} rounded-md mx-0.5`}
                    >
                      <div className="absolute -top-6 text-xs text-gray-700 whitespace-nowrap">
                        {stage.stage}
                      </div>
                      <div className="absolute -bottom-6 text-xs text-gray-700 whitespace-nowrap">
                        {stage.duration}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs p-1 text-center rounded-md">
                        {Array.isArray(stage.instructions) ? stage.instructions.join(', ') : stage.instructions}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">No growing stages defined for this plant.</p>
            )}
          </div>
        </motion.section>

        {/* 4. Smart Calendar & Reminders */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Smart Calendar & Reminders
          </h2>
          <SmartCalendarReminders />
        </motion.section>

        {/* 5. Growth Tracker / Plant Journal (Placeholder) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            Growth Tracker / Plant Journal
          </h2>
          <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p>Track your plant's growth with notes, photos, and milestones.</p>
            <p className="text-sm mt-2">Monitor your plant's mood and health over time.</p>
          </div>
        </motion.section>

        {/* 6. Camera-Based Health Scanner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Camera className="w-6 h-6 mr-2 text-green-600" />
            Camera-Based Health Scanner
          </h2>
          <PlantHealthScanner />
        </motion.section>

        {/* 7. AI Assistant Tips card (Placeholder) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-green-600" />
            AI Assistant Tips
          </h2>
          <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p>Personalized AI tips for your plant based on its current stage and health.</p>
            <p className="text-sm mt-2">Receive proactive alerts and tailored advice.</p>
          </div>
        </motion.section>

        {/* 8. Related Plants / Companion Plants card (Placeholder) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            Related & Companion Plants
          </h2>
          <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p>Discover plants that grow well together or have similar needs.</p>
            <p className="text-sm mt-2">Expand your garden with suitable companions.</p>
          </div>
        </motion.section>

        {/* 9. Community Posts / Q&A / Journals related to that plant (Placeholder) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-600" />
            Community Hub
          </h2>
          <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p>See what other growers are sharing about this plant!</p>
            <p className="text-sm mt-2">Read journals, ask questions, and connect with the community.</p>
          </div>
        </motion.section>

      </div>
    </div>
  );
} 