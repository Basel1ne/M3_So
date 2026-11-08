import React from 'react';
import { UNITS, TOTAL_QUESTIONS_COUNT } from '../constants/units';
import { StudyStats, QuizSessionConfig, ViewMode } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  Bookmark, 
  TrendingUp, 
  Award, 
  Play, 
  ArrowRight,
  Flame,
  FileCheck2,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  stats: StudyStats;
  onStartQuiz: (config: QuizSessionConfig) => void;
  onNavigate: (view: ViewMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onStartQuiz, onNavigate }) => {
  const solved = stats.solvedCount || 0;
  const correct = stats.correctCount || 0;
  const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;
  const wrongCount = stats.wrongIds?.length || 0;
  const bookmarkCount = stats.bookmarkedIds?.length || 0;

  // Compute category progress
  const ecoUnits = UNITS.filter(u => u.category === '경제');
  const geoUnits = UNITS.filter(u => u.category === '지리');

  const ecoTotal = ecoUnits.reduce((acc, u) => acc + u.count, 0);
  const geoTotal = geoUnits.reduce((acc, u) => acc + u.count, 0);

  let ecoSolved = 0;
  let geoSolved = 0;
  Object.entries(stats.unitProgress || {}).forEach(([uId, prog]) => {
    const unit = UNITS.find(u => u.id === uId);
    if (unit?.category === '경제') ecoSolved += prog.solved;
    if (unit?.category === '지리') geoSolved += prog.solved;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            중학교 3학년 2학기 사회 내신 만점 대비
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            기출 464제로 끝내는 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300">
              사회(경제·지리) 완벽 마스터
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            국내총생산, 물가, 환율, 실업부터 인구 이동, 선진국·개도국 도시화까지!
            실제 학교 시험과 EBS 기출 선지 분석 및 해설을 직관적으로 학습하세요.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartQuiz({ mode: 'practice', randomize: false, category: '전체' })}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>전체 464제 바로 학습하기</span>
            </button>

            <button
              onClick={() => onNavigate('mock-exam')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>25문항 실전 모의고사</span>
            </button>

            {wrongCount > 0 && (
              <button
                onClick={() => onStartQuiz({ mode: 'wrong_review' })}
                className="px-4 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-bold text-sm flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>오답 다시 풀기 ({wrongCount})</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">풀이한 문제</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{solved}</span>
            <span className="text-xs font-semibold text-slate-400">/ {TOTAL_QUESTIONS_COUNT}제</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (solved / TOTAL_QUESTIONS_COUNT) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">정답률</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">{accuracy}%</span>
            <span className="text-xs font-semibold text-slate-400">({correct}개 맞음)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('wrong-notes')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-rose-600 transition-colors">
              오답노트
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{wrongCount}</span>
            <span className="text-xs font-semibold text-slate-400">문항 복습 대기</span>
          </div>
          <p className="text-xs text-rose-600/80 font-medium mt-3 flex items-center gap-1">
            <span>클릭하여 오답 집중 훈련</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        <div 
          onClick={() => onNavigate('bookmarks')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              중요 문제 북마크
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{bookmarkCount}</span>
            <span className="text-xs font-semibold text-slate-400">문항 보관 중</span>
          </div>
          <p className="text-xs text-amber-700/80 font-medium mt-3 flex items-center gap-1">
            <span>보관한 문제 모아보기</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </section>

      {/* Domain Quick Pick (경제 vs 지리) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">과목별 쾌속 시작</h2>
            <p className="text-xs sm:text-sm text-slate-500">원하는 영역만 골라서 바로 문제를 풀어보세요</p>
          </div>
          <button 
            onClick={() => onNavigate('units')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>14개 전 단원 목록 보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 경제 영역 카드 */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white">
                  경제 파트 (01~06단원)
                </span>
                <span className="text-xs font-bold text-indigo-700">총 {ecoTotal}문제</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                시장 경제와 국민 경제
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                국내 총생산(GDP)과 경제 성장률 계산, 물가 지수와 인플레이션 유불리 판별,
                실업의 4가지 유형(마찰적·경기적·구조적·계절적), 환율 변동과 외환 시장 메커니즘.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['GDP 부가가치', '인플레이션', '고용지표', '원화 가치', '자유무역협정'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200/60">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-indigo-100/80">
              <button
                onClick={() => onStartQuiz({ category: '경제', mode: 'practice' })}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                경제 전 단원 풀기
              </button>
              <button
                onClick={() => onStartQuiz({ category: '경제', mode: 'test', questionCount: 20 })}
                className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 transition-all"
              >
                20제 미니테스트
              </button>
            </div>
          </div>

          {/* 지리 영역 카드 */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white">
                  지리 파트 (07~14단원)
                </span>
                <span className="text-xs font-bold text-emerald-700">총 {geoTotal}문제</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                인구 분포, 인구 이동 & 살기 좋은 도시
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                세계 및 한국의 인구 분포 요인, 흡인 요인과 배출 요인, 저출산·고령 사회 대책,
                도시화 S자 곡선(초기·가속화·종착)과 쿠리치바·빌바오·순천의 친환경 도시 재생.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['이촌향도', '인구 피라미드', '초고령사회', '과도시화/슬럼', '쿠리치바/순천'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200/60">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-emerald-100/80">
              <button
                onClick={() => onStartQuiz({ category: '지리', mode: 'practice' })}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                지리 전 단원 풀기
              </button>
              <button
                onClick={() => onStartQuiz({ category: '지리', mode: 'test', questionCount: 20 })}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200 transition-all"
              >
                20제 미니테스트
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured 14 Units Preview Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">단원별 바로가기 (14개 단원)</h2>
          <span className="text-xs text-slate-500">클릭 시 해당 단원 학습으로 바로 이동</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNITS.map(unit => {
            const prog = stats.unitProgress?.[unit.id] || { solved: 0, correct: 0 };
            const pct = Math.round((prog.solved / unit.count) * 100);

            return (
              <div 
                key={unit.id}
                onClick={() => onStartQuiz({ unitId: unit.id, mode: 'practice' })}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      unit.category === '경제' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {unit.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {unit.count}문제
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {unit.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span>진도율</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    학습 시작 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
