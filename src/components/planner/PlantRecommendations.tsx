import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getPlantRecommendations, PlantRecommendation } from '@/lib/ai/plantRecommender';
import PlantCard from './PlantCard';
import PlantFilters from './PlantFilters';
import type { PlannerData } from '@/types/planner';

interface PlantRecommendationsProps {
  plannerData: PlannerData | null;
  onAddToGrowPlan: (plant: PlantRecommendation) => void;
}

const PlantRecommendations: React.FC<PlantRecommendationsProps> = ({ 
  plannerData,
  onAddToGrowPlan 
}) => {
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredRecommendations, setFilteredRecommendations] = useState<PlantRecommendation[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!plannerData) {
        setError('No planner data available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPlantRecommendations(plannerData);
        setRecommendations(data);
        setFilteredRecommendations(data);
      } catch (err) {
        setError('Failed to fetch plant recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [plannerData]);

  const handleSearch = (query: string) => {
    const filtered = recommendations.filter(plant =>
      plant.name.toLowerCase().includes(query.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(query.toLowerCase()) ||
      plant.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  };

  const handleSort = (sortBy: string) => {
    const sorted = [...filteredRecommendations].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'harvest-asc':
          return a.daysToHarvest.min - b.daysToHarvest.min;
        case 'harvest-desc':
          return b.daysToHarvest.min - a.daysToHarvest.min;
        case 'difficulty-asc':
          return a.difficulty.localeCompare(b.difficulty);
        case 'difficulty-desc':
          return b.difficulty.localeCompare(a.difficulty);
        default:
          return 0;
      }
    });
    setFilteredRecommendations(sorted);
  };

  const handleFilter = (filters: string[]) => {
    if (filters.length === 0) {
      setFilteredRecommendations(recommendations);
      return;
    }

    const filtered = recommendations.filter(plant => {
      return filters.every(filter => {
        switch (filter) {
          case 'fast-growing':
            return plant.daysToHarvest.min <= 60;
          case 'beginner-friendly':
            return plant.difficulty === 'beginner';
          case 'indoor':
            return plant.spaceRequirements === 'small';
          case 'outdoor':
            return plant.spaceRequirements === 'medium' || plant.spaceRequirements === 'large';
          case 'low-maintenance':
            return plant.waterNeeds.frequency === 'low';
          default:
            return true;
        }
      });
    });
    setFilteredRecommendations(filtered);
  };

  const handleAddToCalendar = (plant: PlantRecommendation) => {
    // Implement calendar integration
    console.log('Add to calendar:', plant);
  };

  const handleLearnMore = (plant: PlantRecommendation) => {
    // Implement learn more functionality
    console.log('Learn more:', plant);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  if (filteredRecommendations.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-gray-500">No plants match your criteria. Try adjusting your filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PlantFilters
        onSearch={handleSearch}
        onSort={handleSort}
        onFilter={handleFilter}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onAddToGrowPlan={() => onAddToGrowPlan(plant)}
            onAddToCalendar={() => handleAddToCalendar(plant)}
            onLearnMore={() => handleLearnMore(plant)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlantRecommendations; 