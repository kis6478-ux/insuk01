import React, { useState } from 'react';
import { 
  Library, 
  BarChart3, 
  PenTool, 
  BookOpen, 
  Sparkles, 
  Plus, 
  Star, 
  Clock, 
  Quote, 
  PieChart, 
  Calendar, 
  CheckCircle2,
  Trash2,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoanRecord, ReadingNote, Book } from '../../types';

interface DigitalBookshelfProps {
  loanRecords: LoanRecord[];
  readingNotes: ReadingNote[];
  books: Book[];
  onAddReadingNote: (note: ReadingNote) => void;
  onDeleteReadingNote: (noteId: string) => void;
  onOpenBookDetail: (book: Book) => void;
}

export const DigitalBookshelf: React.FC<DigitalBookshelfProps> = ({
  loanRecords,
  readingNotes,
  books,
  onAddReadingNote,
  onDeleteReadingNote,
  onOpenBookDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'notes' | 'loans'>('stats');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // New Note Form State
  const [noteBookTitle, setNoteBookTitle] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteQuote, setNoteQuote] = useState('');
  const [noteReflection, setNoteReflection] = useState('');
  const [noteRating, setNoteRating] = useState(5);
  const [notePage, setNotePage] = useState('');
  const [noteTags, setNoteTags] = useState('필사,감상평');

  // Statistics calculation
  const totalBorrowedCount = loanRecords.length;
  const returnedCount = loanRecords.filter(r => r.status === 'returned').length;
  const totalPagesRead = loanRecords.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);

  // Monthly reading stats mock data
  const monthlyStats = [
    { month: '4월', count: 2, height: '35%' },
    { month: '5월', count: 3, height: '50%' },
    { month: '6월', count: 4, height: '65%' },
    { month: '7월', count: 5, height: '80%' },
    { month: '8월 (현재)', count: 6, height: '100%' },
  ];

  // Genre breakdown stats
  const genreStats = [
    { name: '소설/문학', percentage: 38, count: 5, color: 'bg-indigo-600' },
    { name: '에세이/시', percentage: 28, count: 4, color: 'bg-emerald-500' },
    { name: '과학/인문', percentage: 22, count: 3, color: 'bg-amber-500' },
    { name: '그림책/웹툰', percentage: 12, count: 2, color: 'bg-rose-500' },
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBookTitle.trim() || !noteReflection.trim()) return;

    const newNote: ReadingNote = {
      id: `note-${Date.now()}`,
      bookTitle: noteBookTitle,
      author: noteAuthor || '저자 미상',
      quote: noteQuote,
      reflection: noteReflection,
      rating: noteRating,
      date: '2026.08.31',
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      pageNumber: notePage ? `p. ${notePage}` : undefined,
    };

    onAddReadingNote(newNote);
    setShowAddNoteModal(false);
    // Reset
    setNoteBookTitle('');
    setNoteAuthor('');
    setNoteQuote('');
    setNoteReflection('');
    setNoteRating(5);
    setNotePage('');

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div id="digital-bookshelf-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
            <Library className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>나만의 디지털 서재 & 독서 통계</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            성남시 대출 이력 연동 <span className="text-[#5DA166]">독서 인포그래픽 & 필사 메모장</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            중원도서관에서 대출한 책들의 기록이 자동으로 쌓이고, 인상 깊은 구절과 감상평을 영구 기록합니다.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center p-1 bg-[#FAF7F0] rounded-2xl border border-[#EBE5D8] self-start sm:self-auto text-xs">
          <button
            id="bookshelf-tab-stats"
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'stats' ? 'bg-[#1A3C20] text-white shadow-xs' : 'text-[#526053] hover:text-[#1A3C20]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>독서 통계</span>
          </button>
          <button
            id="bookshelf-tab-notes"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'notes' ? 'bg-[#1A3C20] text-white shadow-xs' : 'text-[#526053] hover:text-[#1A3C20]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>필사·감상 노트 ({readingNotes.length})</span>
          </button>
          <button
            id="bookshelf-tab-loans"
            onClick={() => setActiveTab('loans')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'loans' ? 'bg-[#1A3C20] text-white shadow-xs' : 'text-[#526053] hover:text-[#1A3C20]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>대출 이력 ({loanRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Statistics & Infographics */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#EBE5D8]">
              <span className="text-[11px] text-[#526053] font-semibold block">총 대출·완독 도서</span>
              <span className="text-2xl font-black text-[#1A3C20] mt-1 block">
                {totalBorrowedCount}권
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#EAF5EC] border border-[#5DA166]/30">
              <span className="text-[11px] text-[#2C3E2D] font-semibold block">총 누적 읽은 페이지</span>
              <span className="text-2xl font-black text-[#1A3C20] mt-1 block">
                {totalPagesRead.toLocaleString()}쪽
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FDC9A6]">
              <span className="text-[11px] text-[#C2410C] font-semibold block">남긴 필사·감상 노트</span>
              <span className="text-2xl font-black text-[#C2410C] mt-1 block">
                {readingNotes.length}편
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#EBE5D8]">
              <span className="text-[11px] text-[#526053] font-semibold block">연간 독서 목표 달성률</span>
              <span className="text-2xl font-black text-[#5DA166] mt-1 block">
                68% (목표 20권)
              </span>
            </div>
          </div>

          {/* Charts: Monthly Trend + Genre Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Monthly Trend (7 cols) */}
            <div className="md:col-span-7 bg-[#FDFBF7] p-5 rounded-2xl border border-[#EBE5D8]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1A3C20] flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#5DA166]" />
                  <span>2026년 월별 독서량 추이</span>
                </span>
                <span className="text-[11px] text-[#526053] font-medium">단위: 권/월</span>
              </div>

              {/* Bar Chart Representation */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                {monthlyStats.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-[#526053] group-hover:text-[#1A3C20] transition-colors font-mono">
                      {item.count}권
                    </span>
                    <div className="w-full bg-[#E2D9C8] rounded-t-xl overflow-hidden h-32 flex items-end">
                      <div 
                        className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                          idx === monthlyStats.length - 1 ? 'bg-[#5DA166]' : 'bg-[#7EBA86]'
                        }`}
                        style={{ height: item.height }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[#526053] whitespace-nowrap">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Breakdown (5 cols) */}
            <div className="md:col-span-5 bg-[#FDFBF7] p-5 rounded-2xl border border-[#EBE5D8] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#1A3C20] flex items-center gap-1.5 mb-3">
                  <PieChart className="w-4 h-4 text-[#5DA166]" />
                  <span>나의 독서 취향 장르 비율</span>
                </span>

                {/* Stacked Progress Bar */}
                <div className="h-4 w-full bg-[#E2D9C8] rounded-full overflow-hidden flex mb-4 shadow-inner">
                  {genreStats.map((g, idx) => (
                    <div 
                      key={idx}
                      className={`${g.color === 'bg-indigo-600' ? 'bg-[#1A3C20]' : g.color === 'bg-emerald-500' ? 'bg-[#5DA166]' : g.color === 'bg-amber-500' ? 'bg-[#F28D52]' : 'bg-[#C2410C]'} h-full`}
                      style={{ width: `${g.percentage}%` }}
                      title={`${g.name}: ${g.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend list */}
                <div className="space-y-2 text-xs">
                  {genreStats.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#EBE5D8]">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${g.color === 'bg-indigo-600' ? 'bg-[#1A3C20]' : g.color === 'bg-emerald-500' ? 'bg-[#5DA166]' : g.color === 'bg-amber-500' ? 'bg-[#F28D52]' : 'bg-[#C2410C]'}`} />
                        <span className="font-bold text-[#1A3C20]">{g.name}</span>
                      </div>
                      <span className="font-mono text-[#526053] font-bold">
                        {g.percentage}% ({g.count}권)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EBE5D8] text-[11px] text-[#526053]">
                💡 인문/과학 도서 비중이 지난달 대비 +8% 증가했습니다.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reading Notes & Transcription */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#526053] font-medium">
              총 {readingNotes.length}개의 기록된 감상과 필사 구절
            </span>
            <button
              id="open-add-note-modal-btn"
              onClick={() => setShowAddNoteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>새 독서노트 / 필사 작성</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingNotes.map((note) => (
              <div 
                key={note.id}
                className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#EBE5D8] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#1A3C20] leading-tight">
                        {note.bookTitle}
                      </h4>
                      <p className="text-xs text-[#526053]">
                        {note.author} {note.pageNumber && `· ${note.pageNumber}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star 
                          key={sIdx}
                          className={`w-3 h-3 ${sIdx < note.rating ? 'fill-[#F28D52] text-[#F28D52]' : 'text-[#E2D9C8]'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote Block */}
                  {note.quote && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-[#EBE5D8] text-xs text-[#1A3C20] font-serif italic relative">
                      <Quote className="w-3.5 h-3.5 text-[#F28D52] absolute top-2 right-2 opacity-50" />
                      {note.quote}
                    </div>
                  )}

                  {/* Reflection */}
                  <p className="text-xs text-[#2C3E2D] mt-3 leading-relaxed">
                    {note.reflection}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/20 px-2 py-0.5 rounded font-bold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EBE5D8] flex items-center justify-between text-[11px] text-[#526053]">
                  <span className="font-mono">{note.date} 기록됨</span>
                  <button
                    onClick={() => onDeleteReadingNote(note.id)}
                    className="p-1.5 rounded-lg hover:bg-[#FFF3EB] text-[#526053] hover:text-[#C2410C] transition-colors"
                    title="노트 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Loan History */}
      {activeTab === 'loans' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] text-[#1A3C20] font-bold border-b border-[#EBE5D8]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">도서명</th>
                  <th className="p-3.5">저자</th>
                  <th className="p-3.5">장르</th>
                  <th className="p-3.5">대출일자</th>
                  <th className="p-3.5">반납(예정)일</th>
                  <th className="p-3.5 rounded-r-xl">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5D8]">
                {loanRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#FAF7F0] transition-colors">
                    <td className="p-3.5 font-bold text-[#1A3C20]">{rec.bookTitle}</td>
                    <td className="p-3.5 text-[#526053]">{rec.author}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-[#FAF7F0] border border-[#EBE5D8] font-semibold text-[#1A3C20]">
                        {rec.genre}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#526053] font-mono">{rec.borrowDate}</td>
                    <td className="p-3.5 text-[#526053] font-mono">{rec.returnDueDate}</td>
                    <td className="p-3.5">
                      {rec.status === 'borrowing' ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30">
                          대출 중
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FAF7F0] text-[#526053]">
                          반납 완료
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Reading Note Modal */}
      {showAddNoteModal && (
        <div id="add-note-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">
                  독서노트 및 필사 메모 작성
                </h4>
              </div>
              <button 
                onClick={() => setShowAddNoteModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">도서명</label>
                  <input
                    type="text"
                    placeholder="예: 불편한 편의점"
                    value={noteBookTitle}
                    onChange={(e) => setNoteBookTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">저자</label>
                  <input
                    type="text"
                    placeholder="예: 김호연"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">필사할 인상 깊은 문장 (선택)</label>
                <textarea
                  rows={2}
                  placeholder="“가슴에 오래 남기고 싶은 책 속의 구절을 적어보세요.”"
                  value={noteQuote}
                  onChange={(e) => setNoteQuote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600 font-serif"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">나의 생각과 감상평</label>
                <textarea
                  rows={3}
                  placeholder="책을 읽고 느낀 점, 내 삶에 적용하고 싶은 깨달음을 자유롭게 기록하세요."
                  value={noteReflection}
                  onChange={(e) => setNoteReflection(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">평점 (별점)</label>
                  <select
                    value={noteRating}
                    onChange={(e) => setNoteRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600 bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5점 만점)</option>
                    <option value={4}>⭐⭐⭐⭐ (4점)</option>
                    <option value={3}>⭐⭐⭐ (3점)</option>
                    <option value={2}>⭐⭐ (2점)</option>
                    <option value={1}>⭐ (1점)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">기억할 페이지 번호</label>
                  <input
                    type="text"
                    placeholder="예: 142"
                    value={notePage}
                    onChange={(e) => setNotePage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">태그</label>
                <input
                  type="text"
                  placeholder="예: 인생문장, 힐링, 소통"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  노트 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
