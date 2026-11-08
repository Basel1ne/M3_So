import React, { useState, useEffect } from 'react';
import { Question, QuizSessionConfig, StudyStats } from '../types';
import { recordQuestionResult, toggleBookmark, addTestScore } from '../utils/storage';
import confetti from 'canvas-confetti';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  RotateCcw, 
  FileText, 
  Sparkles,
  Award,
  Trophy,
  ArrowRight,
  Eye,
  Clock,
  Shuffle
} from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  config: QuizSessionConfig;
  stats: StudyStats;
  onUpdateStats: (newStats: StudyStats) => void;
  onExit: () => void;
  onOpenPdf: (pdfFile: string, title: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  config,
  stats,
  onUpdateStats,
  onExit,
  onOpenPdf
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer for test mode
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, isFinished]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm my-10">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">풀이할 문제가 없습니다</h3>
        <p className="text-sm text-slate-500 mb-6">
          해당 조건에 일치하는 문항이 없거나 오답/북마크 목록이 비어있습니다.
        </p>
        <button
          onClick={onExit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow hover:bg-indigo-700 transition"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isBookmarked = stats.bookmarkedIds?.includes(currentQ.id) || false;
  const selectedChoice = userAnswers[currentIndex];
  const isSubmitted = isAnswerSubmitted[currentIndex] || false;
  const isCorrect = selectedChoice === currentQ.answer;

  const handleSelectChoice = (choiceIndex: number) => {
    if (isSubmitted && config.mode === 'practice') return; // already answered in practice mode
    setUserAnswers(prev => ({ ...prev, [currentIndex]: choiceIndex }));

    // In practice mode, submit immediately upon selecting to give immediate feedback
    if (config.mode === 'practice' || config.mode === 'wrong_review' || config.mode === 'bookmark_review') {
      setIsAnswerSubmitted(prev => ({ ...prev, [currentIndex]: true }));
      const correct = choiceIndex === currentQ.answer;
      if (correct) {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.8 }
        });
      }
      const updated = recordQuestionResult(currentQ.id, currentQ.unitId, correct);
      onUpdateStats(updated);
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmark(currentQ.id);
    const updated = { ...stats };
    if (isBookmarked) {
      updated.bookmarkedIds = updated.bookmarkedIds.filter(id => id !== currentQ.id);
    } else {
      updated.bookmarkedIds = [...(updated.bookmarkedIds || []), currentQ.id];
    }
    onUpdateStats(updated);
  };

  const handleSubmitTest = () => {
    // Grade all
    let correctTotal = 0;
    const updatedSubmissions: Record<number, boolean> = {};

    questions.forEach((q, idx) => {
      updatedSubmissions[idx] = true;
      const ans = userAnswers[idx];
      const right = ans === q.answer;
      if (right) correctTotal++;
      recordQuestionResult(q.id, q.unitId, right);
    });

    setIsAnswerSubmitted(updatedSubmissions);
    setIsFinished(true);

    // Save test score
    const unitTitle = config.unitId 
      ? questions[0]?.unitName 
      : (config.category ? `${config.category} 모의고사` : '전범위 모의고사');
    addTestScore(unitTitle, correctTotal, questions.length);

    // Trigger celebration
    if (correctTotal / questions.length >= 0.8) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Format timer
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  // Render Finished Summary Modal / View
  if (isFinished) {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4 shadow-sm border border-amber-200/60">
            <Trophy className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            시험 결과 발표
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            수고하셨습니다! 틀린 문제는 자동으로 오답노트에 저장되었습니다.
          </p>

          <div className="inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
            <span className="text-4xl sm:text-5xl font-black text-indigo-600">{score}</span>
            <span className="text-xl font-bold text-slate-400">/ {questions.length} 문항</span>
            <span className="ml-2 text-sm font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
              {percentage}점
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-xs text-slate-500 font-semibold block mb-1">소요 시간</span>
              <span className="text-lg font-bold text-slate-800">{formatTimer(elapsedSeconds)}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs text-emerald-700 font-semibold block mb-1">맞힌 문제</span>
              <span className="text-lg font-bold text-emerald-800">{score}개</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 col-span-2 sm:col-span-1">
              <span className="text-xs text-rose-700 font-semibold block mb-1">틀린 문제</span>
              <span className="text-lg font-bold text-rose-800">{questions.length - score}개</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsFinished(false)}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow hover:bg-slate-800 transition"
            >
              전체 해설 및 오답 검토하기
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-200 hover:bg-indigo-100 transition"
            >
              학습 종료 및 홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            title="나가기"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {currentQ.category}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-1">
                {currentQ.unitName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              문제 {currentIndex + 1} / {questions.length} (기출 #{currentQ.qNum})
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {config.mode === 'test' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200/80">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          )}

          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border transition ${
              isBookmarked 
                ? 'bg-amber-50 text-amber-600 border-amber-300' 
                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
            }`}
            title="중요 문제 북마크"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onOpenPdf(currentQ.pdfFileName, currentQ.unitName)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
            title="원본 PDF 보기"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">원문 PDF</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Question Prompt */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
              Q{currentIndex + 1}
            </span>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                {currentQ.question}
              </h3>
            </div>
          </div>
        </div>

        {/* 5-Choice Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ.choices.map((choiceText, cIdx) => {
            const choiceNum = cIdx + 1;
            const isThisSelected = selectedChoice === choiceNum;
            const isThisAnswer = currentQ.answer === choiceNum;

            let buttonStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

            if (isSubmitted) {
              if (isThisAnswer) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
              } else if (isThisSelected) {
                buttonStyle = 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20';
              } else {
                buttonStyle = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
              }
            } else if (isThisSelected) {
              buttonStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-500/20';
            }

            const circledSymbols = ['①', '②', '③', '④', '⑤'];

            return (
              <button
                key={cIdx}
                onClick={() => handleSelectChoice(choiceNum)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all transform active:scale-[0.99] ${buttonStyle}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isSubmitted && isThisAnswer
                    ? 'bg-emerald-600 text-white'
                    : isSubmitted && isThisSelected
                    ? 'bg-rose-600 text-white'
                    : isThisSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-600'
                }`}>
                  {circledSymbols[cIdx]}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed flex-1 pt-0.5">
                  {choiceText}
                </span>

                {isSubmitted && isThisAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isThisSelected && !isThisAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Practice Mode / Instant Feedback & Detailed Explanation */}
        {isSubmitted && (
          <div className={`p-5 rounded-2xl border mt-6 space-y-3 transition-all animate-fadeIn ${
            isCorrect 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm sm:text-base text-emerald-800">
                      정답입니다! ({currentQ.answerChar})
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-extrabold text-sm sm:text-base text-rose-800">
                      틀렸습니다 (정답: {currentQ.answerChar})
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/60">
                기출 핵심 해설
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 문항</span>
          </button>

          {/* If test mode and not submitted, show Final Submit on last question */}
          {config.mode === 'test' && !isFinished && currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:from-emerald-700 hover:to-teal-700 transition"
            >
              모의고사 답안 제출
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                } else if (config.mode === 'test') {
                  handleSubmitTest();
                } else {
                  setIsFinished(true);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition"
            >
              <span>{currentIndex === questions.length - 1 ? '풀이 완료' : '다음 문항'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Number Quick Jump Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
          <span>문항 바로가기</span>
          <span>
            {Object.keys(userAnswers).length} / {questions.length} 문제 응독
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const hasAnswered = userAnswers[idx] !== undefined;
            const isCur = idx === currentIndex;
            const sub = isAnswerSubmitted[idx];
            const right = userAnswers[idx] === q.answer;

            let badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
            if (isCur) {
              badgeStyle = 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300';
            } else if (sub) {
              badgeStyle = right ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300';
            } else if (hasAnswered) {
              badgeStyle = 'bg-slate-800 text-white border-slate-900';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all flex items-center justify-center ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
