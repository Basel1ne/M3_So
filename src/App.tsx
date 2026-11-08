import React, { useState, useEffect, useMemo } from 'react';
import rawQuestions from './data/questions.json';
import { Question, ViewMode, QuizSessionConfig, StudyStats } from './types';
import { getStudyStats } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { UnitList } from './components/UnitList';
import { QuizView } from './components/QuizView';
import { MockExamSetup } from './components/MockExamSetup';
import { ReviewList } from './components/ReviewList';
import { PdfViewer } from './components/PdfViewer';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [stats, setStats] = useState<StudyStats>(getStudyStats);
  const [activeConfig, setActiveConfig] = useState<QuizSessionConfig | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | undefined>(undefined);

  // Parse questions from JSON
  const allQuestions = useMemo<Question[]>(() => {
    return rawQuestions as Question[];
  }, []);

  // Filter or prepare questions for active quiz session
  const sessionQuestions = useMemo<Question[]>(() => {
    if (!activeConfig) return [];

    let pool = [...allQuestions];

    // Wrong review
    if (activeConfig.mode === 'wrong_review') {
      pool = pool.filter(q => stats.wrongIds.includes(q.id));
      return pool;
    }

    // Bookmark review
    if (activeConfig.mode === 'bookmark_review') {
      pool = pool.filter(q => stats.bookmarkedIds.includes(q.id));
      return pool;
    }

    // Filter by unit
    if (activeConfig.unitId) {
      pool = pool.filter(q => q.unitId === activeConfig.unitId);
    } else if (activeConfig.category && activeConfig.category !== '전체') {
      pool = pool.filter(q => q.category === activeConfig.category);
    }

    // Randomize if requested
    if (activeConfig.randomize) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    // Slice question count
    if (activeConfig.questionCount && activeConfig.questionCount > 0) {
      pool = pool.slice(0, activeConfig.questionCount);
    }

    return pool;
  }, [activeConfig, allQuestions, stats.wrongIds, stats.bookmarkedIds]);

  // Handle quiz launch
  const handleStartQuiz = (config: QuizSessionConfig) => {
    setActiveConfig(config);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle single question practice from review lists
  const handleSelectSingleQuestion = (q: Question) => {
    setActiveConfig({
      mode: 'practice',
      unitId: q.unitId,
      randomize: false
    });
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Open PDF
  const handleOpenPdf = (pdfFile: string, _title: string) => {
    setSelectedPdf(pdfFile);
    setCurrentView('pdf-viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        stats={{
          solvedCount: stats.solvedCount || 0,
          wrongCount: stats.wrongIds?.length || 0,
          bookmarkCount: stats.bookmarkedIds?.length || 0
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'home' && (
          <Dashboard
            stats={stats}
            onStartQuiz={handleStartQuiz}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'units' && (
          <UnitList
            stats={stats}
            onStartQuiz={handleStartQuiz}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentView === 'mock-exam' && (
          <MockExamSetup onStartExam={handleStartQuiz} />
        )}

        {currentView === 'wrong-notes' && (
          <ReviewList
            type="wrong"
            allQuestions={allQuestions}
            stats={stats}
            onUpdateStats={setStats}
            onStartQuiz={handleStartQuiz}
            onSelectSingleQuestion={handleSelectSingleQuestion}
          />
        )}

        {currentView === 'bookmarks' && (
          <ReviewList
            type="bookmark"
            allQuestions={allQuestions}
            stats={stats}
            onUpdateStats={setStats}
            onStartQuiz={handleStartQuiz}
            onSelectSingleQuestion={handleSelectSingleQuestion}
          />
        )}

        {currentView === 'pdf-viewer' && (
          <PdfViewer initialPdf={selectedPdf} />
        )}

        {currentView === 'quiz' && activeConfig && (
          <QuizView
            questions={sessionQuestions}
            config={activeConfig}
            stats={stats}
            onUpdateStats={setStats}
            onExit={() => setCurrentView('home')}
            onOpenPdf={handleOpenPdf}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-600 mb-1">
            중학교 3학년 사회 기출문제 학습 솔루션 · 총 14개 단원 464제 수록
          </p>
          <p>
            국내총생산 · 경제성장 · 물가상승 · 실업 · 국제거래 · 환율 · 세계/한국 인구 분포 및 이동 · 선진국/개도국 도시화 · 살기 좋은 도시
          </p>
        </div>
      </footer>
    </div>
  );
}
