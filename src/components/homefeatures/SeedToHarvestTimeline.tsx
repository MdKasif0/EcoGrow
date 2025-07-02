import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SeedToHarvestTimeline() {
  return (
    <Card className="rounded-2xl h-full flex flex-col group hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-br from-primary/10 via-transparent to-transparent">
      <CardHeader>
        <CardTitle className="font-serif">Seed-to-Harvest Timeline Visualization</CardTitle>
        <CardDescription>
          Track your plant&apos;s journey from seed to harvest with interactive timelines
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Interactive bars showing each plant&apos;s progress and milestones from seed to harvest.
          </p>
          
          {/* Timeline Preview */}
          <div className="relative h-24 bg-muted/20 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {/* Example timeline stages */}
              <div className="w-full h-8 flex items-center px-2">
                <div className="h-6 bg-green-500 rounded-md flex-1 mx-1 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">Seedling</span>
                </div>
                <div className="h-6 bg-yellow-500 rounded-md flex-1 mx-1 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">Vegetative</span>
                </div>
                <div className="h-6 bg-blue-500 rounded-md flex-1 mx-1 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">Flowering</span>
                </div>
                <div className="h-6 bg-purple-500 rounded-md flex-1 mx-1 relative">
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-white">Harvest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/timeline" className="w-full">
          <Button className="w-full group-hover:translate-x-1 transition-transform">
            View Timeline
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
