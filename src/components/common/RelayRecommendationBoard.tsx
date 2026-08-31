import React, { useState } from 'react';
import { 
  Repeat, 
  MessageSquare, 
  Sparkles, 
  Star, 
  Send, 
  Plus, 
  X, 
  CheckCircle2, 
  BookOpen,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RelayRecommendation, RelayReview, Book } from '../../types';

interface RelayRecommendationBoardProps {
  relayList: RelayRecommendation[];
  books: Book[];
  onAddReview: (relayId: string, review: RelayReview) => void;
  onAddRecommendation: (newRec: RelayRecommendation) => void;
  onOpenBookDetail: (book: Book) => void;
}

export const RelayRecommendationBoard: React.FC<RelayRecommendationBoardProps> = ({
  relayList,
  books,
  onAddReview,
  onAddRecommendation,
  onOpenBookDetail,
}) => {
  const [activeRelayId, setActiveRelayId] = useState<string>(relayList[0]?.id || '');
  const [showCreateRecModal, setShowCreateRecModal] = useState(false);
  
  // Review input state
  const [newReviewerName, setNewReviewerName] = useState('초보독서러');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isFirstTimerCheck, setIsFirstTimerCheck] = useState(true);

  // New Recommendation state
  const [recBookId, setRecBookId] = useState(books[0]?.id || '');
  const [recommenderName, setRecommenderName] = useState('성남 다독시민');
  const [recommenderBadge, setRecommenderBadge] = useState('골드 큐레이터 · 애독자');
  const [recReason, setRecReason] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'입문자 강력추천' | '가볍게 읽기좋음' | '몰입도 최고'>('입문자 강력추천');

  const activeRelay = relayList.find(r => r.id === activeRelayId) || relayList[0];
  const associatedBook = books.find(b => b.id === activeRelay?.bookId);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim() || !activeRelay) return;

    const newRev: RelayReview = {
      id: `rev-${Date.now()}`,
      reviewerName: newReviewerName,
      isFirstTimer: isFirstTimerCheck,
      comment: newReviewComment,
      rating: newReviewRating,
      date: '2026.08.31',
    };

    onAddReview(activeRelay.id, newRev);
    setNewReviewComment('');

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  const handleCreateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBook = books.find(b => b.id === recBookId);
    if (!selectedBook || !recReason.trim()) return;

    const newRec: RelayRecommendation = {
      id: `relay-${Date.now()}`,
      recommenderName,
      recommenderBadge,
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      bookAuthor: selectedBook.author,
      bookCover: selectedBook.coverUrl,
      difficultyLevel,
      recReason,
      createdAt: '2026.08.31',
      reviews: [],
    };

    onAddRecommendation(newRec);
    setActiveRelayId(newRec.id);
    setShowCreateRecModal(false);
    setRecReason('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div id="relay-recommendation-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6] mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#F28D52]" />
            <span>애독자 & 비독자 통합 소통</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            애독자의 입문 추천 ➡️ <span className="text-[#C2410C]">비독자의 한 줄 리뷰 릴레이</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            애독자가 &quot;이 책이면 누구나 책과 친해질 수 있어요!&quot;라고 추천한 책에, 비독자가 직접 읽고 솔직한 한 줄 평을 남기는 스레드입니다.
          </p>
        </div>

        {/* Add Recommendation Button */}
        <button
          id="open-create-relay-btn"
          onClick={() => setShowCreateRecModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-md shadow-[#5DA166]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>애독자 입문서 추천 등록</span>
        </button>
      </div>

      {/* Main Layout: Relay Threads List (Left) + Selected Thread Detail & Review Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Relay Books List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#1A3C20] uppercase tracking-wider block mb-2">
            진행 중인 릴레이 스레드 ({relayList.length}개)
          </span>

          {relayList.map((relay) => {
            const isSelected = relay.id === activeRelay?.id;

            return (
              <div
                key={relay.id}
                id={`relay-item-${relay.id}`}
                onClick={() => setActiveRelayId(relay.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected 
                    ? 'bg-[#FAF7F0] border-[#5DA166] shadow-xs' 
                    : 'bg-white border-[#EBE5D8] hover:border-[#5DA166]'
                }`}
              >
                <img 
                  src={relay.bookCover} 
                  alt={relay.bookTitle} 
                  className="w-12 h-16 object-cover rounded-lg border border-[#EBE5D8] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6]">
                      {relay.difficultyLevel}
                    </span>
                    <span className="text-[10px] text-[#526053] font-mono">
                      리뷰 {relay.reviews.length}개
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1A3C20] truncate">
                    {relay.bookTitle}
                  </h4>
                  <p className="text-xs text-[#526053] truncate">
                    추천인: {relay.recommenderName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Relay Detail & Non-reader reviews (7 cols) */}
        {activeRelay && (
          <div className="lg:col-span-7 bg-[#FAF7F0] rounded-3xl p-6 border border-[#EBE5D8] flex flex-col justify-between">
            <div>
              {/* Pro Reader's Recommendation Header */}
              <div className="p-4 bg-white rounded-2xl border border-[#EBE5D8] shadow-2xs mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30">
                        {activeRelay.recommenderBadge}
                      </span>
                      <span className="text-xs font-bold text-[#1A3C20]">
                        {activeRelay.recommenderName}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-[#1A3C20] mt-1">
                      《{activeRelay.bookTitle}》 ({activeRelay.bookAuthor})
                    </h4>
                  </div>

                  {associatedBook && (
                    <button
                      id={`relay-view-book-${associatedBook.id}`}
                      onClick={() => onOpenBookDetail(associatedBook)}
                      className="px-3 py-1.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>도서관 대출</span>
                    </button>
                  )}
                </div>

                <div className="mt-3 p-3 bg-[#FFF3EB] rounded-xl border border-[#FDC9A6] text-xs text-[#1A3C20] font-serif leading-relaxed italic">
                  {activeRelay.recReason}
                </div>
              </div>

              {/* Non-Reader Review Threads List */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#1A3C20] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#F28D52]" />
                    <span>비독자·시민 릴레이 한 줄 리뷰 ({activeRelay.reviews.length})</span>
                  </span>
                  <span className="text-[10px] text-[#526053] font-medium">
                    책을 처음 읽은 솔직한 소감을 남겨주세요!
                  </span>
                </div>

                {activeRelay.reviews.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-[#EBE5D8] text-xs text-[#526053]">
                    아직 등록된 한 줄 리뷰가 없습니다. 첫 번째 리뷰어가 되어보세요!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {activeRelay.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 bg-white rounded-xl border border-[#EBE5D8] text-xs shadow-2xs flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#1A3C20]">
                              {rev.reviewerName}
                            </span>
                            {rev.isFirstTimer && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 flex items-center gap-0.5">
                                <UserCheck className="w-3 h-3 text-[#5DA166]" />
                                입문 완독자
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-[#F28D52] text-[#F28D52]' : 'text-[#EBE5D8]'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-[#2C3E2D] leading-relaxed">
                          {rev.comment}
                        </p>

                        <span className="text-[10px] text-[#526053] font-mono mt-2 block">
                          {rev.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Non-Reader Review Form */}
            <form onSubmit={handleSubmitReview} className="mt-3 pt-3 border-t border-[#EBE5D8] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="닉네임"
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                    className="w-24 p-1.5 rounded-lg border border-[#EBE5D8] bg-white font-medium text-xs text-[#1A3C20]"
                    required
                  />
                  <label className="flex items-center gap-1 text-[#526053] cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isFirstTimerCheck}
                      onChange={(e) => setIsFirstTimerCheck(e.target.checked)}
                      className="rounded text-[#5DA166] focus:ring-[#5DA166]"
                    />
                    <span>독서 입문자 뱃지 달기</span>
                  </label>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[#526053] font-medium">별점:</span>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="p-1 rounded-lg border border-[#EBE5D8] bg-white font-bold text-[#1A3C20]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5점</option>
                    <option value={4}>⭐⭐⭐⭐ 4점</option>
                    <option value={3}>⭐⭐⭐ 3점</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="이 책으로 독서 시작했어요! 솔직한 한 줄 리뷰를 남겨주세요..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-xs text-[#1A3C20]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Create Recommendation Modal */}
      {showCreateRecModal && (
        <div id="create-relay-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl border border-[#EBE5D8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EBE5D8]">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#F28D52]" />
                <h4 className="text-base font-black text-[#1A3C20]">
                  애독자의 비독자 입문서 추천 등록
                </h4>
              </div>
              <button 
                onClick={() => setShowCreateRecModal(false)}
                className="p-1 rounded-full text-[#526053] hover:text-[#1A3C20]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecommendation} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A3C20] font-bold mb-1">추천인 닉네임</label>
                  <input
                    type="text"
                    value={recommenderName}
                    onChange={(e) => setRecommenderName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-[#1A3C20]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#1A3C20] font-bold mb-1">추천인 등급/뱃지</label>
                  <input
                    type="text"
                    value={recommenderBadge}
                    onChange={(e) => setRecommenderBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-[#1A3C20]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A3C20] font-bold mb-1">추천 도서 선택 (중원도서관 소장 도서)</label>
                <select
                  value={recBookId}
                  onChange={(e) => setRecBookId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-[#1A3C20]"
                >
                  {books.map(b => (
                    <option key={b.id} value={b.id}>
                      [{b.categoryName}] {b.title} - {b.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#1A3C20] font-bold mb-1">난이도 추천 태그</label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-[#1A3C20]"
                >
                  <option value="입문자 강력추천">입문자 강력추천 (누구나 쉽게 시작)</option>
                  <option value="가볍게 읽기좋음">가볍게 읽기좋음 (토막글/단편)</option>
                  <option value="몰입도 최고">몰입도 최고 (시간 순삭 스토리)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A3C20] font-bold mb-1">비독자에게 전하는 따뜻한 추천 이유</label>
                <textarea
                  rows={3}
                  placeholder="왜 이 책이 비독자의 독서 첫걸음에 좋은지 애독자로서 다정하게 설명해 주세요."
                  value={recReason}
                  onChange={(e) => setRecReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#EBE5D8] focus:outline-[#5DA166] bg-white text-[#1A3C20]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRecModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#EBE5D8] bg-white text-[#526053] font-semibold hover:bg-[#FAF7F0]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white font-bold"
                >
                  릴레이 스레드 발행
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
