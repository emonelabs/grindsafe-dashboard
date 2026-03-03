import { Video, Maximize2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  avatar: string;
  profitLoss: number;
  isRecording: boolean;
  teamId: string;
}

interface LiveVideoGridProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

// Array of actual online poker gameplay screenshots - PokerStars, GGPoker, Winamax, etc.
const pokerImages = [
  'https://pokerindustrypro.com/site_media/media/uploads/news/winamax-multiple-playgrounds-tables-playing-wm.png', // Winamax multi-table
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR96OzUaaR68qHFBKnFGT3NIKRGQO8B-hMOqA&s', // Poker table view
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlJS6AIRfSSEe3JD3XviG5w1dp3koCzHuGg&s', // Online poker gameplay
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjn_kPDtL-vZhpVcmD1tPkOXB0Z64kSJEtaw&s', // Poker table screenshot
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACjBfVJywXemsMrjqeMk9066Ogmu_Wevv4A&s', // GGPoker/PokerStars table
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzg39aGmduS7jxmsSlGTWR_pUTq8YmnyudWg&s', // Online poker screenshot
];

const VideoFeed = ({ player, onClick }: { player: Player; onClick?: () => void }) => {
  // Select image based on player ID for consistency
  const imageIndex = parseInt(player.id.replace(/\D/g, '')) % pokerImages.length;
  const pokerImage = pokerImages[imageIndex];

  return (
    <div 
      className="relative bg-gray-900 overflow-hidden cursor-pointer group aspect-video"
      onClick={onClick}
    >
      {/* Video/Image */}
      <img
        src={pokerImage}
        alt={`${player.name} playing poker`}
        className="w-full h-full object-cover"
      />
      
      {/* Dark overlay on hover for better visibility */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>

      {/* Recording Indicator */}
      {player.isRecording && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-semibold shadow-lg">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      {/* Player Info Overlay - Bottom Left */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
        <div className="flex items-center gap-2">
          <img 
            src={player.avatar} 
            alt={player.name} 
            className="w-8 h-8 rounded-full border-2 border-white/80 shadow-lg" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate drop-shadow-lg">{player.name}</p>
            <p className={`text-[11px] font-bold drop-shadow-lg ${player.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Maximize Icon */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/20 backdrop-blur-sm rounded p-1.5">
          <Maximize2 className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export function LiveVideoGrid({ players, onPlayerClick }: LiveVideoGridProps) {
  const activePlayers = players.filter(p => p.isRecording);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-gray-600" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Live Feeds</h3>
        </div>
        <span className="text-[10px] text-gray-500">{activePlayers.length} active • Scroll horizontally →</span>
      </div>
      
      {/* Horizontal Scrollable Grid - No padding, no gaps */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="flex bg-gray-900" style={{ minWidth: 'max-content' }}>
          {activePlayers.map(player => (
            <div key={player.id} className="w-80 flex-shrink-0">
              <VideoFeed 
                player={player}
                onClick={() => onPlayerClick?.(player)}
              />
            </div>
          ))}
        </div>
      </div>

      {activePlayers.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white">
          No active video feeds
        </div>
      )}
    </div>
  );
}
