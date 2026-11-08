import React, { useState } from 'react';
import { UNITS } from '../constants/units';
import { StudyStats, QuizSessionConfig, ViewMode } from '../types';
import { 
  BookOpen, 
  Play, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Search, 
  Filter,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

interface UnitListProps {
  stats: StudyStats;
  onStartQuiz: (config: QuizSessionConfig) => void;
  onOpenPdf: (pdfFile: string, title: string) => void;
}

export const UnitList: React.FC<UnitListProps> = ({ stats, onStartQuiz, onOpenPdf }) => {
  const [filterCategory, setFilterCategory] = useState<'전체' | '경제' | '지리'>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUnits = UNITS.filter(u => {
    const matchCat = filterCategory === '전체' || u.category === filterCategory;
    const matchQuery = 
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.keyConcepts.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>단원별 집중 학습</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            중3 사회 14개 핵심 단원 기출 464문항을 체계적으로 마스터하세요.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-bold">
            {(['전체', '경제', '지리'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="단원명, 핵심 키워드 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredUnits.map(unit => {
          const prog = stats.unitProgress?.[unit.id] || { solved: 0, correct: 0 };
          const progressPercent = Math.min(100, Math.round((prog.solved / unit.count) * 100));
          const accuracy = prog.solved > 0 ? Math.round((prog.correct / prog.solved) * 100) : 0;

          return (
            <div 
              key={unit.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      unit.category === '경제' 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      {unit.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      총 {unit.count}문항 수록
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenPdf(unit.pdfFile, unit.title)}
                    className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-sky-50 transition-colors"
                    title="원본 문제지 PDF 열람"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-500" />
                    <span>원문 PDF</span>
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                  {unit.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {unit.description}
                </p>

                {/* Key Concepts Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {unit.keyConcepts.map((c: string) => (
                    <span key={c} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      #{c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress and Action Footer */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium">
                    진도율: <strong className="text-slate-900 font-bold">{prog.solved}</strong> / {unit.count}제 ({progressPercent}%)
                  </span>
                  {prog.solved > 0 && (
                    <span className="text-emerald-600 font-bold">
                      정답률 {accuracy}%
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartQuiz({ unitId: unit.id, mode: 'practice' })}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>순차 연습하기</span>
                  </button>

                  <button
                    onClick={() => onStartQuiz({ unitId: unit.id, mode: 'test', questionCount: Math.min(20, unit.count) })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
                    title="단원 모의고사"
                  >
                    단원 테스트
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
