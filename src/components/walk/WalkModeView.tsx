import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Heart, 
  Award, 
  Headphones, 
  Filter, 
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Smile,
  Zap,
  Coffee
} from 'lucide-react';
import { TasteMatchingQuiz } from './TasteMatchingQuiz';
import { BlindCurationSwipe } from './BlindCurationSwipe';
import { SnackChallengeSection } from './SnackChallenge';
import { CardNewsAudioViewer } from './CardNewsAudioViewer';
import { 
  Book, 
  SnackChallenge, 
  CardNewsAudio, 
  UserLibraryProfile,
  BookCategory
} from '../../types';

interface WalkModeViewProps {
  books: Book[];
  challenges: SnackChallenge[];
  cardNewsList: CardNewsAudio[];
  userProfile: UserLibraryProfile;
  activeSection: string;
  onOpenBookDetail: (book: Book) => void;
  onClaimReward: (challengeId: string) => void;
  onIncrementProgress: (challengeId: string) => void;
  onAddChallenge: (newChallenge: Omit<SnackChallenge, 'id' | 'completed' | 'claimed'>) => void;
  onAddCardNews: (newCard: CardNewsAudio) => void;
  onOpenLibraryCard: () => void;
}

export const WalkModeView: React.FC<WalkModeViewProps> = ({
  books,
  challenges,
  cardNewsList,
  userProfile,
  activeSection,
  onOpenBookDetail,
  onClaimReward,
  onIncrementProgress,
  onAddChallenge,
  onAddCardNews,
  onOpenLibraryCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter books for beginner-friendly walk mode (그림책, 시집, 웹툰, 짧은 에세이)
  const walkBooks = books.filter(b => 
    ['picture_book', 'poetry', 'webtoon', 'short_essay'].includes(b.category)
  );

  const filteredBooks = selectedCategory === 'all' 
    ? walkBooks 
    : walkBooks.filter(b => b.category === selectedCategory);

  return (
    <div id="walk-mode-container" className="space-y-10 animate-in fade-in duration-300">
      {/* Intro Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1A3C20] via-[#24542D] to-[#1A3C20] text-white relative overflow-hidden shadow-md border border-[#2D6638]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#5DA166]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#5DA166]/30 backdrop-blur-xs text-emerald-200 border border-[#5DA166]/40 mb-3">
            <span>🌱</span>
            <span>비독자를 위한 중원도서관 산책 모드</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
            완독의 부담 없이, <br className="hidden sm:inline" />
            <span className="text-[#F28D52]">가벼운 발걸음</span>으로 시작하는 오늘의 독서
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2.5 leading-relaxed">
            두꺼운 책 대신 10분 만에 읽는 그림책, 마음을 적시는 한 줄 시집, 흥미진진한 웹툰과 3분 사서 오디오가 준비되어 있습니다.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#5DA166]/40 text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-[#5DA166]" />
              <span>하루 10p 챌린지 시 대출 +1권</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#F28D52]/40 text-[#FDC9A6]">
              <Sparkles className="w-4 h-4 text-[#F28D52]" />
              <span>첫 문장 블라인드 큐레이션</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Taste Matching Quiz (2.2 취향 맞춤 책 매칭) */}
      {(activeSection === 'all' || activeSection === 'match') && (
        <section id="section-taste-match">
          <TasteMatchingQuiz 
            books={books} 
            onOpenBookDetail={onOpenBookDetail} 
          />
        </section>
      )}

      {/* 2. Blind Curation Swipe (2.2 첫 문장 블라인드 큐레이션) */}
      {(activeSection === 'all' || activeSection === 'blind') && (
        <section id="section-blind-curation">
          <BlindCurationSwipe 
            books={books} 
            onOpenBookDetail={onOpenBookDetail}
            onExploreCard={() => onIncrementProgress('snack-3')}
          />
        </section>
      )}

      {/* 3. Snack Challenge (2.2 스낵 챌린지 시스템) */}
      {(activeSection === 'all' || activeSection === 'challenge') && (
        <section id="section-snack-challenge">
          <SnackChallengeSection
            challenges={challenges}
            onClaimReward={onClaimReward}
            onIncrementProgress={onIncrementProgress}
            onAddChallenge={onAddChallenge}
            userProfile={userProfile}
            onOpenLibraryCard={onOpenLibraryCard}
          />
        </section>
      )}

      {/* 4. 3-Minute CardNews & Audio Viewer (2.2 3분 카드뉴스 & 오디오 뷰어) */}
      {(activeSection === 'all' || activeSection === 'audio') && (
        <section id="section-cardnews-audio">
          <CardNewsAudioViewer
            cardNewsList={cardNewsList}
            onAddCardNews={onAddCardNews}
          />
        </section>
      )}

      {/* 5. Curated Beginner Bookshelf */}
      {(activeSection === 'all') && (
        <section id="section-beginner-curation-grid" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#5DA166]" />
                <span>산책 모드 특화 서가</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A3C20]">
                중원도서관 <span className="text-[#5DA166]">입문 추천 서가</span> (10~30분 컷)
              </h3>
              <p className="text-xs sm:text-sm text-[#526053] mt-1">
                글밥이 적고 시각적 즐거움이 가득한 도서관 소장 도서들입니다.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: '전체 입문서' },
                { id: 'picture_book', label: '🎨 그림책' },
                { id: 'poetry', label: '🌸 시집' },
                { id: 'webtoon', label: '⚡ 웹툰' },
                { id: 'short_essay', label: '☕ 짧은 에세이' },
              ].map(cat => (
                <button
                  key={cat.id}
                  id={`filter-walk-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedCategory === cat.id
                      ? 'bg-[#5DA166] text-white border-[#5DA166] shadow-xs'
                      : 'bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#526053] border-[#EBE5D8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map(book => (
              <div
                key={book.id}
                id={`walk-book-card-${book.id}`}
                onClick={() => onOpenBookDetail(book)}
                className="group bg-[#FDFBF7] rounded-2xl border border-[#EBE5D8] overflow-hidden hover:border-[#5DA166] hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative bg-[#F3EFE6]">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1A3C20]/80 text-white backdrop-blur-xs">
                    {book.readingTimeMinutes}분 완독
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#5DA166] text-white shadow-xs">
                    {book.categoryName}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1A3C20] group-hover:text-[#5DA166] transition-colors line-clamp-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#526053] mt-0.5">
                      {book.author} 저 · {book.publisher}
                    </p>

                    <p className="text-xs text-[#526053] mt-2 line-clamp-2 leading-relaxed">
                      {book.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EBE5D8] flex items-center justify-between text-xs">
                    <span className="text-[#2E7D32] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5DA166]" />
                      대출가능 {book.availableCopies}권
                    </span>
                    <span className="text-[#526053] group-hover:text-[#5DA166] font-semibold flex items-center gap-0.5">
                      상세보기
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
