import React from 'react';
import { Question, StudyStats, QuizSessionConfig } from '../types';
import { 
  RotateCcw, 
  Bookmark, 
  HelpCircle, 
  Play, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { toggleBookmark } from '../utils/storage';

interface ReviewListProps {
  type: 'wrong' | 'bookmark';
  allQuestions: Question[];
  stats: StudyStats;
  onUpdateStats: (newStats: StudyStats) => void;
  onStartQuiz: (config: QuizSessionConfig) => void;
  onSelectSingleQuestion: (question: Question) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  type,
  allQuestions,
  stats,
  onUpdateStats,
  onStartQuiz,
  onSelectSingleQuestion
}) => {
  const isWrong = type === 'wrong';
  const targetIds = isWrong ? (stats.wrongIds || []) : (stats.bookmarkedIds || []);
  const questions = allQuestions.filter(q => targetIds.includes(q.id));

  const handleRemove = (qId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWrong) {
      const updated = {
        ...stats,
        wrongIds: stats.wrongIds.filter(id => id !== qId)
      };
      onUpdateStats(updated);
    } else {
      toggleBookmark(qId);
      const updated = {
        ...stats,
        bookmarkedIds: stats.bookmarkedIds.filter(id => id !== qId)
      };
      onUpdateStats(updated);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {isWrong ? (
              <>
                <RotateCcw className="w-6 h-6 text-rose-600" />
                <span>나만의 오답노트</span>
              </>
            ) : (
              <>
                <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>중요 문제 즐겨찾기</span>
              </>
            )}
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ml-1 ${
              isWrong ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {questions.length}문항
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isWrong 
              ? '틀렸던 문제를 반복 연습하고 정답을 맞히면 오답노트에서 자동으로 지워집니다.'
              : '시험 직전 다시 보고 싶은 핵심 문제들을 모아 집중 복습하세요.'}
          </p>
        </div>

        {questions.length > 0 && (
          <button
            onClick={() => onStartQuiz({ mode: isWrong ? 'wrong_review' : 'bookmark_review' })}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition active:scale-95 ${
              isWrong 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>이 목록 전체 풀기 ({questions.length}제)</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto shadow-sm my-10">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
            isWrong ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {isWrong ? <CheckCircle2 className="w-8 h-8" /> : <Bookmark className="w-8 h-8" />}
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {isWrong ? '오답노트가 비어 있습니다!' : '즐겨찾기한 문제가 없습니다.'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            {isWrong 
              ? '문제를 풀다가 틀린 문제가 생기면 자동으로 이곳에 정리됩니다.'
              : '문제 풀이 중 북마크 아이콘을 누르면 이곳에 저장됩니다.'}
          </p>
          <button
            onClick={() => onStartQuiz({ mode: 'practice' })}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition"
          >
            기출문제 풀러 가기
          </button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => onSelectSingleQuestion(q)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {q.unitName}
                  </span>
                  <span className="text-xs text-slate-400">
                    기출 #{q.qNum}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    정답: {q.answerChar}
                  </span>
                  <button
                    onClick={(e) => handleRemove(q.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={isWrong ? '오답 목록에서 제거' : '즐겨찾기 해제'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed mb-3">
                {q.question}
              </h3>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                <strong className="text-slate-800 font-semibold mr-1.5">핵심 해설:</strong>
                {q.explanation}
              </div>

              <div className="mt-3 flex items-center justify-end text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>자세히 풀기</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
