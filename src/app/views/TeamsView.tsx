import { useState } from 'react';
import { Users, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  memberCount: number;
  totalProfitLoss: number;
  activePlayers: number;
}

export function TeamsView() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'team1',
      name: 'High Rollers',
      memberCount: 8,
      totalProfitLoss: 15420,
      activePlayers: 5
    },
    {
      id: 'team2',
      name: 'Weekend Warriors',
      memberCount: 12,
      totalProfitLoss: -3200,
      activePlayers: 3
    },
    {
      id: 'team3',
      name: 'Professional Squad',
      memberCount: 6,
      totalProfitLoss: 28750,
      activePlayers: 4
    },
    {
      id: 'team4',
      name: 'Grinders',
      memberCount: 15,
      totalProfitLoss: 8900,
      activePlayers: 7
    }
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Teams Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create, manage, and monitor your poker teams
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div
            key={team.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <button className="text-gray-400 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {team.name}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Members</span>
                <span className="text-gray-900 font-medium">{team.memberCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Players</span>
                <span className="text-gray-900 font-medium">{team.activePlayers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total P/L</span>
                <span className={`font-medium ${team.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {team.totalProfitLoss >= 0 ? '+' : ''}${team.totalProfitLoss.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Team Card */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer">
        <Plus className="w-8 h-8 mb-2" />
        <p className="font-medium">Add New Team</p>
      </div>
    </div>
  );
}
