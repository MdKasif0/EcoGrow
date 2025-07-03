import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface PlantScannerButtonProps {
  onClick?: () => void;
}

const PlantScannerButton: React.FC<PlantScannerButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
      <Camera className="mr-2 h-5 w-5" />
      Scan Plant
    </Button>
  );
};

export default PlantScannerButton; 