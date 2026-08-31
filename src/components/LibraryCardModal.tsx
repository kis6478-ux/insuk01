import React from 'react';
import { 
  X, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { UserLibraryProfile, LoanRecord } from '../types';

interface LibraryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserLibraryProfile;
  loanRecords: LoanRecord[];
  onRenewLoan: (loanId: string) => void;
  onNavigateToChallenges: () => void;
}

export const LibraryCardModal: React.FC<LibraryCardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  loanRecords,
  onRenewLoan,
  onNavigateToChallenges,
}) => {
  if (!isOpen) return null;

  const currentBorrowing = loanRecords.filter(r => r.status === 'borrowing');
  const totalAllowed = userProfile.baseLoanLimit + userProfile.extraBonusLoan;

  return (
    <div id="library-card-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="library-card-modal-content"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EBE5D8] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Digital Membership Card Graphic */}
        <div className="bg-gradient-to-tr from-[#1A3C20] via-[#244E2C] to-[#1A3C20] text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#5DA166]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#5DA166]/30 text-[#FAF7F0] flex items-center justify-center border border-[#5DA166]/40">
                <CreditCard className="w-4 h-4 text-[#5DA166]" />
              </span>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#7EBA86] font-bold block">
                  성남시립도서관 통합회원증
                </span>
                <span className="text-xs text-[#EBE5D8]">중원도서관 주이용자</span>
              </div>
            </div>
            <button
              id="close-library-card-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="mt-6 flex items-end justify-between">
            <div>
              <span className="text-xs text-[#EBE5D8]/80 block font-mono">성명 / 회원번호</span>
              <span className="text-xl font-bold tracking-tight text-white block mt-0.5">
                {userProfile.name}
              </span>
              <span className="text-xs font-mono text-[#7EBA86] mt-1 block">
                {userProfile.memberId}
              </span>
            </div>

            {/* Loan Badge Breakdown */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5DA166]/30 border border-[#5DA166]/40 text-white text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F28D52]" />
                <span>대출 가능 {totalAllowed}권</span>
              </div>
              <p className="text-[10px] text-[#EBE5D8] mt-1">
                기본 5권 + 스낵 챌린지 혜택 +{userProfile.extraBonusLoan}권
              </p>
            </div>
          </div>

          {/* Barcode Mockup */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between bg-black/20 p-2.5 rounded-xl">
            <div className="font-mono text-xs text-[#EBE5D8]/70 tracking-widest">
              ||| | |||| || ||| |||| | ||| |||| |
            </div>
            <span className="text-[10px] text-[#7EBA86] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              스마트 게이트 인증 연동
            </span>
          </div>
        </div>

        {/* Loan Quota & Incentive Progress */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#FDFBF7]">
          {/* Incentive Notice */}
          <div className="p-3.5 rounded-2xl bg-[#FFF3EB] border border-[#FDC9A6] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] text-[#C2410C] flex items-center justify-center shrink-0 border border-[#FDC9A6]">
                <Award className="w-4 h-4 text-[#F28D52]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#C2410C] block">스낵 챌린지 인센티브 활성화됨</span>
                <span className="text-[#C2410C]/80">
                  완료한 미션: {userProfile.completedMissionsCount}개 (대출 한도 +{userProfile.extraBonusLoan}권 확장 중)
                </span>
              </div>
            </div>
            <button
              id="goto-snack-challenges-btn"
              onClick={() => {
                onClose();
                onNavigateToChallenges();
              }}
              className="text-xs font-bold text-[#C2410C] bg-white hover:bg-[#FAF7F0] px-2.5 py-1.5 rounded-lg border border-[#FDC9A6] shadow-2xs shrink-0 flex items-center gap-1"
            >
              <span>미션 보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Current Borrowed Books */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#1A3C20] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#5DA166]" />
                <span>현재 대출 중인 도서 ({currentBorrowing.length}권)</span>
              </h4>
              <span className="text-xs text-[#526053] font-mono">
                잔여 가능: {totalAllowed - currentBorrowing.length}권
              </span>
            </div>

            {currentBorrowing.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#EBE5D8] rounded-2xl text-[#526053] text-xs">
                현재 대출 중인 도서가 없습니다. 산책/탐험 모드에서 마음에 드는 책을 담아보세요!
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentBorrowing.map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-3.5 rounded-2xl border border-[#EBE5D8] bg-white hover:bg-[#FAF7F0] transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#1A3C20] block">{rec.bookTitle}</span>
                      <span className="text-[#526053] block">{rec.author} · {rec.genre}</span>
                      <div className="flex items-center gap-2 text-[11px] text-[#526053] mt-1">
                        <span className="flex items-center gap-1 text-[#5DA166] font-semibold">
                          <Clock className="w-3 h-3" />
                          반납예정: {rec.returnDueDate}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`renew-loan-${rec.id}`}
                      onClick={() => onRenewLoan(rec.id)}
                      className="px-3 py-1.5 rounded-xl border border-[#EBE5D8] bg-[#FAF7F0] hover:bg-[#EBE5D8] font-semibold text-[#1A3C20] text-[11px] transition-colors shrink-0"
                    >
                      대출 연기 (7일)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBE5D8] bg-[#FAF7F0] flex items-center justify-end">
          <button
            id="close-card-footer-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A3C20] hover:bg-[#244E2C] text-white text-xs font-bold transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
