import React from 'react';
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  CreditCard, 
  Sun, 
  Moon, 
  Type, 
  Flame, 
  Info,
  Layers
} from 'lucide-react';
import { PlatformMode, UserLibraryProfile } from '../types';

interface HeaderProps {
  currentMode: PlatformMode;
  onModeChange: (mode: PlatformMode) => void;
  onOpenDiagnostic: () => void;
  onOpenLibraryCard: () => void;
  userProfile: UserLibraryProfile;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onOpenDiagnostic,
  onOpenLibraryCard,
  userProfile,
  highContrast,
  onToggleHighContrast,
  fontSize,
  onChangeFontSize,
  activeSection,
  onSelectSection,
}) => {
  const isWalk = currentMode === 'walk';

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur border-b border-[#EBE5D8] shadow-xs transition-colors duration-200">
      {/* Top Banner & Accessibility Bar */}
      <div className="bg-[#1A3C20] text-emerald-50 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#5DA166]/30 text-emerald-200 border border-[#5DA166]/40">
              성남시립도서관
            </span>
            <span className="text-emerald-100 font-medium">
              성남시 중원도서관 맞춤형 독서 플랫폼
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Accessibility: Font Size */}
            <div className="flex items-center gap-1 bg-[#122A16] rounded-lg px-2 py-0.5 border border-[#254C2D]">
              <Type className="w-3.5 h-3.5 text-emerald-300" />
              <button
                id="font-size-normal-btn"
                onClick={() => onChangeFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  fontSize === 'normal' ? 'bg-[#5DA166] text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
                title="기본 글자 크기"
              >
                가
              </button>
              <button
                id="font-size-large-btn"
                onClick={() => onChangeFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[12px] font-medium transition-colors ${
                  fontSize === 'large' ? 'bg-[#5DA166] text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
                title="큰 글자 크기"
              >
                가+
              </button>
              <button
                id="font-size-xlarge-btn"
                onClick={() => onChangeFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-[13px] font-medium transition-colors ${
                  fontSize === 'xlarge' ? 'bg-[#5DA166] text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
                title="더 큰 글자 크기 (어르신·저시력)"
              >
                가++
              </button>
            </div>

            {/* Accessibility: High Contrast */}
            <button
              id="high-contrast-toggle-btn"
              onClick={onToggleHighContrast}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors border ${
                highContrast 
                  ? 'bg-[#F28D52] text-slate-950 font-bold border-[#F28D52]' 
                  : 'bg-[#122A16] text-emerald-200 hover:text-white border-[#254C2D]'
              }`}
              title="고대비 흑백 전환"
            >
              {highContrast ? <Sun className="w-3 h-3 text-slate-950" /> : <Moon className="w-3 h-3" />}
              <span>{highContrast ? '고대비 ON' : '고대비'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav & Mode Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-all ${
                isWalk ? 'bg-[#5DA166] text-white' : 'bg-[#1A3C20] text-white'
              }`}>
                {isWalk ? <BookOpen className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-[#1A3C20] leading-tight tracking-tight">
                    중원도서관 맞춤 플랫폼
                  </h1>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isWalk 
                      ? 'bg-[#EAF5EC] text-[#1A3C20] border-[#5DA166]/30' 
                      : 'bg-[#FFF0E6] text-[#C2410C] border-[#F28D52]/30'
                  }`}>
                    {isWalk ? '산책 모드 (비독자)' : '탐험 모드 (애독자)'}
                  </span>
                </div>
                <p className="text-xs text-[#526053] hidden sm:block">
                  {isWalk ? '가볍고 편안하게 시작하는 첫 독서 여정' : '기록하고 소통하며 깊어지는 독서 탐험'}
                </p>
              </div>
            </div>

            {/* Diagnostic Quick Button (Mobile) */}
            <button
              id="diagnostic-mobile-btn"
              onClick={onOpenDiagnostic}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFF3EB] border border-[#FDC9A6] text-[#C2410C] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F28D52]" />
              <span>성향진단</span>
            </button>
          </div>

          {/* Central Mode Switcher (2.1 모드 분리 UI) */}
          <div className="flex items-center p-1 bg-[#F3EFE6] rounded-2xl border border-[#E2D9C8] shadow-inner w-full sm:w-auto">
            <button
              id="mode-switch-walk-btn"
              onClick={() => onModeChange('walk')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isWalk
                  ? 'bg-white text-[#1A3C20] shadow-sm border border-[#5DA166]/30 ring-2 ring-[#5DA166]/20'
                  : 'text-[#526053] hover:text-[#1A3C20]'
              }`}
            >
              <span className="text-base">🌱</span>
              <div className="text-left">
                <span className="block font-bold">산책 모드</span>
                <span className="text-[10px] text-[#526053] block sm:inline">비독자·입문</span>
              </div>
            </button>

            <button
              id="mode-switch-expedition-btn"
              onClick={() => onModeChange('expedition')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                !isWalk
                  ? 'bg-white text-[#C2410C] shadow-sm border border-[#F28D52]/30 ring-2 ring-[#F28D52]/20'
                  : 'text-[#526053] hover:text-[#1A3C20]'
              }`}
            >
              <span className="text-base">🧭</span>
              <div className="text-left">
                <span className="block font-bold">탐험 모드</span>
                <span className="text-[10px] text-[#526053] block sm:inline">애독자·심화</span>
              </div>
            </button>
          </div>

          {/* Right Action Tools: Diagnostic, Library Card */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              id="diagnostic-desktop-btn"
              onClick={onOpenDiagnostic}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF3EB] hover:bg-[#FFE8DA] border border-[#FDC9A6] text-[#C2410C] text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#F28D52] animate-pulse" />
              <span>독서 성향 진단 (3문항)</span>
            </button>

            <button
              id="library-card-btn"
              onClick={onOpenLibraryCard}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A3C20] hover:bg-[#122A16] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#5DA166]" />
              <div className="text-left">
                <span className="font-bold">{userProfile.name} 회원</span>
                <span className="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-[#5DA166]/30 text-emerald-200 font-mono">
                  {userProfile.currentBorrowedCount}/{userProfile.baseLoanLimit + userProfile.extraBonusLoan}권
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mode-specific Sub Navigation */}
        <div className="mt-3 pt-2.5 border-t border-[#EBE5D8] flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            {isWalk ? (
              <>
                <button
                  id="nav-walk-all"
                  onClick={() => onSelectSection('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'all' ? 'bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  산책 홈 전체
                </button>
                <button
                  id="nav-walk-match"
                  onClick={() => onSelectSection('match')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'match' ? 'bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  🎯 취향 맞춤 책 매칭
                </button>
                <button
                  id="nav-walk-blind"
                  onClick={() => onSelectSection('blind')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'blind' ? 'bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  ✨ 첫 문장 블라인드
                </button>
                <button
                  id="nav-walk-challenge"
                  onClick={() => onSelectSection('challenge')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'challenge' ? 'bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  🍪 스낵 챌린지 (+대출확대)
                </button>
                <button
                  id="nav-walk-audio"
                  onClick={() => onSelectSection('audio')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'audio' ? 'bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  🎧 3분 카드뉴스 & 오디오
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-exp-all"
                  onClick={() => onSelectSection('all')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'all' ? 'bg-[#FFF0E6] text-[#C2410C] border border-[#F28D52]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  탐험 홈 전체
                </button>
                <button
                  id="nav-exp-curator"
                  onClick={() => onSelectSection('curator')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'curator' ? 'bg-[#FFF0E6] text-[#C2410C] border border-[#F28D52]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  👑 시민 큐레이터 보드
                </button>
                <button
                  id="nav-exp-bookshelf"
                  onClick={() => onSelectSection('bookshelf')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'bookshelf' ? 'bg-[#FFF0E6] text-[#C2410C] border border-[#F28D52]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  📊 나만의 디지털 서재·통계
                </button>
                <button
                  id="nav-exp-club"
                  onClick={() => onSelectSection('club')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    activeSection === 'club' ? 'bg-[#FFF0E6] text-[#C2410C] border border-[#F28D52]/30 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
                  }`}
                >
                  💬 독서 모임 북클럽 매칭
                </button>
              </>
            )}
            <button
              id="nav-common-relay"
              onClick={() => onSelectSection('relay')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeSection === 'relay' ? 'bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6] shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
              }`}
            >
              🔄 릴레이 추천 스레드
            </button>
            <button
              id="nav-common-thermometer"
              onClick={() => onSelectSection('thermometer')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeSection === 'thermometer' ? 'bg-rose-100 text-rose-900 border border-rose-200 shadow-2xs' : 'text-[#526053] hover:bg-[#F3EFE6]'
              }`}
            >
              🌡️ 중원 독서 온도계
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
