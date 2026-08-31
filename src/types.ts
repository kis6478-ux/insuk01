export type PlatformMode = 'walk' | 'expedition';

export type BookCategory = 
  | 'picture_book' 
  | 'poetry' 
  | 'webtoon' 
  | 'short_essay' 
  | 'novel' 
  | 'humanities' 
  | 'science' 
  | 'art';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  category: BookCategory;
  categoryName: string;
  coverUrl: string;
  firstSentence: string;
  pageCount: number;
  readingTimeMinutes: number;
  summary: string;
  callNumber: string;
  location: string;
  totalCopies: number;
  availableCopies: number;
  tags: string[];
  difficulty: 'very_easy' | 'easy' | 'moderate' | 'deep';
  mood: string[];
  recommendReason?: string;
  isPopular?: boolean;
}

export interface MatchingQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    description: string;
    icon: string;
    preferredCategories: BookCategory[];
    tags: string[];
  }[];
}

export interface BlindQuoteCard {
  id: string;
  bookId: string;
  quote: string;
  hookTheme: string;
  emotionTag: string;
  readingTime: string;
  bgGradient: string;
}

export interface SnackChallenge {
  id: string;
  title: string;
  subtitle: string;
  category: 'daily' | 'weekly' | 'visit';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  claimed: boolean;
  rewardText: string;
  incentiveType: 'loan_expansion' | 'reservation_boost' | 'cultural_coupon';
  loanBonus: number;
  iconName: string;
}

export interface CardNewsSlide {
  title: string;
  content: string;
  highlight?: string;
  imageBg: string;
}

export interface CardNewsAudio {
  id: string;
  title: string;
  summary: string;
  bookTitle: string;
  author: string;
  durationSeconds: number;
  narrator: string;
  tags: string[];
  slides: CardNewsSlide[];
  audioScript: string;
  createdAt: string;
}

export interface CitizenCuration {
  id: string;
  title: string;
  curatorName: string;
  curatorTier: '골드 큐레이터' | '실버 큐레이터' | '중원 독서왕' | '성남 서포터즈';
  avatar: string;
  theme: string;
  intro: string;
  bookIds: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
  tags: string[];
}

export interface LoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  returnDueDate: string;
  status: 'borrowing' | 'returned' | 'overdue';
  genre: string;
  pageCount: number;
}

export interface ReadingNote {
  id: string;
  bookTitle: string;
  author: string;
  quote: string;
  reflection: string;
  rating: number;
  date: string;
  tags: string[];
  pageNumber?: string;
}

export interface BookClub {
  id: string;
  title: string;
  leaderName: string;
  leaderBadge: string;
  tag: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  schedule: string;
  format: '온라인 화상' | '중원도서관 4층 세미나실' | '온·오프라인 하이브리드';
  meetUrl?: string;
  maxMembers: number;
  currentMembers: number;
  description: string;
  isJoined: boolean;
  discussions: {
    id: string;
    author: string;
    isAnonymous: boolean;
    content: string;
    createdAt: string;
    likes: number;
  }[];
}

export interface ReadingThermometerData {
  totalTarget: number;
  currentReading: number;
  totalParticipants: number;
  donationTarget: number;
  donationMilestoneText: string;
  donationPartner: string;
  targetDate: string;
}

export interface RelayReview {
  id: string;
  reviewerName: string;
  isFirstTimer: boolean;
  comment: string;
  rating: number;
  date: string;
}

export interface RelayRecommendation {
  id: string;
  recommenderName: string;
  recommenderBadge: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  difficultyLevel: '입문자 강력추천' | '가볍게 읽기좋음' | '몰입도 최고';
  recReason: string;
  createdAt: string;
  reviews: RelayReview[];
}

export interface UserLibraryProfile {
  name: string;
  memberId: string;
  baseLoanLimit: number;
  extraBonusLoan: number;
  currentBorrowedCount: number;
  currentReservedCount: number;
  completedMissionsCount: number;
  readingTemperatureContribution: number;
}
