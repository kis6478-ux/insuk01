import React, { useState } from 'react';
import { 
  Crown, 
  Heart, 
  Eye, 
  Plus, 
  X, 
  Sparkles, 
  BookOpen, 
  Share2, 
  CheckCircle2,
  TrendingUp,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CitizenCuration, Book } from '../../types';

interface CitizenCuratorBoardProps {
  curations: CitizenCuration[];
  books: Book[];
  onToggleLike: (curationId: string) => void;
  onAddCuration: (newCuration: CitizenCuration) => void;
  onOpenBookDetail: (book: Book) => void;
}

export const CitizenCuratorBoard: React.FC<CitizenCuratorBoardProps> = ({
  curations,
  books,
  onToggleLike,
  onAddCuration,
  onOpenBookDetail,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCuratorId, setSelectedCuratorId] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newIntro, setNewIntro] = useState('');
  const [newCuratorName, setNewCuratorName] = useState('성남책벌레');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [newTags, setNewTags] = useState('성남추천,인생책');

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || selectedBookIds.length === 0) return;

    const newCur: CitizenCuration = {
      id: `cur-${Date.now()}`,
      title: newTitle,
      curatorName: newCuratorName,
      curatorTier: '실버 큐레이터',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      theme: newTheme || '시민 자율 큐레이션',
      intro: newIntro,
      bookIds: selectedBookIds,
      likes: 1,
      views: 12,
      isLiked: true,
      createdAt: '2026.08.31',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    onAddCuration(newCur);
    setShowCreateModal(false);
    // reset
    setNewTitle('');
    setNewTheme('');
    setNewIntro('');
    setSelectedBookIds([]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const toggleSelectBookInModal = (bookId: string) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter(id => id !== bookId));
    } else {
      if (selectedBookIds.length < 5) {
        setSelectedBookIds([...selectedBookIds, bookId]);
      }
    }
  };

  // Sort by popularity (likes)
  const sortedCurations = [...curations].sort((a, b) => b.likes - a.likes);

  return (
    <div id="citizen-curator-board-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6] mb-2">
            <Crown className="w-3.5 h-3.5 text-[#F28D52]" />
            <span>시민 큐레이터 테마 게시판</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            성남시 우수 다독가가 엄선한 <span className="text-[#5DA166]">테마 큐레이션 서가</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            중원도서관 우수 이용자(골드·실버 큐레이터)가 직접 구성한 테마 리스트에 투표하고 의견을 나눠보세요.
          </p>
        </div>

        {/* Create Curation Action */}
        <button
          id="open-create-curation-modal-btn"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-md shadow-[#5DA166]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>나만의 테마 큐레이션 등록</span>
        </button>
      </div>

      {/* Curation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedCurations.map((cur, idx) => {
          const curatedBooks = cur.bookIds.map(id => books.find(b => b.id === id)).filter(Boolean) as Book[];

          return (
            <div
              key={cur.id}
              id={`curation-card-${cur.id}`}
              className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#EBE5D8] hover:border-[#5DA166] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Curator Profile */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={cur.avatar} 
                      alt={cur.curatorName} 
                      className="w-9 h-9 rounded-full object-cover border border-[#EBE5D8]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#1A3C20]">{cur.curatorName}</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFF3EB] text-[#C2410C] border border-[#FDC9A6]">
                            1위 BEST
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#5DA166] font-bold block">
                        {cur.curatorTier}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#526053] font-mono">
                    {cur.createdAt}
                  </span>
                </div>

                {/* Title & Theme */}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#EAF5EC] text-[#1A3C20] inline-block mb-1.5 border border-[#5DA166]/20">
                  #{cur.theme}
                </span>

                <h4 className="font-bold text-sm text-[#1A3C20] leading-snug">
                  {cur.title}
                </h4>

                <p className="text-xs text-[#526053] mt-2 leading-relaxed line-clamp-2">
                  {cur.intro}
                </p>

                {/* Book Mini Previews */}
                <div className="mt-4 pt-3 border-t border-[#EBE5D8]">
                  <span className="text-[11px] font-bold text-[#526053] block mb-2">
                    포함된 큐레이션 도서 ({curatedBooks.length}권)
                  </span>
                  <div className="space-y-1.5">
                    {curatedBooks.map(book => (
                      <div
                        key={book.id}
                        onClick={() => onOpenBookDetail(book)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#EBE5D8] cursor-pointer transition-colors"
                      >
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-7 h-9 object-cover rounded-md border border-[#EBE5D8] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden flex-1">
                          <span className="text-xs font-bold text-[#1A3C20] block truncate">
                            {book.title}
                          </span>
                          <span className="text-[10px] text-[#526053] block truncate">
                            {book.author} · {book.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {cur.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] text-[#526053] bg-white px-2 py-0.5 rounded border border-[#EBE5D8]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Likes and Views Footer */}
              <div className="mt-4 pt-3 border-t border-[#EBE5D8] flex items-center justify-between text-xs">
                <span className="text-[#526053] flex items-center gap-1 text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  조회 {cur.views}회
                </span>

                <button
                  id={`like-curation-${cur.id}`}
                  onClick={(e) => handleLike(cur.id, e)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold transition-all ${
                    cur.isLiked 
                      ? 'bg-[#FFF3EB] border-[#FDC9A6] text-[#C2410C]' 
                      : 'bg-white border-[#EBE5D8] text-[#526053] hover:border-[#F28D52] hover:text-[#C2410C]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${cur.isLiked ? 'fill-[#C2410C]' : ''}`} />
                  <span>추천 투표 {cur.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Curation Modal */}
      {showCreateModal && (
        <div id="create-curation-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">
                  시민 큐레이터 테마 리스트 작성
                </h4>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">큐레이터 닉네임</label>
                <input
                  type="text"
                  value={newCuratorName}
                  onChange={(e) => setNewCuratorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">큐레이션 테마명</label>
                <input
                  type="text"
                  placeholder="예: 지친 현대인을 위한 과학과 인문학의 대화"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">게시글 제목</label>
                <input
                  type="text"
                  placeholder="예: 판교 직장인들이 뽑은 야근 후 읽기 좋은 책 3선"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">테마 소개글 및 선정 이유</label>
                <textarea
                  rows={3}
                  placeholder="이 책들을 함께 묶어 추천하게 된 배경을 이웃 시민들에게 소개해 주세요."
                  value={newIntro}
                  onChange={(e) => setNewIntro(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              {/* Book Picker */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  추천 도서 선택 (최대 5권, 현재 {selectedBookIds.length}권 선택됨)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {books.map(b => {
                    const isSelected = selectedBookIds.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        onClick={() => toggleSelectBookInModal(b.id)}
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-100 border-indigo-400 font-bold text-indigo-950' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => {}} 
                          className="rounded text-indigo-600"
                        />
                        <span className="truncate">{b.title} ({b.author})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  placeholder="예: 힐링, 판교, 야간독서, 인문학"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={selectedBookIds.length === 0}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:bg-slate-300"
                >
                  큐레이션 발행하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
