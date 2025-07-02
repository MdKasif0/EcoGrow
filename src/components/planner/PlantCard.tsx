import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, Droplet, Calendar, BookOpen, Sprout } from 'lucide-react';
import type { PlantRecommendation } from '@/lib/ai/plantRecommender';

interface PlantCardProps {
  plant: PlantRecommendation;
  onAddToGrowPlan: (plant: PlantRecommendation) => void;
  onAddToCalendar: (plant: PlantRecommendation) => void;
  onLearnMore: (plant: PlantRecommendation) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onAddToGrowPlan,
  onAddToCalendar,
  onLearnMore,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={plant.imageUrl || ''}
            alt={plant.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {plant.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{plant.name}</span>
            <span className="text-sm text-gray-500">{plant.scientificName}</span>
          </CardTitle>
          <CardDescription>{plant.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Growing Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Planting Time</p>
                <p className="text-sm text-gray-600">
                  {plant.idealPlantingTime.start} - {plant.idealPlantingTime.end}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Days to Harvest</p>
                <p className="text-sm text-gray-600">
                  {plant.daysToHarvest.min}-{plant.daysToHarvest.max} days
                </p>
              </div>
            </div>

            {/* Care Requirements */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{plant.lightRequirements}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{plant.waterNeeds.frequency}</span>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <Badge variant={plant.difficulty === 'beginner' ? 'default' : 'secondary'}>
                {plant.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAddToGrowPlan(plant)}
          >
            <Sprout className="w-4 h-4 mr-2" />
            Add to Grow Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAddToCalendar(plant)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onLearnMore(plant)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PlantCard; 