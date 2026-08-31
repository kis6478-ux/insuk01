import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  WalkModeView 
} from './components/walk/WalkModeView';
import { 
  ExpeditionModeView 
} from './components/expedition/ExpeditionModeView';
import { 
  ReadingThermometer 
} from './components/ReadingThermometer';
import { 
  RelayRecommendationBoard 
} from './components/common/RelayRecommendationBoard';
import { 
  DiagnosticModal 
} from './components/DiagnosticModal';
import { 
  BookDetailModal 
} from './components/BookDetailModal';
import { 
  LibraryCardModal 
} from './components/LibraryCardModal';
import { 
  INITIAL_USER_PROFILE,
  INITIAL_BOOKS,
  SNACK_CHALLENGES,
  CARD_NEWS_LIST,
  CITIZEN_CURATIONS,
  INITIAL_LOAN_RECORDS,
  INITIAL_READING_NOTES,
  INITIAL_BOOK_CLUBS,
  READING_THERMOMETER,
  INITIAL_RELAY_RECOMMENDATIONS
} from './data/mockData';
import { 
  PlatformMode, 
  Book, 
  SnackChallenge, 
  CardNewsAudio, 
  CitizenCuration, 
  LoanRecord, 
  ReadingNote, 
  BookClub, 
  ReadingThermometerData, 
  RelayRecommendation, 
  RelayReview, 
  UserLibraryProfile 
} from './types';
import { 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Phone, 
  MapPin, 
  Clock, 
  Info,
  Layers,
  ArrowUp
} from 'lucide-react';

export default function App() {
  // Mode state: 'walk' (산책 모드 - 비독자) or 'expedition' (탐험 모드 - 애독자)
  const [currentMode, setCurrentMode] = useState<PlatformMode>('walk');
  const [activeSection, setActiveSection] = useState<string>('all');

  // Modals state
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isLibraryCardOpen, setIsLibraryCardOpen] = useState(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);

  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App Data State
  const [userProfile, setUserProfile] = useState<UserLibraryProfile>(() => {
    const saved = localStorage.getItem('jw_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('jw_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [challenges, setChallenges] = useState<SnackChallenge[]>(() => {
    const saved = localStorage.getItem('jw_challenges');
    return saved ? JSON.parse(saved) : SNACK_CHALLENGES;
  });

  const [cardNewsList, setCardNewsList] = useState<CardNewsAudio[]>(() => {
    const saved = localStorage.getItem('jw_card_news');
    return saved ? JSON.parse(saved) : CARD_NEWS_LIST;
  });

  const [curations, setCurations] = useState<CitizenCuration[]>(() => {
    const saved = localStorage.getItem('jw_curations');
    return saved ? JSON.parse(saved) : CITIZEN_CURATIONS;
  });

  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('jw_loan_records');
    return saved ? JSON.parse(saved) : INITIAL_LOAN_RECORDS;
  });

  const [readingNotes, setReadingNotes] = useState<ReadingNote[]>(() => {
    const saved = localStorage.getItem('jw_reading_notes');
    return saved ? JSON.parse(saved) : INITIAL_READING_NOTES;
  });

  const [clubs, setClubs] = useState<BookClub[]>(() => {
    const saved = localStorage.getItem('jw_clubs');
    return saved ? JSON.parse(saved) : INITIAL_BOOK_CLUBS;
  });

  const [thermometerData, setThermometerData] = useState<ReadingThermometerData>(() => {
    const saved = localStorage.getItem('jw_thermometer');
    return saved ? JSON.parse(saved) : READING_THERMOMETER;
  });

  const [relayList, setRelayList] = useState<RelayRecommendation[]>(() => {
    const saved = localStorage.getItem('jw_relay');
    return saved ? JSON.parse(saved) : INITIAL_RELAY_RECOMMENDATIONS;
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('jw_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('jw_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('jw_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('jw_card_news', JSON.stringify(cardNewsList));
  }, [cardNewsList]);

  useEffect(() => {
    localStorage.setItem('jw_curations', JSON.stringify(curations));
  }, [curations]);

  useEffect(() => {
    localStorage.setItem('jw_loan_records', JSON.stringify(loanRecords));
  }, [loanRecords]);

  useEffect(() => {
    localStorage.setItem('jw_reading_notes', JSON.stringify(readingNotes));
  }, [readingNotes]);

  useEffect(() => {
    localStorage.setItem('jw_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('jw_thermometer', JSON.stringify(thermometerData));
  }, [thermometerData]);

  useEffect(() => {
    localStorage.setItem('jw_relay', JSON.stringify(relayList));
  }, [relayList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers for Snack Challenge
  const handleClaimReward = (challengeId: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        return { ...ch, claimed: true };
      }
      return ch;
    }));

    // Update user profile bonus loan capacity
    setUserProfile(prev => ({
      ...prev,
      extraBonusLoan: prev.extraBonusLoan + 1,
      completedMissionsCount: prev.completedMissionsCount + 1,
      readingTemperatureContribution: prev.readingTemperatureContribution + 1,
    }));

    showToast('🎉 스낵 챌린지 인센티브가 반영되었습니다! (성남시 도서관 대출 한도 +1권 확대)');
  };

  const handleIncrementProgress = (challengeId: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        const nextVal = ch.current + 1;
        const isDone = nextVal >= ch.target;
        return { ...ch, current: nextVal, completed: isDone };
      }
      return ch;
    }));
    showToast('미션 실천이 기록되었습니다!');
  };

  const handleAddChallenge = (newCh: Omit<SnackChallenge, 'id' | 'completed' | 'claimed'>) => {
    const created: SnackChallenge = {
      ...newCh,
      id: `snack-${Date.now()}`,
      completed: false,
      claimed: false,
    };
    setChallenges(prev => [created, ...prev]);
    showToast('새로운 나만의 스낵 챌린지가 등록되었습니다!');
  };

  // Handlers for Book Borrow / Reserve
  const handleBorrowOrReserve = (book: Book) => {
    // Check if limit reached
    const totalAllowed = userProfile.baseLoanLimit + userProfile.extraBonusLoan;
    const currentBorrowing = loanRecords.filter(r => r.status === 'borrowing');

    if (currentBorrowing.length >= totalAllowed) {
      showToast(`대출 가능한 한도(${totalAllowed}권)를 초과했습니다. 스낵 챌린지로 한도를 늘려보세요!`);
      return;
    }

    const newLoan: LoanRecord = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      author: book.author,
      borrowDate: '2026.08.31',
      returnDueDate: '2026.09.14',
      status: 'borrowing',
      genre: book.categoryName,
      pageCount: book.pageCount,
    };

    setLoanRecords(prev => [newLoan, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      currentBorrowedCount: prev.currentBorrowedCount + 1,
    }));

    // Decrease available copy in book
    setBooks(prev => prev.map(b => {
      if (b.id === book.id) {
        return { ...b, availableCopies: Math.max(0, b.availableCopies - 1) };
      }
      return b;
    }));

    showToast(`📚 《${book.title}》 대출 예약이 완료되었습니다. (중원도서관 소장위치: ${book.location})`);
  };

  const handleRenewLoan = (loanId: string) => {
    setLoanRecords(prev => prev.map(l => {
      if (l.id === loanId) {
        return { ...l, returnDueDate: '2026.09.21 (7일 연장됨)' };
      }
      return l;
    }));
    showToast('대출 기간이 7일 연장되었습니다.');
  };

  // Handlers for Citizen Curation
  const handleToggleLikeCuration = (curationId: string) => {
    setCurations(prev => prev.map(cur => {
      if (cur.id === curationId) {
        const nextLiked = !cur.isLiked;
        return {
          ...cur,
          isLiked: nextLiked,
          likes: nextLiked ? cur.likes + 1 : cur.likes - 1,
        };
      }
      return cur;
    }));
  };

  const handleAddCuration = (newCur: CitizenCuration) => {
    setCurations(prev => [newCur, ...prev]);
    showToast('새 테마 큐레이션이 등록되었습니다!');
  };

  // Handlers for Digital Bookshelf Notes
  const handleAddReadingNote = (newNote: ReadingNote) => {
    setReadingNotes(prev => [newNote, ...prev]);
    showToast('새 독서노트 및 필사 메모가 안전하게 저장되었습니다.');
  };

  const handleDeleteReadingNote = (noteId: string) => {
    setReadingNotes(prev => prev.filter(n => n.id !== noteId));
    showToast('독서노트가 삭제되었습니다.');
  };

  // Handlers for Book Clubs
  const handleJoinClub = (clubId: string) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        const nextJoined = !c.isJoined;
        return {
          ...c,
          isJoined: nextJoined,
          currentMembers: nextJoined ? c.currentMembers + 1 : c.currentMembers - 1,
        };
      }
      return c;
    }));
    showToast('북클럽 참여 상태가 업데이트되었습니다.');
  };

  const handleAddDiscussion = (clubId: string, content: string, isAnonymous: boolean) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          discussions: [
            ...c.discussions,
            {
              id: `disc-${Date.now()}`,
              author: isAnonymous ? '익명 회원' : userProfile.name,
              isAnonymous,
              content,
              createdAt: '방금 전',
              likes: 0,
            }
          ]
        };
      }
      return c;
    }));
    showToast('소모임 익명 게시판에 의견이 등록되었습니다.');
  };

  const handleAddClub = (newClub: BookClub) => {
    setClubs(prev => [newClub, ...prev]);
    showToast('새로운 북클럽 모집이 시작되었습니다!');
  };

  // Handlers for Reading Thermometer
  const handleContributeReading = () => {
    setThermometerData(prev => ({
      ...prev,
      currentReading: prev.currentReading + 1,
      totalParticipants: prev.totalParticipants + 1,
    }));
    setUserProfile(prev => ({
      ...prev,
      readingTemperatureContribution: prev.readingTemperatureContribution + 1,
    }));
    showToast('🎉 완독 인증으로 중원도서관 독서 온도가 상승했습니다! (지역 기부 누적)');
  };

  // Handlers for Relay Recommendations
  const handleAddRelayReview = (relayId: string, review: RelayReview) => {
    setRelayList(prev => prev.map(r => {
      if (r.id === relayId) {
        return {
          ...r,
          reviews: [review, ...r.reviews]
        };
      }
      return r;
    }));
    showToast('비독자 릴레이 한 줄 리뷰가 등록되었습니다!');
  };

  const handleAddRelayRecommendation = (newRec: RelayRecommendation) => {
    setRelayList(prev => [newRec, ...prev]);
    showToast('애독자 입문 도서 릴레이 추천이 등록되었습니다!');
  };

  // Font size multiplier class
  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-[1.08rem] leading-relaxed';
    if (fontSize === 'xlarge') return 'text-[1.18rem] leading-loose';
    return '';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${highContrast ? 'bg-slate-950 text-slate-100' : 'bg-[#FDFBF7] text-[#1A3C20]'} ${getFontSizeClass()}`}>
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div id="app-toast-alert" className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#1A3C20] backdrop-blur-md text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl shadow-2xl border border-[#5DA166]/50 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F28D52] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Header with Mode Switcher & Tools */}
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => {
          setCurrentMode(mode);
          setActiveSection('all');
          showToast(mode === 'walk' ? '🌱 산책 모드(비독자·입문)로 전환되었습니다.' : '🧭 탐험 모드(애독자·심화)로 전환되었습니다.');
        }}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenLibraryCard={() => setIsLibraryCardOpen(true)}
        userProfile={userProfile}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        
        {/* Conditional Mode Views */}
        {activeSection !== 'relay' && activeSection !== 'thermometer' && (
          <>
            {currentMode === 'walk' ? (
              <WalkModeView
                books={books}
                challenges={challenges}
                cardNewsList={cardNewsList}
                userProfile={userProfile}
                activeSection={activeSection}
                onOpenBookDetail={(b) => setSelectedBookForDetail(b)}
                onClaimReward={handleClaimReward}
                onIncrementProgress={handleIncrementProgress}
                onAddChallenge={handleAddChallenge}
                onAddCardNews={(nc) => {
                  setCardNewsList(prev => [nc, ...prev]);
                  showToast('관리자 카드뉴스가 등록되었습니다.');
                }}
                onOpenLibraryCard={() => setIsLibraryCardOpen(true)}
              />
            ) : (
              <ExpeditionModeView
                curations={curations}
                loanRecords={loanRecords}
                readingNotes={readingNotes}
                clubs={clubs}
                books={books}
                userProfile={userProfile}
                activeSection={activeSection}
                onToggleLikeCuration={handleToggleLikeCuration}
                onAddCuration={handleAddCuration}
                onAddReadingNote={handleAddReadingNote}
                onDeleteReadingNote={handleDeleteReadingNote}
                onJoinClub={handleJoinClub}
                onAddDiscussion={handleAddDiscussion}
                onAddClub={handleAddClub}
                onOpenBookDetail={(b) => setSelectedBookForDetail(b)}
              />
            )}
          </>
        )}

        {/* 2.4 통합 소통 기능: Relay Recommendation Board */}
        {(activeSection === 'all' || activeSection === 'relay') && (
          <section id="section-relay-recommendation">
            <RelayRecommendationBoard
              relayList={relayList}
              books={books}
              onAddReview={handleAddRelayReview}
              onAddRecommendation={handleAddRelayRecommendation}
              onOpenBookDetail={(b) => setSelectedBookForDetail(b)}
            />
          </section>
        )}

        {/* 2.4 통합 소통 기능: Reading Thermometer */}
        {(activeSection === 'all' || activeSection === 'thermometer') && (
          <section id="section-reading-thermometer">
            <ReadingThermometer
              data={thermometerData}
              userContribution={userProfile.readingTemperatureContribution}
              onContributeReading={handleContributeReading}
            />
          </section>
        )}
      </main>

      {/* Footer & Library Physical Information */}
      <footer className="bg-[#1A3C20] text-[#EBE5D8] text-xs mt-20 border-t border-[#244E2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#5DA166] text-white flex items-center justify-center font-black text-xs">
                  중원
                </div>
                <span className="text-sm font-black text-white tracking-tight">
                  성남시립 중원도서관
                </span>
              </div>
              <p className="text-[#EBE5D8]/80 leading-relaxed text-xs">
                성남시 중원도서관은 모든 시민이 독서의 즐거움을 누릴 수 있도록 비독자를 위한 <strong>산책 모드</strong>와 애독자를 위한 <strong>탐험 모드</strong> 맞춤형 UX 서비스를 제공합니다.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-[#7EBA86] pt-2">
                <span>웹 접근성 표준(WAHY) 준수</span>
                <span>·</span>
                <span>성남시립도서관 통합대출시스템 연동</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">
                이용 안내
              </span>
              <div className="space-y-1.5 text-[#EBE5D8]/80 text-xs">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5DA166] shrink-0" />
                  경기도 성남시 중원구 원터로 17번길 46
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5DA166] shrink-0" />
                  종합자료실: 평일 09:00 ~ 22:00 / 주말 09:00 ~ 18:00
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#5DA166] shrink-0" />
                  대표전화: 031-752-3913
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">
                빠른 메뉴
              </span>
              <div className="flex flex-col space-y-1.5 text-[#EBE5D8]/80 text-xs">
                <button 
                  onClick={() => { setCurrentMode('walk'); setActiveSection('all'); }} 
                  className="text-left hover:text-[#5DA166] transition-colors"
                >
                  🌱 산책 모드 (취향 매칭 · 첫 문장)
                </button>
                <button 
                  onClick={() => { setCurrentMode('expedition'); setActiveSection('all'); }} 
                  className="text-left hover:text-[#7EBA86] transition-colors"
                >
                  🧭 탐험 모드 (시민 큐레이터 · 북클럽)
                </button>
                <button 
                  onClick={() => setIsDiagnosticOpen(true)} 
                  className="text-left hover:text-[#F28D52] transition-colors"
                >
                  ✨ 독서 성향 진단 (3초 테스트)
                </button>
                <button 
                  onClick={() => setIsLibraryCardOpen(true)} 
                  className="text-left hover:text-white transition-colors"
                >
                  💳 성남시 모바일 도서관 회원증
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#EBE5D8]/60">
            <p>© 2026 Seongnam City Jungwon Public Library. All rights reserved.</p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#EBE5D8]/80 hover:text-white transition-colors"
            >
              <span>맨 위로</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>

      {/* 2.1 진입 화면: 초기 성향 진단 모달 */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveSection('all');
          showToast(`진단 결과에 따라 ${mode === 'walk' ? '‘산책 모드(비독자)’' : '‘탐험 모드(애독자)’'}로 전환되었습니다!`);
        }}
      />

      {/* Book Loan Detail Modal */}
      <BookDetailModal
        book={selectedBookForDetail}
        isOpen={!!selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onBorrowOrReserve={handleBorrowOrReserve}
        isAlreadyBorrowed={loanRecords.some(r => r.bookId === selectedBookForDetail?.id && r.status === 'borrowing')}
      />

      {/* Digital Library Card Modal */}
      <LibraryCardModal
        isOpen={isLibraryCardOpen}
        onClose={() => setIsLibraryCardOpen(false)}
        userProfile={userProfile}
        loanRecords={loanRecords}
        onRenewLoan={handleRenewLoan}
        onNavigateToChallenges={() => {
          setCurrentMode('walk');
          setActiveSection('challenge');
        }}
      />
    </div>
  );
}
