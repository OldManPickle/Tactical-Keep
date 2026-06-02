import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
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
          // Fallback if completedAt is missing for some reason but task is marked completed:
          // Check if completion was logged today or verify scheduledDate
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
  const quadrantColors: Record<QuadrantType, { border: string; bg: string; text: string; dot: string }> = {
    'urgent-important': {
      border: 'border-red-200 dark:border-red-900/40',
      bg: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      dot: '#ef4444',
    },
    'important-not-urgent': {
      border: 'border-emerald-200 dark:border-emerald-900/40',
      bg: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: '#10b981',
    },
    'urgent-not-important': {
      border: 'border-blue-200 dark:border-blue-900/40',
      bg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      dot: '#3b82f6',
    },
    'not-urgent-not-important': {
      border: 'border-amber-200 dark:border-amber-900/40',
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      dot: '#f59e0b',
    },
  };

  const activeColor = selectedQuadrant === 'all' ? '#171717' : quadrantColors[selectedQuadrant].dot;

  return (
    <div id="completion_trend_section" className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-850 p-6 shadow-sm border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-all duration-200">
      
      {/* Container Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
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
            onClick={() => setSelectedQuadrant('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
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
                onClick={() => setSelectedQuadrant(tab.id as QuadrantType)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all ${
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

        {/* Recharts Line Chart Container */}
        <div className="lg:col-span-3 min-h-[220px] w-full bg-neutral-50/20 dark:bg-neutral-950/10 rounded-xl p-4 border border-neutral-100/50 dark:border-neutral-850 flex flex-col justify-between">
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e5e5"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  fontWeight={600}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={20}
                  dx={0}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#c0c0c0', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke={activeColor}
                  strokeWidth={2.5}
                  dot={{ r: 5, stroke: activeColor, strokeWidth: 2, fill: '#ffffff' }}
                  activeDot={{ r: 7, stroke: activeColor, strokeWidth: 2, fill: activeColor }}
                  animationDuration={850}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 font-bold mt-2">
            <Icons.Info className="h-3 w-3" />
            <span>Hover over any plot coordinate to drill down on quadrant details</span>
          </div>
        </div>

      </div>
      )}

    </div>
  );
}

// Beautiful customizable Keep-styled tooltip details breakdown
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const totalCount = data.completions;
    return (
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-lg text-xs min-w-[150px]">
        <div className="mb-2 pb-1 border-b border-neutral-100 dark:border-neutral-800/80">
          <p className="font-extrabold text-neutral-950 dark:text-neutral-50">{data.fullDate}</p>
          <span className="text-[10px] text-neutral-400 font-bold uppercase">{label} Stats</span>
        </div>
        <div className="space-y-1.5 font-semibold">
          <div className="flex items-center justify-between gap-4 text-neutral-700 dark:text-neutral-300">
            <span>Total Completed:</span>
            <span className="font-black text-neutral-900 dark:text-white">{totalCount}</span>
          </div>

          {totalCount > 0 && (
            <div className="pt-1.5 mt-1 border-t border-neutral-100 dark:border-neutral-800/40 space-y-1">
              {data['Do First'] > 0 && (
                <div className="flex items-center justify-between text-[11px] text-red-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Do First:
                  </span>
                  <span>{data['Do First']}</span>
                </div>
              )}
              {data['Schedule'] > 0 && (
                <div className="flex items-center justify-between text-[11px] text-emerald-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Schedule:
                  </span>
                  <span>{data['Schedule']}</span>
                </div>
              )}
              {data['Delegate'] > 0 && (
                <div className="flex items-center justify-between text-[11px] text-blue-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Delegate:
                  </span>
                  <span>{data['Delegate']}</span>
                </div>
              )}
              {data['Eliminate'] > 0 && (
                <div className="flex items-center justify-between text-[11px] text-amber-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Eliminate:
                  </span>
                  <span>{data['Eliminate']}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
