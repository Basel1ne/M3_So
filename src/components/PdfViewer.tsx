import React, { useState } from 'react';
import { UNITS } from '../constants/units';
import { FileText, Download, ExternalLink, ChevronRight, BookOpen } from 'lucide-react';

interface PdfViewerProps {
  initialPdf?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ initialPdf }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(
    initialPdf ? (UNITS.find(u => u.pdfFile === initialPdf)?.id || '01') : '01'
  );

  const currentUnit = UNITS.find(u => u.id === selectedUnit) || UNITS[0];
  const pdfUrl = `/assets/aistudio/${currentUnit.pdfFile}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-600" />
            <span>원문 시험지 PDF 뷰어</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            첨부된 14종의 실제 시험지 원본 문서 및 그림/도표를 고화질로 확인하세요.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>새 탭에서 전체화면 보기</span>
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Unit Selector */}
        <div className="lg:col-span-1 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
            단원 선택
          </span>
          {UNITS.map(unit => {
            const isSelected = unit.id === selectedUnit;
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <div className="truncate mr-2">
                  <div className={`text-[10px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {unit.category} · {unit.count}제
                  </div>
                  <div className="font-bold text-xs sm:text-sm truncate">
                    {unit.title}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Right PDF Embed Display */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">
                {currentUnit.category}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                {currentUnit.fullTitle}
              </h3>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              원본 교재 문서 파일
            </span>
          </div>

          <div className="flex-1 w-full bg-slate-100">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title={currentUnit.title}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
