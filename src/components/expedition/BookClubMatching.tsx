import React, { useState } from 'react';
import { 
  Users, 
  Video, 
  MapPin, 
  Calendar, 
  Plus, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Heart, 
  Eye, 
  ExternalLink,
  Shield,
  Clock,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookClub } from '../../types';

interface BookClubMatchingProps {
  clubs: BookClub[];
  onJoinClub: (clubId: string) => void;
  onAddDiscussion: (clubId: string, content: string, isAnonymous: boolean) => void;
  onAddClub: (newClub: BookClub) => void;
}

export const BookClubMatching: React.FC<BookClubMatchingProps> = ({
  clubs,
  onJoinClub,
  onAddDiscussion,
  onAddClub,
}) => {
  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [discussionInput, setDiscussionInput] = useState('');
  const [isAnonymousPost, setIsAnonymousPost] = useState(true);

  // New Club Form State
  const [newTitle, setNewTitle] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('성남책벌레');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newFormat, setNewFormat] = useState<'온라인 화상' | '중원도서관 4층 세미나실' | '온·오프라인 하이브리드'>('온라인 화상');
  const [newMaxMembers, setNewMaxMembers] = useState(10);
  const [newDescription, setNewDescription] = useState('');

  const activeClub = clubs.find(c => c.id === selectedClubId) || clubs[0];

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim() || !activeClub) return;

    onAddDiscussion(activeClub.id, discussionInput, isAnonymousPost);
    setDiscussionInput('');

    try {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 }
      });
    } catch (e) {}
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBookTitle.trim()) return;

    const newClub: BookClub = {
      id: `club-${Date.now()}`,
      title: newTitle,
      leaderName: newLeaderName,
      leaderBadge: '성남 북클럽 리더',
      tag: '신규개설',
      bookTitle: newBookTitle,
      bookAuthor: newBookAuthor || '저자 미상',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      schedule: newSchedule || '매주 주말 (시간 협의)',
      format: newFormat,
      meetUrl: newFormat !== '중원도서관 4층 세미나실' ? 'https://meet.google.com/new-jw-club' : undefined,
      maxMembers: Number(newMaxMembers) || 8,
      currentMembers: 1,
      description: newDescription,
      isJoined: true,
      discussions: [
        {
          id: `disc-${Date.now()}`,
          author: newLeaderName,
          isAnonymous: false,
          content: '첫 모임 개설을 환영합니다! 책을 읽고 인상 깊었던 부분을 자유롭게 나눠요.',
          createdAt: '방금 전',
          likes: 1,
        }
      ],
    };

    onAddClub(newClub);
    setSelectedClubId(newClub.id);
    setShowCreateModal(false);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div id="book-club-matching-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#1A3C20] border border-[#5DA166]/30 mb-2">
            <Users className="w-3.5 h-3.5 text-[#5DA166]" />
            <span>독서 모임 & 북클럽 매칭</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A3C20]">
            성남시민과 함께 나누는 <span className="text-[#5DA166]">이용자 개설형 독서 모임</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#526053] mt-1">
            혼자 읽기 아쉬운 책을 함께 토론하고, 화상 모임 링크 및 익명 토론 게시판으로 부담 없이 소통하세요.
          </p>
        </div>

        {/* Create Club Button */}
        <button
          id="open-create-club-modal-btn"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#5DA166] hover:bg-[#488250] text-white text-xs font-bold shadow-md shadow-[#5DA166]/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>새 북클럽 개설하기</span>
        </button>
      </div>

      {/* Main Layout: Clubs List on Left + Selected Club Detail & Chatter on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Club List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-[#1A3C20] uppercase tracking-wider block mb-2">
            모집 중인 북클럽 목록 ({clubs.length}개)
          </span>

          {clubs.map((club) => {
            const isSelected = club.id === activeClub?.id;
            const isFull = club.currentMembers >= club.maxMembers;

            return (
              <div
                key={club.id}
                id={`club-item-${club.id}`}
                onClick={() => setSelectedClubId(club.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF5EC] border-[#5DA166] shadow-xs'
                    : 'bg-[#FDFBF7] border-[#EBE5D8] hover:border-[#5DA166]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF7F0] text-[#1A3C20] border border-[#EBE5D8]">
                      {club.format}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#526053]">
                      {club.currentMembers} / {club.maxMembers}명
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1A3C20] leading-snug">
                    {club.title}
                  </h4>
                  <p className="text-xs text-[#526053] mt-1">
                    선정도서: <strong className="text-[#1A3C20]">{club.bookTitle}</strong> ({club.bookAuthor})
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#EBE5D8] flex items-center justify-between text-[11px] text-[#526053]">
                  <span className="truncate">{club.schedule}</span>
                  {club.isJoined ? (
                    <span className="text-[#1A3C20] font-bold flex items-center gap-0.5 shrink-0 bg-[#EAF5EC] px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-[#5DA166]" />
                      참여 중
                    </span>
                  ) : isFull ? (
                    <span className="text-[#526053] font-bold shrink-0">마감</span>
                  ) : (
                    <span className="text-[#F28D52] font-bold shrink-0">모집 중</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Club Stage (7 cols) */}
        {activeClub && (
          <div className="lg:col-span-7 bg-[#FDFBF7] rounded-3xl p-6 border border-[#EBE5D8] flex flex-col justify-between">
            <div>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#1A3C20] text-white">
                      {activeClub.format}
                    </span>
                    <span className="text-xs font-semibold text-[#526053]">
                      리더: {activeClub.leaderName} ({activeClub.leaderBadge})
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-[#1A3C20]">
                    {activeClub.title}
                  </h4>
                </div>

                {/* Join Button */}
                <button
                  id={`join-club-btn-${activeClub.id}`}
                  onClick={() => onJoinClub(activeClub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 ${
                    activeClub.isJoined
                      ? 'bg-[#FFF3EB] hover:bg-[#FDC9A6] text-[#C2410C] border border-[#FDC9A6]'
                      : 'bg-[#5DA166] hover:bg-[#488250] text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {activeClub.isJoined ? '참여 중 (취소하기)' : '북클럽 신청하기'}
                  </span>
                </button>
              </div>

              {/* Meta details */}
              <div className="p-4 bg-white rounded-2xl border border-[#EBE5D8] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#2C3E2D]">
                  <Calendar className="w-4 h-4 text-[#5DA166] shrink-0" />
                  <span><strong>모임 일정:</strong> {activeClub.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C3E2D]">
                  <MapPin className="w-4 h-4 text-[#F28D52] shrink-0" />
                  <span><strong>모임 장소:</strong> {activeClub.format}</span>
                </div>
                {activeClub.meetUrl && (
                  <div className="flex items-center gap-2 text-[#1A3C20] font-medium">
                    <Video className="w-4 h-4 text-[#5DA166] shrink-0" />
                    <span><strong>화상 모임 링크:</strong> </span>
                    <a
                      href={activeClub.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-0.5 hover:text-[#5DA166] font-mono text-[11px] text-[#1A3C20]"
                    >
                      {activeClub.meetUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <p className="text-[#526053] pt-2 border-t border-[#EBE5D8] leading-relaxed">
                  {activeClub.description}
                </p>
              </div>

              {/* Anonymous Discussion Board */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#1A3C20] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#5DA166]" />
                    <span>소모임 전용 익명 토론 게시판 ({activeClub.discussions.length})</span>
                  </span>
                  <span className="text-[10px] text-[#526053]">부담 없이 자유로운 의견을 남겨보세요</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeClub.discussions.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-3 bg-white rounded-xl border border-[#EBE5D8] text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[#1A3C20] flex items-center gap-1">
                          {disc.isAnonymous ? '익명 회원' : disc.author}
                          {disc.isAnonymous && <span className="text-[9px] px-1.5 py-0.2 bg-[#FAF7F0] border border-[#EBE5D8] rounded text-[#526053]">익명</span>}
                        </span>
                        <span className="text-[10px] text-[#526053] font-mono">{disc.createdAt}</span>
                      </div>
                      <p className="text-[#2C3E2D] leading-relaxed">
                        {disc.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Discussion Input Form */}
            <form onSubmit={handlePostDiscussion} className="mt-4 pt-3 border-t border-[#EBE5D8]">
              <div className="flex items-center justify-between mb-2 text-xs">
                <label className="flex items-center gap-1.5 text-[#526053] cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isAnonymousPost}
                    onChange={(e) => setIsAnonymousPost(e.target.checked)}
                    className="rounded text-[#5DA166]"
                  />
                  <span>익명으로 게시하기</span>
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="북클럽 회원들과 나눌 한 줄 질문이나 감상을 적어주세요..."
                  value={discussionInput}
                  onChange={(e) => setDiscussionInput(e.target.value)}
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

      {/* Create Book Club Modal */}
      {showCreateModal && (
        <div id="create-club-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">
                  이용자 개설형 북클럽 모집 등록
                </h4>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">모임명 (북클럽 제목)</label>
                <input
                  type="text"
                  placeholder="예: 중원 인문학 함께 읽기 (매주 목요일)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">선정도서</label>
                  <input
                    type="text"
                    placeholder="예: 물고기는 존재하지 않는다"
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
                    placeholder="예: 룰루 밀러"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">모임 형태</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600 bg-white"
                  >
                    <option value="온라인 화상">온라인 화상 (Google Meet)</option>
                    <option value="중원도서관 4층 세미나실">중원도서관 4층 세미나실</option>
                    <option value="온·오프라인 하이브리드">온·오프라인 하이브리드</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">모집 정원 (명)</label>
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={newMaxMembers}
                    onChange={(e) => setNewMaxMembers(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">정기 모임 일정</label>
                <input
                  type="text"
                  placeholder="예: 격주 목요일 저녁 8시 (온라인 1시간)"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">모임 소개 및 진행 방식</label>
                <textarea
                  rows={3}
                  placeholder="어떤 분들과 함께 읽고 토론하고 싶은지 편안하게 설명해 주세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-indigo-600"
                  required
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  북클럽 개설하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
