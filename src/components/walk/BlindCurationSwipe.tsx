import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  BookOpen, 
  Clock, 
  Quote,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { BLIND_QUOTE_CARDS } from '../../data/mockData';
import { Book } from '../../types';

interface BlindCurationSwipeProps {
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
  onExploreCard?: () => void;
}

export const BlindCurationSwipe: React.FC<BlindCurationSwipeProps> = ({
  books,
  onOpenBookDetail,
  onExploreCard,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const currentCard = BLIND_QUOTE_CARDS[currentIndex];
  const associatedBook = books.find(b => b.id === currentCard.bookId);

  const isCurrentRevealed = !!revealed[currentCard.id];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BLIND_QUOTE_CARDS.length);
    if (onExploreCard) onExploreCard();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BLIND_QUOTE_CARDS.length) % BLIND_QUOTE_CARDS.length);
  };

  const handleToggleReveal = () => {
    setRevealed(prev => ({ ...prev, [currentCard.id]: !prev[currentCard.id] }));
    if (onExploreCard) onExploreCard();
  };

  return (
    <div id="blind-curation-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F28D52]" />
            <span>첫 문장 블라인드 큐레이션</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            제목과 작가를 가린 채, <span className="text-[#C2410C]">오직 첫 문장</span>으로만 만나는 책
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            편견 없이 문장의 울림만으로 책을 골라보세요. 카드를 선택하면 중원도서관 소장 정보가 공개됩니다.
          </p>
        </div>

        {/* Navigation Indicator */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-[#526053]">
            {currentIndex + 1} / {BLIND_QUOTE_CARDS.length}
          </span>
          <button
            id="blind-prev-btn"
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-[#EBE5D8] hover:bg-[#FAF7F0] text-[#1A3C20] transition-colors"
            title="이전 카드"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            id="blind-next-btn"
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-[#EBE5D8] hover:bg-[#FAF7F0] text-[#1A3C20] transition-colors"
            title="다음 카드"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Blind Card Display */}
      <div className="relative max-w-2xl mx-auto">
        <div 
          className={`rounded-3xl p-8 sm:p-10 text-white bg-gradient-to-br ${currentCard.bgGradient} shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[360px]`}
        >
          {/* Subtle Top Decor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white border border-white/30">
                {currentCard.hookTheme}
              </span>
              <span className="text-xs text-white/90 font-mono font-medium">
                {currentCard.readingTime}
              </span>
            </div>
            <Quote className="w-8 h-8 text-white/30" />
          </div>

          {/* Quote Body */}
          <div className="my-6">
            <p className="text-lg sm:text-2xl font-serif font-medium leading-relaxed sm:leading-loose tracking-wide text-white drop-shadow-xs">
              {currentCard.quote}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-black/25 text-white">
                {currentCard.emotionTag}
              </span>
            </div>
          </div>

          {/* Revealed Book Info or Mystery Shield */}
          <div className="pt-4 border-t border-white/20">
            {isCurrentRevealed && associatedBook ? (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 text-[#1A3C20] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200 border border-white/40">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img 
                    src={associatedBook.coverUrl} 
                    alt={associatedBook.title} 
                    className="w-12 h-16 object-cover rounded-xl shadow-sm border border-[#EBE5D8] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5EC] text-[#1A3C20]">
                        {associatedBook.categoryName}
                      </span>
                      <span className="text-xs text-[#526053] font-mono">
                        {associatedBook.location}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1A3C20] mt-0.5">
                      {associatedBook.title}
                    </h4>
                    <p className="text-xs text-[#526053]">
                      {associatedBook.author} 저 · 청구기호 {associatedBook.callNumber}
                    </p>
                  </div>
                </div>

                <button
                  id={`blind-goto-book-${associatedBook.id}`}
                  onClick={() => onOpenBookDetail(associatedBook)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-md shadow-[#5DA166]/20 flex items-center justify-center gap-1.5 shrink-0 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>중원도서관 대출 상세 보기</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-white/90 font-medium">
                  🔒 제목과 저자가 블라인드 처리되어 있습니다.
                </span>
                <button
                  id="reveal-blind-card-btn"
                  onClick={handleToggleReveal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#1A3C20] hover:bg-[#FAF7F0] text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4 text-[#5DA166]" />
                  <span>이 책의 정체 확인하기</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Selector list */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {BLIND_QUOTE_CARDS.map((card, idx) => (
            <button
              key={card.id}
              id={`blind-thumb-${idx}`}
              onClick={() => {
                setCurrentIndex(idx);
                if (onExploreCard) onExploreCard();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-[#F28D52]' : 'w-2 bg-[#E2D9C8] hover:bg-[#C8BEAB]'
              }`}
              title={`카드 ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
