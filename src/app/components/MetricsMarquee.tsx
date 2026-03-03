import { DollarSign, Play, Activity, TrendingUp, Clock, Users, Award, Target } from 'lucide-react';

interface MetricsMarqueeProps {
  totalProfitLoss: number;
  activePlayers: number;
  totalSessions: number;
  avgProfit: number;
  teams: number;
}

export function MetricsMarquee({ totalProfitLoss, activePlayers, totalSessions, avgProfit, teams }: MetricsMarqueeProps) {
  const metrics = [
    {
      icon: DollarSign,
      label: 'TOTAL P/L',
      value: `${totalProfitLoss >= 0 ? '+' : ''}$${totalProfitLoss.toLocaleString()}`,
      positive: totalProfitLoss >= 0,
      change: '+12.5%'
    },
    {
      icon: Play,
      label: 'ACTIVE',
      value: activePlayers.toString(),
      info: `of ${totalSessions} total`
    },
    {
      icon: Activity,
      label: 'SESSIONS',
      value: totalSessions.toString(),
      info: 'live now'
    },
    {
      icon: TrendingUp,
      label: 'AVG P/L',
      value: `${avgProfit >= 0 ? '+' : ''}$${Math.round(avgProfit).toLocaleString()}`,
      positive: avgProfit >= 0,
      info: 'per session'
    },
    {
      icon: Award,
      label: 'WIN RATE',
      value: '6.2 bb/100',
      positive: true,
      info: 'avg'
    },
    {
      icon: Clock,
      label: 'UPTIME',
      value: '20h 41m',
      info: 'total today'
    },
    {
      icon: Target,
      label: 'BEST',
      value: '+$4.8K',
      positive: true,
      info: 'Alex T.'
    },
    {
      icon: Users,
      label: 'TEAMS',
      value: teams.toString(),
      info: 'active'
    }
  ];

  // Duplicate metrics for seamless loop
  const duplicatedMetrics = [...metrics, ...metrics];

  return (
    <div className="bg-gray-100 border-b border-gray-200 overflow-hidden">
      <div className="flex animate-marquee hover:pause-marquee">
        {duplicatedMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 px-6 py-3 border-r border-gray-200 whitespace-nowrap flex-shrink-0"
            >
              <Icon className="w-4 h-4 text-gray-500" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-600 tracking-wider">
                  {metric.label}
                </span>
                <span 
                  className={`text-base font-bold ${
                    metric.positive !== undefined 
                      ? metric.positive 
                        ? 'text-green-600' 
                        : 'text-red-600'
                      : 'text-gray-900'
                  }`}
                >
                  {metric.value}
                </span>
                {metric.change && (
                  <span className={`text-[10px] font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                )}
                {metric.info && (
                  <span className="text-[10px] text-gray-500">
                    {metric.info}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
