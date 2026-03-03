import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  [key: string]: number | string;
}

interface PLGraphProps {
  data: DataPoint[];
  players: Array<{ id: string; name: string; color: string }>;
}

export function PLGraph({ data, players }: PLGraphProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold text-white mb-4">Real-Time P/L Performance</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'P/L']}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {players.map((player) => (
            <Line
              key={player.id}
              type="monotone"
              dataKey={player.id}
              name={player.name}
              stroke={player.color}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}