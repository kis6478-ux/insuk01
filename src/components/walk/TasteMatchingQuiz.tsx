import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Coffee, 
  Heart, 
  Zap, 
  Clock, 
  Clock3, 
  Flame, 
  Sun,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TASTE_MATCHING_QUESTIONS } from '../../data/mockData';
import { Book, BookCategory } from '../../types';

interface TasteMatchingQuizProps {
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
}

export const TasteMatchingQuiz: React.FC<TasteMatchingQuizProps> = ({
  books,
  onOpenBookDetail,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [matchedBook, setMatchedBook] = useState<Book | null>(null);

  const currentQ = TASTE_MATCHING_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const nextAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(nextAnswers);

    if (currentStep < TASTE_MATCHING_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 1:1 Matching Algorithm
      // Find candidate categories and tags
      const preferredCategories: BookCategory[] = [];
      const collectedTags: string[] = [];

      nextAnswers.forEach((ansIdx, qIdx) => {
        const option = TASTE_MATCHING_QUESTIONS[qIdx].options[ansIdx];
        if (option) {
          preferredCategories.push(...option.preferredCategories);
          collectedTags.push(...option.tags);
        }
      });

      // Filter easy/beginner friendly books (그림책, 시집, 웹툰, 짧은 에세이)
      const easyBooks = books.filter(b => 
        ['picture_book', 'poetry', 'webtoon', 'short_essay'].includes(b.category)
      );

      // Score books
      let bestBook = easyBooks[0];
      let bestScore = -1;

      easyBooks.forEach(b => {
        let score = 0;
        if (preferredCategories.includes(b.category)) score += 3;
        b.tags.forEach(t => {
          if (collectedTags.includes(t)) score += 2;
        });
        if (b.isPopular) score += 1;

        if (score > bestScore) {
          bestScore = score;
          bestBook = b;
        }
      });

      setMatchedBook(bestBook || books[0]);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setMatchedBook(null);
  };

  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'Coffee': return <Coffee {...props} className="w-5 h-5 text-amber-700" />;
      case 'Heart': return <Heart {...props} className="w-5 h-5 text-rose-600" />;
      case 'Zap': return <Zap {...props} className="w-5 h-5 text-amber-500" />;
      case 'Clock3': return <Clock3 {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Clock': return <Clock {...props} className="w-5 h-5 text-indigo-600" />;
      case 'BookOpen': return <BookOpen {...props} className="w-5 h-5 text-blue-600" />;
      case 'Sparkle': return <Sparkles {...props} className="w-5 h-5 text-amber-500" />;
      case 'Flame': return <Flame {...props} className="w-5 h-5 text-rose-500" />;
      case 'Sun': return <Sun {...props} className="w-5 h-5 text-amber-600" />;
      default: return <Sparkles {...props} className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div id="taste-matching-quiz-card" className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm relative overflow-hidden">
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#5DA166] text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>3초 취향 맞춤 1:1 도서 매칭</span>
        </div>
        <span className="text-xs font-bold text-[#1A3C20] bg-[#EAF5EC] border border-[#5DA166]/30 px-3 py-1 rounded-xl">
          그림책 · 시집 · 웹툰 · 짧은 에세이
        </span>
      </div>

      {!matchedBook ? (
        <div>
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-[#1A3C20] font-bold mb-1.5">
              <span>질문 {currentStep + 1} / {TASTE_MATCHING_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / TASTE_MATCHING_QUESTIONS.length) * 100)}%</span>
            </div>
            
            {/* Progress Bars */}
            <div className="flex items-center gap-1.5 mb-4">
              {TASTE_MATCHING_QUESTIONS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx <= currentStep ? 'bg-[#5DA166]' : 'bg-[#E2D9C8]'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20] leading-snug">
              {currentQ.question}
            </h3>
            <p className="text-xs sm:text-sm text-[#526053] mt-1">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                id={`taste-quiz-q${currentQ.id}-opt${i}`}
                onClick={() => handleSelectOption(i)}
                className="text-left p-5 rounded-2xl bg-white hover:bg-[#5DA166] hover:text-white border border-[#EBE5D8] hover:border-[#5DA166] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EC] group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors">
                    {renderIcon(opt.icon)}
                  </div>
                  <h4 className="font-bold text-sm text-[#1A3C20] group-hover:text-white leading-snug">
                    {opt.text}
                  </h4>
                  <p className="text-xs text-[#526053] group-hover:text-emerald-50 mt-1.5 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EBE5D8] group-hover:border-white/20 flex items-center justify-between text-xs font-bold text-[#5DA166] group-hover:text-white">
                  <span>선택하기</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Matched Book Result */
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <span className="text-4xl inline-block mb-2">🎁</span>
            <h3 className="text-2xl font-black text-[#1A3C20]">
              오늘 당신의 마음에 꼭 맞는 책을 찾았어요!
            </h3>
            <p className="text-xs sm:text-sm text-[#526053] mt-1">
              부담 없이 가볍게 펼쳐볼 수 있는 중원도서관 맞춤 입문 도서입니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EBE5D8] shadow-sm flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-32 h-44 rounded-xl overflow-hidden shadow-md shrink-0 border border-[#EBE5D8] relative group">
              <img 
                src={matchedBook.coverUrl} 
                alt={matchedBook.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1A3C20] text-white">
                {matchedBook.readingTimeMinutes}분 컷
              </span>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30">
                  {matchedBook.categoryName}
                </span>
                <span className="text-xs text-[#526053] font-mono">
                  {matchedBook.location}
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-[#1A3C20] mt-1.5">
                {matchedBook.title}
              </h4>
              <p className="text-xs text-[#526053] mt-0.5">
                {matchedBook.author} 저 · {matchedBook.publisher}
              </p>

              {/* First Sentence Quote */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#FFF3EB] border border-[#FDC9A6] text-xs text-[#C2410C] font-serif italic">
                “{matchedBook.firstSentence}”
              </div>

              <p className="text-xs text-[#526053] mt-3 line-clamp-2 leading-relaxed">
                {matchedBook.summary}
              </p>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  id="view-matched-book-detail-btn"
                  onClick={() => onOpenBookDetail(matchedBook)}
                  className="px-5 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-md shadow-[#5DA166]/20 flex items-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>도서관 대출 상세 보기</span>
                </button>
                <button
                  id="rematch-taste-btn"
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl border border-[#EBE5D8] hover:bg-[#FAF7F0] text-[#526053] text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 매칭하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
