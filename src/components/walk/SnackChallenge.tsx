import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  BookMarked, 
  MapPin, 
  Headphones, 
  CreditCard,
  Gift,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SnackChallenge, UserLibraryProfile } from '../../types';

interface SnackChallengeProps {
  challenges: SnackChallenge[];
  onClaimReward: (challengeId: string) => void;
  onIncrementProgress: (challengeId: string) => void;
  onAddChallenge: (newChallenge: Omit<SnackChallenge, 'id' | 'completed' | 'claimed'>) => void;
  userProfile: UserLibraryProfile;
  onOpenLibraryCard: () => void;
}

export const SnackChallengeSection: React.FC<SnackChallengeProps> = ({
  challenges,
  onClaimReward,
  onIncrementProgress,
  onAddChallenge,
  userProfile,
  onOpenLibraryCard,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<'daily' | 'weekly' | 'visit'>('daily');
  const [newTarget, setNewTarget] = useState(10);
  const [newUnit, setNewUnit] = useState('페이지');

  const handleClaim = (id: string) => {
    onClaimReward(id);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddChallenge({
      title: newTitle,
      subtitle: newSubtitle || '나만의 맞춤 독서 습관 만들기',
      category: newCategory,
      target: Number(newTarget) || 1,
      current: 0,
      unit: newUnit || '회',
      rewardText: '성남시 도서관 독서온도 5도 상승 & 배지 획득',
      incentiveType: 'loan_expansion',
      loanBonus: 1,
      iconName: 'Sparkles',
    });

    setNewTitle('');
    setNewSubtitle('');
    setShowAddModal(false);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'BookMarked': return <BookMarked className="w-5 h-5 text-emerald-600" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-amber-600" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-indigo-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div id="snack-challenge-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
            <Award className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>비독자를 위한 스낵 챌린지 시스템</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            소소한 미션 달성하고 <span className="text-[#5DA166]">도서관 대출 권수 확대 혜택</span> 받기
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            부담 없는 하루 10페이지 읽기, 도서관 방문 등의 미션을 완수하면 성남시 통합회원증 대출 한도가 늘어납니다!
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="open-add-challenge-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EFE6] text-[#1A3C20] border border-[#EBE5D8] text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#5DA166]" />
            <span>나만의 미션 등록</span>
          </button>

          <button
            id="view-library-card-from-challenge-btn"
            onClick={onOpenLibraryCard}
            className="px-4 py-2.5 rounded-xl bg-[#1A3C20] hover:bg-[#122A16] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>혜택 회원증 확인 ({userProfile.baseLoanLimit + userProfile.extraBonusLoan}권)</span>
          </button>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((ch) => {
          const progressPercent = Math.min(100, Math.round((ch.current / ch.target) * 100));

          return (
            <div
              key={ch.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                ch.completed 
                  ? 'bg-[#FAF7F0] border-[#5DA166]/40 shadow-2xs' 
                  : 'bg-[#FDFBF7] border-[#EBE5D8] hover:border-[#5DA166]/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[#EBE5D8]">
                      {renderIcon(ch.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#F3EFE6] text-[#526053] uppercase">
                          {ch.category === 'daily' ? '일일 미션' : ch.category === 'weekly' ? '주간 미션' : '방문 인증'}
                        </span>
                        {ch.completed && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#EAF5EC] text-[#1A3C20] flex items-center gap-0.5 border border-[#5DA166]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#5DA166]" />
                            달성 완료
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#1A3C20] mt-1">
                        {ch.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#526053] mt-1">
                  {ch.subtitle}
                </p>

                {/* Reward Callout */}
                <div className="mt-3 p-3 rounded-xl bg-[#FFF3EB] border border-[#FDC9A6] text-xs text-[#C2410C] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#F28D52] shrink-0" />
                  <span className="font-semibold leading-tight"><strong>인센티브:</strong> {ch.rewardText}</span>
                </div>
              </div>

              {/* Progress Bar & Interactive Action */}
              <div className="mt-4 pt-3 border-t border-[#EBE5D8]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#526053] font-medium">
                    진행도 ({ch.current} / {ch.target} {ch.unit})
                  </span>
                  <span className="font-bold text-[#2E7D32] font-mono">
                    {progressPercent}%
                  </span>
                </div>

                <div className="h-2.5 w-full bg-[#E2D9C8] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#5DA166] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  {!ch.completed ? (
                    <button
                      id={`progress-btn-${ch.id}`}
                      onClick={() => onIncrementProgress(ch.id)}
                      className="w-full py-2.5 rounded-xl bg-[#1A3C20] hover:bg-[#122A16] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>+1 {ch.unit} 실천 인증하기</span>
                    </button>
                  ) : ch.claimed ? (
                    <div className="w-full py-2.5 rounded-xl bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#5DA166]" />
                      <span>대출 한도 인센티브 수령 완료</span>
                    </div>
                  ) : (
                    <button
                      id={`claim-reward-btn-${ch.id}`}
                      onClick={() => handleClaim(ch.id)}
                      className="w-full py-2.5 rounded-xl bg-[#F28D52] hover:bg-[#D95B16] text-white text-xs font-black shadow-md shadow-[#F28D52]/25 transition-all flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>🎉 인센티브 혜택 수령하기 (+대출 권수 확대)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Challenge Modal */}
      {showAddModal && (
        <div id="add-challenge-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>나만의 스낵 챌린지 미션 등록</span>
              </h4>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">미션 제목</label>
                <input
                  id="custom-mission-title-input"
                  type="text"
                  placeholder="예: 자기 전 시 한 편 소리 내어 읽기"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">상세 설명</label>
                <input
                  id="custom-mission-subtitle-input"
                  type="text"
                  placeholder="예: 마음이 차분해지는 3분 필사 습관"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">미션 주기</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-white"
                  >
                    <option value="daily">일일 미션</option>
                    <option value="weekly">주간 미션</option>
                    <option value="visit">도서관 방문</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">목표 수치</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="w-20 p-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                      required
                    />
                    <input
                      type="text"
                      placeholder="단위 (쪽/회)"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
