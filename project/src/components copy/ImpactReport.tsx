import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Heart, Leaf, Globe2, CalendarDays, Filter, MapPin, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';


const initialStats = {
  co2: 156,
  families: 28,
  meals: 324,
  score: 95,
  energy: 1200,
};

const regions = ['All', 'North', 'South', 'East', 'West'];
const categories = ['All', 'Food', 'Energy', 'CO₂'];
const timeRanges = ['Today', 'Week', 'Month', 'Year'];


type AnimatedCounterProps = {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  decimals?: number;
};
const AnimatedCounter = ({ value, label, icon, color, suffix = '', decimals = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let increment = end / 60;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(decimals)));
      }
    }, 18);
    return () => clearInterval(timer);
  }, [value, decimals]);
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-8 border flex items-center space-x-6 hover:shadow-lg transition-shadow duration-300 group`}
      whileHover={{ scale: 1.04 }}
    >
      <motion.div className={`p-4 rounded-full bg-${color}-100`} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        {icon}
      </motion.div>
      <div>
        <div className="text-3xl font-extrabold text-gray-900 mb-2">
          {count}
          {suffix}
        </div>
        <div className={`text-lg font-semibold text-${color}-700`}>{label}</div>
      </div>
    </motion.div>
  );
};

type ProgressCircleProps = {
  percent: number;
  color: string;
  label: string;
  icon: React.ReactNode;
};
const ProgressCircle = ({ percent, color, label, icon }: ProgressCircleProps) => {
  const radius = 38;
  const stroke = 8;
  const normalized = Math.min(Math.max(percent, 0), 100);
  const dash = 2 * Math.PI * radius;
  return (
    <motion.div className="flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <svg width={90} height={90} className="mb-2">
        <circle cx={45} cy={45} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={45}
          cy={45}
          r={radius}
          stroke={`#059669`}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={dash * (1 - normalized / 100)}
          initial={{ strokeDashoffset: dash }}
          animate={{ strokeDashoffset: dash * (1 - normalized / 100) }}
          transition={{ duration: 1.2 }}
        />
      </svg>
      <div className="flex items-center space-x-2">
        {icon}
        <span className={`text-xl font-bold text-${color}-700`}>{label}</span>
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{percent}%</div>
    </motion.div>
  );
};

const ImpactReport: React.FC = () => {
  const [region, setRegion] = useState('All');
  const [category, setCategory] = useState('All');
  const [time, setTime] = useState('Month');
  // Simulate filtered stats
  const stats = initialStats;
  return (
    <div className="max-w-5xl mx-auto py-12">
      <motion.h1 className="text-4xl font-extrabold mb-8 text-emerald-700 flex items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <BarChart2 className="w-8 h-8 text-orange-500" />
        Environmental Insights Dashboard
      </motion.h1>
      {/* Filters */}
      <motion.div className="flex flex-wrap gap-4 mb-10 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-700">Time:</span>
          <select value={time} onChange={e => setTime(e.target.value)} className="border rounded px-2 py-1">
            {timeRanges.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-700">Region:</span>
          <select value={region} onChange={e => setRegion(e.target.value)} className="border rounded px-2 py-1">
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-700">Category:</span>
          <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-2 py-1">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>
      {/* Animated Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AnimatedCounter value={stats.co2} label="CO₂ Saved" icon={<Leaf className="w-10 h-10 text-emerald-600" />} color="emerald" suffix=" kg" />
        <AnimatedCounter value={stats.families} label="Families Helped" icon={<Users className="w-10 h-10 text-orange-500" />} color="orange" />
        <AnimatedCounter value={stats.meals} label="Meals Provided" icon={<Heart className="w-10 h-10 text-emerald-600" />} color="emerald" />
        <AnimatedCounter value={stats.energy} label="Energy Saved" icon={<TrendingUp className="w-10 h-10 text-orange-500" />} color="orange" suffix=" kWh" />
      </motion.div>
      {/* Progress Circles */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ProgressCircle percent={stats.score} color="emerald" label="Impact Score" icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} />
        <ProgressCircle percent={Math.min(stats.co2 / 200 * 100, 100)} color="orange" label="CO₂ Target" icon={<Leaf className="w-6 h-6 text-orange-500" />} />
        <ProgressCircle percent={Math.min(stats.energy / 2000 * 100, 100)} color="emerald" label="Energy Target" icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} />
      </motion.div>
      {/* Live Updates & Map */}
      <motion.div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-800 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="mb-2 flex items-center gap-2"><strong>Live Updates:</strong> <BarChart2 className="w-5 h-5 text-orange-500" /> These numbers are updated in real time as donations are made and requests are fulfilled. Thank you for making a difference!</p>
        <p className="text-sm text-gray-600">Explore by time, region, and category to see your sustainability impact grow.</p>
      </motion.div>
    </div>
  );
};

export default ImpactReport;
