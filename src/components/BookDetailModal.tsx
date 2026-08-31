import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  MapPin, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrowOrReserve: (book: Book) => void;
  isAlreadyBorrowed?: boolean;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  onBorrowOrReserve,
  isAlreadyBorrowed = false,
}) => {
  const [reserved, setReserved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [smartLockerSelected, setSmartLockerSelected] = useState(false);

  if (!isOpen || !book) return null;

  const handleAction = () => {
    onBorrowOrReserve(book);
    setReserved(true);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  return (
    <div id="book-detail-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="book-detail-modal-content"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EBE5D8] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EBE5D8] bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30">
              {book.categoryName}
            </span>
            <span className="text-xs text-[#526053] font-medium">
              청구기호: <span className="font-mono text-[#1A3C20] font-bold">{book.callNumber}</span>
            </span>
          </div>
          <button
            id="close-book-detail-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EBE5D8] text-[#526053] hover:text-[#1A3C20] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-[#FDFBF7]">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-40 h-56 bg-[#FAF7F0] rounded-2xl overflow-hidden shadow-md shrink-0 border border-[#EBE5D8] relative group">
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1A3C20]/90 text-white backdrop-blur-xs">
                {book.readingTimeMinutes}분 컷
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1A3C20] leading-tight">
                    {book.title}
                  </h2>
                  <p className="text-sm text-[#526053] mt-1">
                    {book.author} 저 · {book.publisher} ({book.year})
                  </p>
                </div>
                <button
                  id="like-book-btn"
                  onClick={() => setLiked(!liked)}
                  className={`p-2 rounded-xl border transition-colors ${
                    liked 
                      ? 'bg-[#FFF3EB] border-[#FDC9A6] text-[#C2410C]' 
                      : 'border-[#EBE5D8] text-[#526053] hover:text-[#C2410C] hover:bg-[#FAF7F0]'
                  }`}
                  title="관심 도서 찜하기"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-[#C2410C] text-[#C2410C]' : ''}`} />
                </button>
              </div>

              {/* Badges & Meta */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {book.tags.map((t, idx) => (
                  <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white border border-[#EBE5D8] text-[#526053]">
                    #{t}
                  </span>
                ))}
              </div>

              {/* First Sentence Blind Card */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF3EB] border border-[#FDC9A6] relative">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2410C] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F28D52]" />
                  <span>이 책의 첫 문장</span>
                </div>
                <p className="text-xs text-[#1A3C20] font-serif italic leading-relaxed">
                  “{book.firstSentence}”
                </p>
              </div>

              {/* Recommendation Reason */}
              {book.recommendReason && (
                <div className="mt-3 text-xs text-[#1A3C20] bg-[#EAF5EC] p-2.5 rounded-xl border border-[#5DA166]/30 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5DA166] shrink-0 mt-0.5" />
                  <span><strong>사서 큐레이터 한마디:</strong> {book.recommendReason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Library Physical Location & Real-time Loan Status */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBE5D8]">
            <h3 className="text-xs font-bold text-[#1A3C20] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#5DA166]" />
              <span>성남시 중원도서관 소장 및 대출 현황</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EBE5D8]">
                <span className="text-[#526053] block">소장 위치</span>
                <span className="font-bold text-[#1A3C20] mt-0.5 block">{book.location}</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EBE5D8]">
                <span className="text-[#526053] block">대출 가능 여부</span>
                <span className="font-bold text-[#5DA166] mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  대출 가능 ({book.availableCopies}/{book.totalCopies}권)
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#EBE5D8]">
                <span className="text-[#526053] block">예상 독서 소요시간</span>
                <span className="font-bold text-[#1A3C20] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#526053]" />
                  약 {book.readingTimeMinutes}분 ({book.pageCount}쪽)
                </span>
              </div>
            </div>

            {/* Smart Locker Option */}
            <div className="mt-3 flex items-center justify-between p-3 bg-[#EAF5EC] rounded-xl border border-[#5DA166]/30 text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5DA166]" />
                <div>
                  <span className="font-bold text-[#1A3C20]">중원 무인 스마트도서관 수령</span>
                  <p className="text-[11px] text-[#526053]">도서관 야간·휴관일에도 24시간 무인 보관함에서 수령 가능</p>
                </div>
              </div>
              <input
                id="smart-locker-checkbox"
                type="checkbox"
                checked={smartLockerSelected}
                onChange={(e) => setSmartLockerSelected(e.target.checked)}
                className="w-4 h-4 text-[#5DA166] rounded border-[#EBE5D8] focus:ring-[#5DA166]"
              />
            </div>
          </div>

          {/* Book Summary */}
          <div>
            <h3 className="text-sm font-bold text-[#1A3C20] mb-2">책 소개 및 줄거리</h3>
            <p className="text-xs text-[#2C3E2D] leading-relaxed bg-white p-4 rounded-2xl border border-[#EBE5D8]">
              {book.summary}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#EBE5D8] bg-[#FAF7F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#526053] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#526053]" />
            <span>대출 기간: 기본 14일 (스낵 챌린지 혜택 시 대출 권수 확대)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="cancel-book-modal-btn"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#EBE5D8] text-[#526053] hover:bg-white text-xs font-semibold transition-colors"
            >
              닫기
            </button>
            <button
              id="borrow-reserve-book-btn"
              onClick={handleAction}
              disabled={reserved || isAlreadyBorrowed}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                reserved || isAlreadyBorrowed
                  ? 'bg-[#E2D9C8] text-[#526053] cursor-not-allowed'
                  : 'bg-[#5DA166] hover:bg-[#488250] shadow-[#5DA166]/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {isAlreadyBorrowed 
                  ? '현재 대출 중인 도서' 
                  : reserved 
                    ? '대출 예약 완료!' 
                    : smartLockerSelected 
                      ? '스마트도서관 보관함 신청' 
                      : '도서관 대출 신청하기'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
