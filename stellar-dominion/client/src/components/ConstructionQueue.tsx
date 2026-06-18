import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Wrench, Beaker, Zap } from 'lucide-react';
import { getTimeRemaining, formatTimeRemaining, getProgressPercentage } from '@/lib/timeUtils';

export default function ConstructionQueue() {
  const { queue } = useGame();
  const [, setRefresh] = useState(0);

  // Refresh component every 100ms for smooth countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(prev => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (queue.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'building':
        return <Wrench className="w-4 h-4" />;
      case 'research':
        return <Beaker className="w-4 h-4" />;
      case 'unit':
        return <Zap className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'building':
        return 'bg-orange-50 border-orange-200';
      case 'research':
        return 'bg-purple-50 border-purple-200';
      case 'unit':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'building':
        return 'default';
      case 'research':
        return 'secondary';
      case 'unit':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-blue-600" />
          Production Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {queue.map((item, index) => {
            const timeRemaining = getTimeRemaining(item.endTime);
            const progress = getProgressPercentage(item.startTime, item.endTime);
            const isComplete = timeRemaining <= 0;

            return (
              <div
                key={`${item.id}-${index}`}
                className={`p-3 rounded border transition-all ${getTypeColor(item.type)}`}
                data-testid={`queue-item-${item.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      {item.amount && (
                        <div className="text-xs text-slate-600">
                          {item.amount} unit{item.amount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={getBadgeVariant(item.type)}>
                    {item.type === 'unit' ? `×${item.amount}` : item.type}
                  </Badge>
                </div>

                <Progress
                  value={progress}
                  className="h-2 mb-2"
                  data-testid={`progress-${item.id}`}
                />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{progress}% complete</span>
                  <span
                    className={`font-mono font-semibold ${
                      isComplete ? 'text-green-600' : 'text-slate-700'
                    }`}
                    data-testid={`time-remaining-${item.id}`}
                  >
                    {isComplete ? 'Complete!' : formatTimeRemaining(timeRemaining)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
