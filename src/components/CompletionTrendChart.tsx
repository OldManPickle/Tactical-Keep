import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Task, QuadrantType } from '../types';

interface CompletionTrendChartProps {
  tasks: Task[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CompletionTrendChart({
  tasks,
  isCollapsed,
  onToggleCollapse,
}: CompletionTrendChartProps) {
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | 'all'>('all');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute 7 days up to today (local time)
  const last7Days = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
      const dayFull = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      list.push({ dateStr, dayLabel, dayFull });
    }
    return list;
  }, []);

  // Compute completions per day
  const chartData = useMemo(() => {
    return last7Days.map((day) => {
      // Filter tasks completed on this specific day
      const completedOnDay = tasks.filter((t) => {
        if (!t.completed) return false;
        
        // Filter by quadrant if selected
        if (selectedQuadrant !== 'all' && t.quadrant !== selectedQuadrant) {
          return false;
        }

        if (t.completedAt) {
          const completedDate = new Date(t.completedAt);
          const cYear = completedDate.getFullYear();
          const cMonth = String(completedDate.getMonth() + 1).padStart(2, '0');
          const cDay = String(completedDate.getDate()).padStart(2, '0');
          const cDateStr = `${cYear}-${cMonth}-${cDay}`;
          return cDateStr === day.dateStr;
        } else {
          // Fallback if completedAt is missing:
          return day.dateStr === new Date().toISOString().split('T')[0];
        }
      });

      // Breakdowns for the tooltip
      const urgentImportant = completedOnDay.filter((t) => t.quadrant === 'urgent-important').length;
      const importantNotUrgent = completedOnDay.filter((t) => t.quadrant === 'important-not-urgent').length;
      const urgentNotImportant = completedOnDay.filter((t) => t.quadrant === 'urgent-not-important').length;
      const notUrgentNotImportant = completedOnDay.filter((t) => t.quadrant === 'not-urgent-not-important').length;

      return {
        name: day.dayLabel,
        fullDate: day.dayFull,
        completions: completedOnDay.length,
        'Do First': urgentImportant,
        'Schedule': importantNotUrgent,
        'Delegate': urgentNotImportant,
        'Eliminate': notUrgentNotImportant,
      };
    });
  }, [tasks, last7Days, selectedQuadrant]);

  // High-value metrics
  const stats = useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.completions, 0);
    const average = +(total / 7).toFixed(1);
    const peak = Math.max(...chartData.map((item) => item.completions), 0);
    const peakDayItem = chartData.find((item) => item.completions === peak);
    const peakDay = peakDayItem && peak > 0 ? `${peakDayItem.name} (${peakDayItem.fullDate})` : 'N/A';

    return { total, average, peak, peakDay };
  }, [chartData]);

  // Color mappings matching the main visual elements of the site
  const quadrantColors: Record<QuadrantType, { bg: string; text: string; dot: string }> = {
    'urgent-important': {
      bg: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      dot: '#ef4444',
    },
    'important-not-urgent': {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: '#10b981',
    },
    'urgent-not-important': {
      bg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      dot: '#3b82f6',
    },
    'not-urgent-not-important': {
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      dot: '#f59e0b',
    },
  };

  const activeColor = selectedQuadrant === 'all' ? '#6366f1' : quadrantColors[selectedQuadrant].dot;

  // Custom SVG coordinates calculations (Width: 540, Height: 220)
  const points = useMemo(() => {
    const maxVal = Math.max(...chartData.map((item) => item.completions), 3);
    return chartData.map((item, idx) => {
      const x = 30 + idx * 81.67;
      const y = 195 - (item.completions / maxVal) * 180;
      return { x, y, data: item };
    });
  }, [chartData]);

  const yTicks = useMemo(() => {
    const maxVal = Math.max(...chartData.map((item) => item.completions), 3);
    return [
      { y: 195, value: 0 },
      { y: 135, value: Math.round(maxVal / 3) },
      { y: 75, value: Math.round((2 * maxVal) / 3) },
      { y: 15, value: maxVal },
    ];
  }, [chartData]);

  const linePathD = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, idx) => 
      idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
  }, [points]);

  return (
    <div id="completion_trend_section" className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-850 p-6 shadow-sm border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-all duration-200">
      
      {/* Container Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? "Expand 7-Day Completion Velocity" : "Collapse 7-Day Completion Velocity"}
            id="toggle_velocity_collapse"
          >
            {isCollapsed ? (
              <Icons.ChevronRight className="h-5 w-5" />
            ) : (
              <Icons.ChevronDown className="h-5 w-5" />
            )}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Icons.TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                7-Day Completion Velocity
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Velocity metrics tracking completed tasks across your daily prioritization zones.
              </p>
            </div>
          </div>
        </div>

        {/* Quadrant filter tabs */}
        {!isCollapsed && (
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg self-start">
            <button
              type="button"
              onClick={() => {
                setSelectedQuadrant('all');
                setHoveredIdx(null);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                selectedQuadrant === 'all'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              All Zones
            </button>
            {[
              { id: 'urgent-important', label: 'Do First', color: 'bg-red-500' },
              { id: 'important-not-urgent', label: 'Schedule', color: 'bg-emerald-500' },
              { id: 'urgent-not-important', label: 'Delegate', color: 'bg-blue-500' },
              { id: 'not-urgent-not-important', label: 'Eliminate', color: 'bg-amber-500' },
            ].map((tab) => {
              const isSelected = selectedQuadrant === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedQuadrant(tab.id as QuadrantType);
                    setHoveredIdx(null);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-xs'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tab.color}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid structure for statistics boxes + actual interactive line chart */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Statistics Panels */}
          <div className="lg:col-span-1 flex flex-col gap-3 justify-center">
            {/* Total Box */}
            <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total Done</span>
                <Icons.CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{stats.total}</span>
                <span className="text-[10px] text-neutral-400">tasks completed</span>
              </div>
            </div>

            {/* Average Box */}
            <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Daily Average</span>
                <Icons.Activity className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{stats.average}</span>
                <span className="text-[10px] text-neutral-400">tasks/day</span>
              </div>
            </div>

            {/* Peak Box */}
            <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Peak Velocity</span>
                <Icons.Flame className="h-4 w-4 text-red-500" />
              </div>
              <div className="mt-1.5">
                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{stats.peak}</span>
                <p className="text-[10px] text-neutral-400 mt-1 truncate">
                  Best day: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{stats.peakDay}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Pure Custom Native SVG Line Chart Container */}
          <div className="lg:col-span-3 min-h-[220px] w-full bg-neutral-50/20 dark:bg-neutral-950/10 rounded-xl p-4 border border-neutral-100/50 dark:border-neutral-850 flex flex-col justify-between relative">
            <div className="h-[210px] w-full relative">
              <svg
                viewBox="0 0 540 220"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeColor} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={activeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Y-Axis Guideline Ticks */}
                {yTicks.map((tick, i) => (
                  <g key={i} className="opacity-60 dark:opacity-30">
                    <line
                      x1={30}
                      y1={tick.y}
                      x2={520}
                      y2={tick.y}
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeDasharray={i === 0 ? undefined : "3 3"}
                      className="text-neutral-200 dark:text-neutral-800"
                    />
                    <text
                      x={20}
                      y={tick.y + 3.5}
                      textAnchor="end"
                      className="fill-neutral-400 dark:fill-neutral-500 text-[10px] font-mono font-bold select-none"
                    >
                      {tick.value}
                    </text>
                  </g>
                ))}

                {/* X-Axis labels */}
                {points.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={212}
                    textAnchor="middle"
                    className="fill-neutral-450 dark:fill-neutral-400 text-[10px] font-sans font-extrabold select-none"
                  >
                    {p.data.name}
                  </text>
                ))}

                {/* Area under line graph */}
                {points.length > 0 && (
                  <path
                    d={`${linePathD} L ${points[points.length - 1].x} 195 L ${points[0].x} 195 Z`}
                    fill="url(#areaGradient)"
                    className="transition-all duration-300"
                  />
                )}

                {/* Main Curve StrokeLine */}
                {points.length > 0 && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Interactive coordinate anchors dots */}
                {points.map((p, i) => {
                  const isHovered = hoveredIdx === i;
                  return (
                    <g key={i}>
                      {isHovered && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={8}
                          fill={activeColor}
                          opacity={0.16}
                          className="transition-all duration-150"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 5 : 3.5}
                        fill={isHovered ? activeColor : '#ffffff'}
                        stroke={activeColor}
                        strokeWidth={2.5}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* Invisible column rects for ergonomic hit testing hover targets */}
                {points.map((p, i) => {
                  const rectWidth = 490 / 7;
                  const x = p.x - rectWidth / 2;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={10}
                      width={rectWidth}
                      height={185}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  );
                })}
              </svg>

              {/* Dynamic Coordinate Hover Details Tooltip Overlay (Pure fluid percentage calculations) */}
              {hoveredIdx !== null && (
                <div
                  style={{
                    left: `${((points[hoveredIdx].x) / 540) * 100}%`,
                    top: `${((points[hoveredIdx].y - 8) / 220) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full mb-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-xl text-xs min-w-[160px] pointer-events-none transition-all duration-75 z-20"
                >
                  <div className="mb-2 pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
                    <p className="font-extrabold text-neutral-950 dark:text-neutral-50">{points[hoveredIdx].data.fullDate}</p>
                    <span className="text-[10px] text-neutral-450 dark:text-neutral-400 font-bold uppercase">{points[hoveredIdx].data.name} Analytics</span>
                  </div>
                  <div className="space-y-1.5 font-semibold">
                    <div className="flex items-center justify-between gap-4 text-neutral-750 dark:text-neutral-300">
                      <span>Total Completed:</span>
                      <span className="font-black text-neutral-950 dark:text-white">{points[hoveredIdx].data.completions}</span>
                    </div>

                    {points[hoveredIdx].data.completions > 0 && (
                      <div className="pt-1.5 mt-1 border-t border-neutral-100 dark:border-neutral-800/45 space-y-1">
                        {points[hoveredIdx].data['Do First'] > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-red-500">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Do First:
                            </span>
                            <span>{points[hoveredIdx].data['Do First']}</span>
                          </div>
                        )}
                        {points[hoveredIdx].data['Schedule'] > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-emerald-500">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Schedule:
                            </span>
                            <span>{points[hoveredIdx].data['Schedule']}</span>
                          </div>
                        )}
                        {points[hoveredIdx].data['Delegate'] > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-blue-500">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Delegate:
                            </span>
                            <span>{points[hoveredIdx].data['Delegate']}</span>
                          </div>
                        )}
                        {points[hoveredIdx].data['Eliminate'] > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-amber-500">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Eliminate:
                            </span>
                            <span>{points[hoveredIdx].data['Eliminate']}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 font-bold mt-2">
              <Icons.Info className="h-3 w-3" />
              <span>Hover anywhere on the chart coordinates to inspect quadrant breakdowns</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
