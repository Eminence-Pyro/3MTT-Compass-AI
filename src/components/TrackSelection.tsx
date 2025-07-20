
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';
import { tracks } from '../data/tracks';

interface TrackSelectionProps {
  onSelectTrack: (trackId: string) => void;
}

interface TrackSelectionProps {
  onSelectTrack: (trackId: string) => void;
}

const TrackSelection: React.FC<TrackSelectionProps> = ({ onSelectTrack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Choose Your Learning Track
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select your 3MTT specialization to receive a personalized learning path 
            tailored to your goals and current skill level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card 
              key={track.id} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-green-300"
              onClick={() => onSelectTrack(track.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">{track.icon}</div>
                <CardTitle className="text-lg font-semibold text-green-700">
                  {track.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {track.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrack(track.id);
                  }}
                >
                  Start Learning Path
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What happens next?
            </h3>
            <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600">
              <div className="flex-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                Take a quick diagnostic assessment
              </div>
              <div className="flex-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                AI generates your personalized path
              </div>
              <div className="flex-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                Start learning with curated resources
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSelection;
