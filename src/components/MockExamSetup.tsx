import React, { useState } from 'react';
import { UNITS } from '../constants/units';
import { QuizSessionConfig } from '../types';
import { Flame, Clock, Award, Shuffle, Play, CheckCircle } from 'lucide-react';

interface MockExamSetupProps {
  onStartExam: (config: QuizSessionConfig) => void;
}

export const MockExamSetup: React.FC<MockExamSetupProps> = ({ onStartExam }) => {
  const [selectedScope, setSelectedScope] = useState<'전체' | '경제' | '지리'>('전체');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [randomize, setRandomize] = useState<boolean>(true);

  const presets = [
    {
      title: '학교 중간·기말고사 표준형',
      desc: '실제 중3 사회 시험과 동일한 25문항 실전 배점 및 시간 측정',
      count: 25,
      time: '35분 추천',
      scope: '전체' as const
    },
    {
      title: '경제 파트 집중 실전 20제',
      desc: '국내총생산, 물가, 환율, 실업 킬러 문항 집중 공략',
      count: 20,
      time: '25분 추천',
      scope: '경제' as const
    },
    {
      title: '지리 파트 집중 실전 20제',
      desc: '인구 분포, 인구 이동, 선진국·개도국 도시화 핵심 대비',
      count: 20,
      time: '25분 추천',
      scope: '지리' as const
    },
    {
      title: '미니 쾌속 점검 10제',
      desc: '등하굣길이나 자투리 시간에 빠르게 실력을 점검하는 약식 테스트',
      count: 10,
      time: '12분 추천',
      scope: '전체' as const
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3 shadow-sm border border-amber-200/80">
          <Flame className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          실전 모의고사 설정
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          시험 시간 측정과 자동 채점, 오답 분석으로 실전 감각을 극대화하세요.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {presets.map((preset, idx) => (
          <div
            key={idx}
            onClick={() => onStartExam({
              category: preset.scope,
              questionCount: preset.count,
              mode: 'test',
              randomize: true
            })}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {preset.scope} 영역
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {preset.time}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                {preset.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {preset.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                총 {preset.count}문항
              </span>
              <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition">
                <Play className="w-3 h-3 fill-white" />
                <span>시험 시작</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Setup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>사용자 정의 모의고사 설정</span>
        </h2>

        {/* Scope selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            출제 범위
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['전체', '경제', '지리'] as const).map(scope => (
              <button
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  selectedScope === scope
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {scope === '전체' ? '전체 (14단원 통합)' : scope === '경제' ? '경제 파트 (01~06)' : '지리 파트 (07~14)'}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            문항 수
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[10, 20, 25, 30].map(cnt => (
              <button
                key={cnt}
                onClick={() => setQuestionCount(cnt)}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                  questionCount === cnt
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cnt}문항
              </button>
            ))}
          </div>
        </div>

        {/* Randomize Option */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <Shuffle className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block">문항 무작위 셔플</span>
              <span className="text-xs text-slate-500">실제 시험처럼 단원 구분 없이 골고루 무작위 출제</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={randomize}
            onChange={e => setRandomize(e.target.checked)}
            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => onStartExam({
            category: selectedScope,
            questionCount,
            mode: 'test',
            randomize
          })}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
        >
          <Flame className="w-5 h-5 text-amber-300" />
          <span>설정된 맞춤 모의고사 시작하기</span>
        </button>
      </div>
    </div>
  );
};
