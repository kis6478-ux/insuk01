import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Leaf, 
  Compass, 
  Footprints, 
  Trophy, 
  CloudRain, 
  Smile, 
  PenTool, 
  Target, 
  Award, 
  Library, 
  Users,
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DIAGNOSTIC_QUESTIONS } from '../data/mockData';
import { PlatformMode } from '../types';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: PlatformMode) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resultMode, setResultMode] = useState<PlatformMode | null>(null);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];

  const handleSelectOption = (weight: string) => {
    const nextAnswers = { ...answers, [currentQ.id]: weight };
    setAnswers(nextAnswers);

    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate outcome
      const walkCount = Object.values(nextAnswers).filter(w => w === 'walk').length;
      const calculatedMode: PlatformMode = walkCount >= 2 ? 'walk' : 'expedition';
      setResultMode(calculatedMode);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultMode(null);
  };

  const handleApplyMode = () => {
    if (resultMode) {
      onSelectMode(resultMode);
      onClose();
      handleReset();
    }
  };

  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'Leaf': return <Leaf {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Footprints': return <Footprints {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Compass': return <Compass {...props} className="w-5 h-5 text-indigo-600" />;
      case 'Trophy': return <Trophy {...props} className="w-5 h-5 text-amber-600" />;
      case 'CloudRain': return <CloudRain {...props} className="w-5 h-5 text-sky-600" />;
      case 'Smile': return <Smile {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles': return <Sparkles {...props} className="w-5 h-5 text-amber-500" />;
      case 'PenTool': return <PenTool {...props} className="w-5 h-5 text-indigo-600" />;
      case 'Target': return <Target {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Award': return <Award {...props} className="w-5 h-5 text-amber-600" />;
      case 'Library': return <Library {...props} className="w-5 h-5 text-indigo-600" />;
      case 'Users': return <Users {...props} className="w-5 h-5 text-indigo-600" />;
      default: return <Sparkles {...props} className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div id="diagnostic-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="diagnostic-modal-content"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1A3C20] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-[#F28D52]" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7EBA86]">
                초기 독서 성향 진단 (3문항)
              </span>
            </div>
            <button
              id="close-diagnostic-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="mt-3 text-xl font-black">
            {resultMode ? '성향 분석이 완료되었습니다!' : '나에게 꼭 맞는 중원도서관 모드는?'}
          </h2>
          <p className="text-xs text-[#EBE5D8] mt-1">
            {resultMode 
              ? '진단 결과를 확인하고 최적화된 독서 환경을 시작해 보세요.' 
              : '간단한 3가지 질문에 답변하시면 산책 모드(비독자)와 탐험 모드(애독자) 중 알맞은 모드를 추천합니다.'}
          </p>

          {!resultMode && (
            <div className="mt-4 flex items-center gap-2">
              {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
                <div 
                  key={q.id}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx <= currentStep ? 'bg-[#5DA166]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 bg-[#FDFBF7]">
          {!resultMode ? (
            <div>
              <div className="flex items-center justify-between text-xs text-[#526053] mb-2">
                <span>질문 {currentStep + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
                <span className="font-bold text-[#5DA166]">진행도 {Math.round(((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100)}%</span>
              </div>

              <h3 className="text-lg font-bold text-[#1A3C20] leading-snug">
                {currentQ.question}
              </h3>
              <p className="text-xs text-[#526053] mt-1 mb-5">
                {currentQ.subtitle}
              </p>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    id={`diagnostic-q${currentQ.id}-opt${i}`}
                    onClick={() => handleSelectOption(opt.weight)}
                    className="w-full text-left p-4 rounded-2xl border border-[#EBE5D8] bg-white hover:border-[#5DA166] hover:bg-[#FAF7F0] transition-all flex items-center gap-3.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F0] group-hover:bg-white flex items-center justify-center shrink-0 border border-[#EBE5D8] group-hover:border-[#5DA166] transition-colors">
                      {renderIcon(opt.icon)}
                    </div>
                    <span className="text-sm font-semibold text-[#1A3C20] group-hover:text-[#1A3C20] flex-1">
                      {opt.text}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#526053] group-hover:text-[#5DA166] transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="inline-flex p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-inner mb-4">
                {resultMode === 'walk' ? (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">🌱</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30">
                      비독자 맞춤형
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">🧭</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF7F0] text-[#1A3C20] border border-[#EBE5D8]">
                      애독자 맞춤형
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-[#1A3C20]">
                {resultMode === 'walk' ? '‘산책 모드 (비독자)’를 추천합니다!' : '‘탐험 모드 (애독자)’를 추천합니다!'}
              </h3>
              
              <div className="mt-3 p-4 rounded-2xl bg-white border border-[#EBE5D8] text-left text-xs text-[#2C3E2D] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1A3C20]">
                  <CheckCircle2 className="w-4 h-4 text-[#5DA166]" />
                  <span>진단 기반 추천 이유:</span>
                </div>
                {resultMode === 'walk' ? (
                  <p className="leading-relaxed text-[#526053]">
                    독서에 대한 심리적 부담을 줄이고, 그림책·시집·웹툰·짧은 에세이 등 가벼운 책부터 1:1 취향 매칭과 첫 문장 블라인드 큐레이션으로 즐겁게 시작해 보세요. 하루 10페이지 스낵 챌린지로 성남시 도서관 대출 권수 확대 혜택도 받을 수 있습니다!
                  </p>
                ) : (
                  <p className="leading-relaxed text-[#526053]">
                    이미 독서 습관이 형성되어 있거나 깊이 있는 기록과 소통을 원하시는군요! 대출 이력 연동 디지털 서재, 독서 통계 인포그래픽, 시민 큐레이터 테마 게시판, 이웃들과 함께하는 북클럽 매칭으로 풍성한 독서 생활을 즐겨보세요!
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="apply-recommended-mode-btn"
                  onClick={handleApplyMode}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 bg-[#5DA166] hover:bg-[#488250] shadow-[#5DA166]/20"
                >
                  <span>{resultMode === 'walk' ? '산책 모드로 시작하기' : '탐험 모드로 시작하기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  id="reset-diagnostic-btn"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-xl border border-[#EBE5D8] bg-white text-[#526053] hover:bg-[#FAF7F0] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 검사하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
