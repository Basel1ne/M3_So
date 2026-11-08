import React from 'react';
import { ViewMode } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  RotateCcw, 
  Bookmark, 
  FileText,
  Flame,
  Award
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  stats: {
    solvedCount: number;
    wrongCount: number;
    bookmarkCount: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, stats }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  중3 사회 마스터
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  464제 기출
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                EBS 기출 변형 · 경제 & 지리 14개 전단원 정복
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'home'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>대시보드</span>
            </button>

            <button
              onClick={() => onNavigate('units')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'units'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>단원별 학습</span>
            </button>

            <button
              onClick={() => onNavigate('mock-exam')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'mock-exam'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>실전 모의고사</span>
            </button>

            <button
              onClick={() => onNavigate('wrong-notes')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
                currentView === 'wrong-notes'
                  ? 'bg-rose-50 text-rose-700 shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>오답노트</span>
              {stats.wrongCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-500 text-white leading-tight">
                  {stats.wrongCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('bookmarks')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'bookmarks'
                  ? 'bg-amber-50 text-amber-800 shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">즐겨찾기</span>
              {stats.bookmarkCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-white leading-tight">
                  {stats.bookmarkCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('pdf-viewer')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'pdf-viewer'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-sky-500" />
              <span className="hidden sm:inline">원문 PDF</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
