import { useState } from 'react';
import { PokerAnalytics, Hand } from './PokerAnalytics';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

export type StatType = 'fold-to-raise' | 'call-raise' | '3-bet' | 'missed-2nd' | '2nd-barrel' | '3rd-barrel' | 'check-profit';

interface FilterContext {
  statType?: StatType;
  position?: string;
}

interface Panel {
  id: string;
  title: string;
  filterContext: FilterContext;
  isCollapsed: boolean;
}

interface DrillDownAnalyticsProps {
  playerId?: string;
  playerName?: string;
  isCompanyWide?: boolean;
  defaultTab?: 'stats' | 'graph' | 'range' | 'strength';
  onHandClick?: (hand: Hand) => void;
}

export function DrillDownAnalytics({ playerId, playerName, isCompanyWide = false, defaultTab = 'stats', onHandClick }: DrillDownAnalyticsProps) {
  const [panels, setPanels] = useState<Panel[]>([
    { id: 'base', title: 'Analytics', filterContext: {}, isCollapsed: false }
  ]);

  const spawnPanel = (statType: StatType, title: string) => {
    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      title,
      filterContext: { statType },
      isCollapsed: false,
    };

    setPanels(prev => {
      const newPanels = [...prev];
      
      // If we already have 3 visible panels, collapse the oldest non-base panel
      const visiblePanels = newPanels.filter(p => !p.isCollapsed);
      if (visiblePanels.length >= 3) {
        const oldestNonBase = newPanels.find(p => p.id !== 'base' && !p.isCollapsed);
        if (oldestNonBase) {
          oldestNonBase.isCollapsed = true;
        }
      }
      
      newPanels.push(newPanel);
      return newPanels;
    });
  };

  const closePanel = (panelId: string) => {
    if (panelId === 'base') return; // Can't close base panel
    
    setPanels(prev => {
      const newPanels = prev.filter(p => p.id !== panelId);
      
      // If we have collapsed panels, restore the oldest one
      const collapsedPanels = newPanels.filter(p => p.isCollapsed && p.id !== 'base');
      if (collapsedPanels.length > 0) {
        collapsedPanels[collapsedPanels.length - 1].isCollapsed = false;
      }
      
      return newPanels;
    });
  };

  const toggleCollapse = (panelId: string) => {
    setPanels(prev => {
      const newPanels = prev.map(p => {
        if (p.id === panelId) {
          return { ...p, isCollapsed: !p.isCollapsed };
        }
        return p;
      });

      // Ensure we maintain proper layout (max 3 visible)
      const visiblePanels = newPanels.filter(p => !p.isCollapsed);
      if (visiblePanels.length > 3) {
        // Collapse oldest non-base panel
        const oldestNonBase = newPanels.find(p => p.id !== 'base' && !p.isCollapsed);
        if (oldestNonBase) {
          oldestNonBase.isCollapsed = true;
        }
      }

      return newPanels;
    });
  };

  const getLayoutClass = () => {
    const visiblePanels = panels.filter(p => !p.isCollapsed);
    const count = visiblePanels.length;
    
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  const visiblePanels = panels.filter(p => !p.isCollapsed);
  const collapsedPanels = panels.filter(p => p.isCollapsed);

  return (
    <div className="space-y-3">
      {/* Panel Container */}
      <div className="relative">
        <div 
          className={`
            grid gap-3 transition-all duration-300
            ${getLayoutClass()}
          `}
          style={{
            gridTemplateColumns: visiblePanels.length === 1 
              ? '1fr' 
              : visiblePanels.length === 2 
                ? '1fr 1fr' 
                : '1fr 1fr 1fr'
          }}
        >
          {visiblePanels.map((panel, index) => (
            <div 
              key={panel.id} 
              className="relative bg-white border border-gray-200 rounded-lg overflow-hidden"
              style={{ minHeight: '600px' }}
            >
              {/* Analytics Content */}
              <div className="overflow-auto" style={{ height: '100%' }}>
                <PokerAnalytics
                  panelId={panel.id}
                  title={panel.title}
                  filterContext={panel.filterContext}
                  onDrillDown={spawnPanel}
                  onClose={() => closePanel(panel.id)}
                  playerId={playerId}
                  playerName={playerName}
                  isCompanyWide={isCompanyWide}
                  isBasePanel={panel.id === 'base'}
                  defaultTab={defaultTab}
                  onHandClick={onHandClick}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed Panels */}
        {collapsedPanels.length > 0 && (
          <div className="absolute right-0 top-0 h-full flex flex-col gap-2 p-2 border-l border-gray-200 bg-gray-50 rounded-r-lg overflow-hidden">
            {collapsedPanels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => toggleCollapse(panel.id)}
                className="w-8 h-12 flex flex-col items-center justify-center gap-0.5 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                title={`Expand: ${panel.title}`}
              >
                <ChevronLeft className="w-3 h-3 text-gray-500" />
                <span className="text-[8px] text-gray-500 font-medium rotate-90 whitespace-nowrap max-w-[60px] overflow-hidden text-ellipsis">
                  {panel.title.split(' > ').pop()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel Indicators */}
      <div className="flex items-center justify-center gap-3 py-2 border-t border-gray-200 mt-4">
        {panels.map((panel, index) => (
          <div key={panel.id} className="flex items-center gap-1">
            {panel.isCollapsed && (
              <button
                onClick={() => toggleCollapse(panel.id)}
                className="hover:bg-gray-100 rounded p-1 transition-colors"
                title="Expand panel"
              >
                <ChevronLeft className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <span className="text-xs text-gray-600">
              <span className="font-medium">{index + 1}.</span> {panel.title}
            </span>
            {panel.id !== 'base' && !panel.isCollapsed && (
              <button
                onClick={() => closePanel(panel.id)}
                className="ml-1 hover:bg-gray-100 rounded p-0.5 transition-colors"
                title="Close panel"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: panels.filter(p => !p.isCollapsed).length * 320 }}>
          {visiblePanels.map((panel) => (
            <div 
              key={panel.id}
              className="w-[300px] flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden snap-center"
            >
              <PokerAnalytics
                panelId={panel.id}
                title={panel.title}
                filterContext={panel.filterContext}
                onDrillDown={spawnPanel}
                onClose={() => closePanel(panel.id)}
                playerId={playerId}
                playerName={playerName}
                isCompanyWide={isCompanyWide}
                isBasePanel={panel.id === 'base'}
                defaultTab={defaultTab}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
