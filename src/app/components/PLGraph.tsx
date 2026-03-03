import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  [key: string]: number | string;
}

interface PLGraphProps {
  data: DataPoint[];
  players: Array<{ id: string; name: string; color: string }>;
  showLegend?: boolean;
  height?: number;
  compact?: boolean;
  showAxes?: boolean;
}

export function PLGraph({ 
  data, 
  players, 
  showLegend = true, 
  height = 400, 
  compact = false,
  showAxes = true 
}: PLGraphProps) {
  const strokeWidth = compact ? 1.5 : 2;
  const dotSize = compact ? 0 : 3;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={compact ? { top: 5, right: 5, left: 0, bottom: 5 } : undefined}>
        {!compact && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {showAxes && (
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: compact ? '9px' : '11px' }}
            tick={!compact}
            hide={compact}
          />
        )}
        {showAxes && (
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: compact ? '9px' : '11px' }}
            tickFormatter={(value) => compact ? `$${(value/1000).toFixed(0)}k` : `$${value.toLocaleString()}`}
            width={compact ? 35 : 60}
            hide={compact}
          />
        )}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: compact ? '6px 8px' : '8px 12px',
            color: '#111827',
            fontSize: compact ? '10px' : '12px'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']}
        />
        {showLegend && (
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
            iconType="line"
          />
        )}
        {players.map((player) => (
          <Line
            key={player.id}
            type="monotone"
            dataKey={player.id}
            name={player.name}
            stroke={player.color}
            strokeWidth={strokeWidth}
            dot={dotSize > 0 ? { r: dotSize } : false}
            activeDot={{ r: compact ? 3 : 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}