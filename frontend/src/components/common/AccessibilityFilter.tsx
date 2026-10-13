import React, { useState } from 'react';
import { Accessibility, Volume2, Footprints, Music, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import type { AccessibilityFilter as AccessibilityFilterType, AccessibilityTag } from '../../types';

interface AccessibilityFilterProps {
  onFilterChange: (filters: AccessibilityFilterType) => void;
  matchingGuidesCount?: number;
}

interface FilterOption {
  id: AccessibilityTag;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const filterOptions: FilterOption[] = [
  {
    id: 'wheelchair-accessible',
    label: 'Wheelchair Accessible',
    description: 'Paths with ramps, elevators, and wide passages',
    icon: <Accessibility className="h-5 w-5" />,
    color: 'emerald',
  },
  {
    id: 'step-free',
    label: 'Step-Free Navigation',
    description: 'Routes without stairs or steep inclines',
    icon: <Footprints className="h-5 w-5" />,
    color: 'blue',
  },
  {
    id: 'low-sensory',
    label: 'Low-Sensory Quiet Routes',
    description: 'Avoid crowded, loud, or overwhelming areas',
    icon: <Music className="h-5 w-5" />,
    color: 'purple',
  },
  {
    id: 'audio-description',
    label: 'Audio Description Specialist',
    description: 'Detailed verbal descriptions for visually impaired',
    icon: <Volume2 className="h-5 w-5" />,
    color: 'amber',
  },
];

const getColorClasses = (color: string, isActive: boolean) => {
  const colors = {
    emerald: {
      bg: isActive ? 'bg-emerald-100' : 'bg-white',
      border: isActive ? 'border-emerald-400' : 'border-slate-200',
      text: isActive ? 'text-emerald-700' : 'text-slate-700',
      icon: isActive ? 'bg-emerald-600' : 'bg-slate-100',
      iconText: isActive ? 'text-white' : 'text-slate-600',
      hover: 'hover:border-emerald-300 hover:bg-emerald-50',
    },
    blue: {
      bg: isActive ? 'bg-blue-100' : 'bg-white',
      border: isActive ? 'border-blue-400' : 'border-slate-200',
      text: isActive ? 'text-blue-700' : 'text-slate-700',
      icon: isActive ? 'bg-blue-600' : 'bg-slate-100',
      iconText: isActive ? 'text-white' : 'text-slate-600',
      hover: 'hover:border-blue-300 hover:bg-blue-50',
    },
    purple: {
      bg: isActive ? 'bg-purple-100' : 'bg-white',
      border: isActive ? 'border-purple-400' : 'border-slate-200',
      text: isActive ? 'text-purple-700' : 'text-slate-700',
      icon: isActive ? 'bg-purple-600' : 'bg-slate-100',
      iconText: isActive ? 'text-white' : 'text-slate-600',
      hover: 'hover:border-purple-300 hover:bg-purple-50',
    },
    amber: {
      bg: isActive ? 'bg-amber-100' : 'bg-white',
      border: isActive ? 'border-amber-400' : 'border-slate-200',
      text: isActive ? 'text-amber-700' : 'text-slate-700',
      icon: isActive ? 'bg-amber-600' : 'bg-slate-100',
      iconText: isActive ? 'text-white' : 'text-slate-600',
      hover: 'hover:border-amber-300 hover:bg-amber-50',
    },
  };
  
  return colors[color as keyof typeof colors] || colors.emerald;
};

export const AccessibilityFilter: React.FC<AccessibilityFilterProps> = ({
  onFilterChange,
  matchingGuidesCount = 0,
}) => {
  const [activeFilters, setActiveFilters] = useState<AccessibilityFilterType>({
    wheelchairAccessible: false,
    stepFree: false,
    lowSensory: false,
    audioDescription: false,
  });

  const handleToggle = (filterId: AccessibilityTag) => {
    const filterMap: Record<AccessibilityTag, keyof AccessibilityFilterType> = {
      'wheelchair-accessible': 'wheelchairAccessible',
      'step-free': 'stepFree',
      'low-sensory': 'lowSensory',
      'audio-description': 'audioDescription',
    };

    const key = filterMap[filterId];
    const newFilters = {
      ...activeFilters,
      [key]: !activeFilters[key],
    };

    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAll = () => {
    const clearedFilters = {
      wheelchairAccessible: false,
      stepFree: false,
      lowSensory: false,
      audioDescription: false,
    };
    setActiveFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-slate-200/80 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Accessibility className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                Mobility & Accessibility
              </p>
              <h3 className="text-sm font-extrabold text-slate-950">
                Filter by Expertise
              </h3>
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filterOptions.map((option) => {
            const filterMap: Record<AccessibilityTag, keyof AccessibilityFilterType> = {
              'wheelchair-accessible': 'wheelchairAccessible',
              'step-free': 'stepFree',
              'low-sensory': 'lowSensory',
              'audio-description': 'audioDescription',
            };
            const isActive = activeFilters[filterMap[option.id]];
            const colors = getColorClasses(option.color, isActive);

            return (
              <button
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className={`relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${colors.border} ${colors.bg} ${colors.hover}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.icon} ${colors.iconText}`}>
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-extrabold ${colors.text}`}>
                      {option.label}
                    </p>
                    {isActive && (
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${colors.text}`} />
                    )}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Matching Guides
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-950">
                {matchingGuidesCount}
              </p>
            </div>
            
            {activeCount > 0 && (
              <div className="rounded-full bg-emerald-100 px-3 py-1.5">
                <span className="text-xs font-extrabold text-emerald-700">
                  {activeCount} {activeCount === 1 ? 'filter' : 'filters'} active
                </span>
              </div>
            )}
          </div>

          {activeCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const filterMap: Record<AccessibilityTag, keyof AccessibilityFilterType> = {
                  'wheelchair-accessible': 'wheelchairAccessible',
                  'step-free': 'stepFree',
                  'low-sensory': 'lowSensory',
                  'audio-description': 'audioDescription',
                };
                const isActive = activeFilters[filterMap[option.id]];

                if (!isActive) return null;

                return (
                  <span
                    key={option.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                  >
                    {option.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
