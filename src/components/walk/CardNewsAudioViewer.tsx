import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  X, 
  CheckCircle2, 
  Upload, 
  Volume2, 
  BookOpen, 
  Layers
} from 'lucide-react';
import { CardNewsAudio, CardNewsSlide } from '../../types';

interface CardNewsAudioViewerProps {
  cardNewsList: CardNewsAudio[];
  onAddCardNews: (newCard: CardNewsAudio) => void;
}

export const CardNewsAudioViewer: React.FC<CardNewsAudioViewerProps> = ({
  cardNewsList,
  onAddCardNews,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>(cardNewsList[0]?.id || '');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showAdminUploadModal, setShowAdminUploadModal] = useState<boolean>(false);

  // Admin upload form state
  const [newTitle, setNewTitle] = useState('');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newNarrator, setNewNarrator] = useState('중원도서관 큐레이션팀');
  const [newAudioScript, setNewAudioScript] = useState('');
  const [slide1Title, setSlide1Title] = useState('');
  const [slide1Content, setSlide1Content] = useState('');
  const [slide2Title, setSlide2Title] = useState('');
  const [slide2Content, setSlide2Content] = useState('');

  const currentCard = cardNewsList.find(c => c.id === selectedCardId) || cardNewsList[0];

  // Speech synthesis audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return 0;
          }
          return prev + 1;
        });
      }, (currentCard.durationSeconds * 10) / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentCard, playbackSpeed]);

  const togglePlayAudio = () => {
    if (!isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentCard.audioScript);
        utterance.lang = 'ko-KR';
        utterance.rate = playbackSpeed;
        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    }
  };

  const handleResetAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < currentCard.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleCreateAdminNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBookTitle.trim()) return;

    const slides: CardNewsSlide[] = [
      {
        title: slide1Title || '도서관이 건네는 첫 이야기',
        content: slide1Content || newSummary,
        highlight: '핵심 미리보기',
        imageBg: 'from-emerald-100 to-teal-200',
      },
      {
        title: slide2Title || '책 속의 울림',
        content: slide2Content || newAudioScript.slice(0, 100),
        highlight: '오늘의 추천 포인트',
        imageBg: 'from-amber-100 to-rose-200',
      }
    ];

    const newItem: CardNewsAudio = {
      id: `card-${Date.now()}`,
      title: newTitle,
      summary: newSummary,
      bookTitle: newBookTitle,
      author: newAuthor || '저자 미상',
      durationSeconds: 180,
      narrator: newNarrator,
      tags: ['신규업로드', '관리자추천', '3분요약'],
      slides,
      audioScript: newAudioScript || newSummary,
      createdAt: '2026.08.31',
    };

    onAddCardNews(newItem);
    setSelectedCardId(newItem.id);
    setCurrentSlideIndex(0);
    setShowAdminUploadModal(false);
    // Reset form
    setNewTitle('');
    setNewBookTitle('');
    setNewAuthor('');
    setNewSummary('');
    setNewAudioScript('');
  };

  return (
    <div id="card-news-audio-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
            <Headphones className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>3분 카드뉴스 & 오디오 뷰어</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            글 읽기가 부담스러울 땐, <span className="text-[#5DA166]">3분 요약 카드뉴스 & 사서 오디오</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            중원도서관 사서가 직접 들려주는 생생한 목소리와 슬라이드로 핵심 내용을 빠르게 파악하세요.
          </p>
        </div>

        {/* Admin Upload Trigger */}
        <button
          id="open-admin-cardnews-modal-btn"
          onClick={() => setShowAdminUploadModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#1A3C20] hover:bg-[#122A16] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5 text-[#5DA166]" />
          <span>사서/관리자 업로드</span>
        </button>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {cardNewsList.map((item) => (
          <button
            key={item.id}
            id={`cardnews-tab-${item.id}`}
            onClick={() => {
              setSelectedCardId(item.id);
              setCurrentSlideIndex(0);
              handleResetAudio();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${
              item.id === currentCard.id
                ? 'bg-[#1A3C20] text-white border-[#1A3C20] shadow-sm'
                : 'bg-[#FDFBF7] hover:bg-[#F3EFE6] text-[#526053] border-[#EBE5D8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>《{item.bookTitle}》 3분 컷</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage: Split Card Slide + Audio Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Mobile-optimized Card News Carousel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative">
            {/* Slide Frame */}
            <div 
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FAF7F0] to-[#F3EFE6] border border-[#EBE5D8] shadow-md min-h-[300px] sm:min-h-[340px] flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#1A3C20] shadow-2xs border border-[#EBE5D8]">
                    {currentCard.slides[currentSlideIndex]?.highlight || '핵심 하이라이트'}
                  </span>
                  <span className="text-xs font-bold text-[#526053] bg-white px-2.5 py-0.5 rounded-md border border-[#EBE5D8]">
                    {currentSlideIndex + 1} / {currentCard.slides.length}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-[#1A3C20] leading-snug">
                  {currentCard.slides[currentSlideIndex]?.title}
                </h4>

                <p className="text-sm sm:text-base text-[#2C3E2D] font-medium mt-4 leading-relaxed bg-white/80 p-4 rounded-2xl backdrop-blur-xs border border-[#EBE5D8]">
                  {currentCard.slides[currentSlideIndex]?.content}
                </p>
              </div>

              {/* Slide Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EBE5D8]">
                <button
                  id="slide-prev-btn"
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`p-2.5 rounded-xl border border-[#EBE5D8] bg-white text-[#1A3C20] transition-colors ${
                    currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#FAF7F0]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {currentCard.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-6 bg-[#5DA166]' : 'w-2 bg-[#E2D9C8]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  id="slide-next-btn"
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === currentCard.slides.length - 1}
                  className={`p-2.5 rounded-xl border border-[#EBE5D8] bg-white text-[#1A3C20] transition-colors ${
                    currentSlideIndex === currentCard.slides.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#FAF7F0]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Audio Player & Voice Narration info (5 cols) */}
        <div className="lg:col-span-5 bg-[#1A3C20] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl border border-[#2D6638]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#5DA166] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#5DA166]">
                  사서 낭독 오디오북 (3분)
                </span>
              </div>
              <span className="text-xs text-emerald-200/80 font-mono">
                {currentCard.createdAt}
              </span>
            </div>

            <h4 className="text-lg font-black text-white leading-tight">
              {currentCard.title}
            </h4>
            <p className="text-xs text-emerald-100/80 mt-1">
              낭독: <strong className="text-white">{currentCard.narrator}</strong>
            </p>

            {/* Transcript Preview */}
            <div className="mt-4 p-3.5 bg-[#122A16] rounded-2xl border border-[#254C2D] text-xs text-emerald-100/90 leading-relaxed max-h-36 overflow-y-auto">
              <span className="text-[10px] font-bold text-[#5DA166] uppercase block mb-1">오디오 대본 미리보기</span>
              {currentCard.audioScript}
            </div>
          </div>

          {/* Player Controls */}
          <div className="mt-6 pt-4 border-t border-[#254C2D]">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1.5 font-mono">
              <span>{Math.floor((playbackProgress * currentCard.durationSeconds) / 100)}초</span>
              <span>약 {currentCard.durationSeconds}초</span>
            </div>

            <div className="h-1.5 w-full bg-[#122A16] rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-[#5DA166] to-[#F28D52] rounded-full transition-all duration-200"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Speed Toggle */}
              <div className="flex items-center gap-1 bg-[#122A16] rounded-xl p-1 text-[11px] font-mono border border-[#254C2D]">
                {[1.0, 1.2, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${
                      playbackSpeed === spd ? 'bg-[#5DA166] text-white font-bold' : 'text-emerald-300 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Main Play/Pause Button */}
              <div className="flex items-center gap-2">
                <button
                  id="reset-audio-btn"
                  onClick={handleResetAudio}
                  className="p-2 rounded-full hover:bg-[#122A16] text-emerald-300 hover:text-white transition-colors"
                  title="처음부터 재생"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  id="toggle-audio-play-btn"
                  onClick={togglePlayAudio}
                  className="w-12 h-12 rounded-2xl bg-[#5DA166] hover:bg-[#488250] text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-[#5DA166]/30 transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Upload Modal (관리자 카드뉴스/오디오 업로드) */}
      {showAdminUploadModal && (
        <div id="admin-upload-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">
                  사서/관리자 3분 카드뉴스 & 오디오 등록
                </h4>
              </div>
              <button 
                onClick={() => setShowAdminUploadModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminNews} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">카드뉴스 제목</label>
                <input
                  id="admin-card-title-input"
                  type="text"
                  placeholder="예: 3분 컷! 마음이 지친 당신을 위한 위로 시집"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">도서명</label>
                  <input
                    type="text"
                    placeholder="예: 꽃을 보듯 너를 본다"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">저자</label>
                  <input
                    type="text"
                    placeholder="예: 나태주"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">핵심 한 줄 요약</label>
                <input
                  type="text"
                  placeholder="예: 3분 동안 음미하는 서툰 하루의 따뜻한 위로"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">사서 낭독 오디오 대본 (TTS 낭독 자동 연동)</label>
                <textarea
                  rows={3}
                  placeholder="안녕하세요, 중원도서관 사서입니다. 오늘 소개해드릴 책은..."
                  value={newAudioScript}
                  onChange={(e) => setNewAudioScript(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">슬라이드 카드 구성</span>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">슬라이드 1 제목 & 본문</label>
                  <input
                    type="text"
                    placeholder="슬라이드 1 소제목"
                    value={slide1Title}
                    onChange={(e) => setSlide1Title(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 mb-1.5 bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="슬라이드 1 설명 내용"
                    value={slide1Content}
                    onChange={(e) => setSlide1Content(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  카드뉴스 발행하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
