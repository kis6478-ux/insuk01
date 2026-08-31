import React from 'react';
import { 
  Compass, 
  Crown, 
  Library, 
  Users, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { CitizenCuratorBoard } from './CitizenCuratorBoard';
import { DigitalBookshelf } from './DigitalBookshelf';
import { BookClubMatching } from './BookClubMatching';
import { 
  CitizenCuration, 
  LoanRecord, 
  ReadingNote, 
  BookClub, 
  Book, 
  UserLibraryProfile 
} from '../../types';

interface ExpeditionModeViewProps {
  curations: CitizenCuration[];
  loanRecords: LoanRecord[];
  readingNotes: ReadingNote[];
  clubs: BookClub[];
  books: Book[];
  userProfile: UserLibraryProfile;
  activeSection: string;
  onToggleLikeCuration: (curationId: string) => void;
  onAddCuration: (curation: CitizenCuration) => void;
  onAddReadingNote: (note: ReadingNote) => void;
  onDeleteReadingNote: (noteId: string) => void;
  onJoinClub: (clubId: string) => void;
  onAddDiscussion: (clubId: string, content: string, isAnonymous: boolean) => void;
  onAddClub: (club: BookClub) => void;
  onOpenBookDetail: (book: Book) => void;
}

export const ExpeditionModeView: React.FC<ExpeditionModeViewProps> = ({
  curations,
  loanRecords,
  readingNotes,
  clubs,
  books,
  userProfile,
  activeSection,
  onToggleLikeCuration,
  onAddCuration,
  onAddReadingNote,
  onDeleteReadingNote,
  onJoinClub,
  onAddDiscussion,
  onAddClub,
  onOpenBookDetail,
}) => {
  return (
    <div id="expedition-mode-container" className="space-y-10 animate-in fade-in duration-300">
      {/* Intro Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#1A3C20] text-white relative overflow-hidden shadow-lg border border-[#2D6638]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#5DA166]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-xs text-white border border-white/20 mb-3">
            <span>🧭</span>
            <span>애독자를 위한 중원도서관 탐험 모드</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            독서의 지평을 넓히는 <br className="hidden sm:inline" />
            <span className="text-[#F28D52]">기록과 소통, 그리고 큐레이션</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2.5 leading-relaxed">
            나만의 디지털 서재로 대출 통계를 한눈에 확인하고, 시민 큐레이터로서 테마 서가를 만들며, 성남시민들과 함께하는 북클럽에서 깊이 있는 토론을 펼쳐보세요.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-[#122A16] px-3.5 py-1.5 rounded-xl border border-[#254C2D] text-white">
              <Crown className="w-4 h-4 text-[#F28D52]" />
              <span>시민 큐레이터 테마 게시판</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#122A16] px-3.5 py-1.5 rounded-xl border border-[#254C2D] text-white">
              <Library className="w-4 h-4 text-[#5DA166]" />
              <span>월별 독서량 & 장르 인포그래픽</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#122A16] px-3.5 py-1.5 rounded-xl border border-[#254C2D] text-white">
              <Users className="w-4 h-4 text-emerald-300" />
              <span>소모임 전용 익명 토론</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Citizen Curator Board (2.3 시민 큐레이터 게시판) */}
      {(activeSection === 'all' || activeSection === 'curator') && (
        <section id="section-curator-board">
          <CitizenCuratorBoard
            curations={curations}
            books={books}
            onToggleLike={onToggleLikeCuration}
            onAddCuration={onAddCuration}
            onOpenBookDetail={onOpenBookDetail}
          />
        </section>
      )}

      {/* 2. Digital Bookshelf & Reading Stats (2.3 나만의 디지털 서재) */}
      {(activeSection === 'all' || activeSection === 'bookshelf') && (
        <section id="section-digital-bookshelf">
          <DigitalBookshelf
            loanRecords={loanRecords}
            readingNotes={readingNotes}
            books={books}
            onAddReadingNote={onAddReadingNote}
            onDeleteReadingNote={onDeleteReadingNote}
            onOpenBookDetail={onOpenBookDetail}
          />
        </section>
      )}

      {/* 3. Book Club Matching (2.3 독서 모임 매칭) */}
      {(activeSection === 'all' || activeSection === 'club') && (
        <section id="section-book-club">
          <BookClubMatching
            clubs={clubs}
            onJoinClub={onJoinClub}
            onAddDiscussion={onAddDiscussion}
            onAddClub={onAddClub}
          />
        </section>
      )}

      {/* 4. Deep Exploration Recommended Books */}
      {activeSection === 'all' && (
        <section id="section-deep-reading-grid" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
                <Compass className="w-3.5 h-3.5 text-[#5DA166]" />
                <span>탐험 모드 심층 서가</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
                중원도서관 <span className="text-[#5DA166]">심화 탐구 추천 도서</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#526053] mt-1">
                사유의 깊이를 더해주는 인문·과학·장편 문학 소장 도서입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {books.filter(b => ['novel', 'humanities', 'science'].includes(b.category) || b.difficulty === 'deep' || b.difficulty === 'moderate').map(book => (
              <div
                key={book.id}
                id={`exp-book-card-${book.id}`}
                onClick={() => onOpenBookDetail(book)}
                className="group bg-[#FDFBF7] rounded-2xl border border-[#EBE5D8] overflow-hidden hover:border-[#5DA166] hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative bg-[#FAF7F0]">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1A3C20]/90 text-white backdrop-blur-xs">
                    {book.pageCount}쪽
                  </div>
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#5DA166] text-white">
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
                    <span className="text-[#526053] group-hover:text-[#1A3C20] font-semibold flex items-center gap-0.5">
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
