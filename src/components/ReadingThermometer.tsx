import React, { useState } from 'react';
import { 
  Flame, 
  Heart, 
  Gift, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingThermometerData } from '../types';

interface ReadingThermometerProps {
  data: ReadingThermometerData;
  userContribution: number;
  onContributeReading: () => void;
}

export const ReadingThermometer: React.FC<ReadingThermometerProps> = ({
  data,
  userContribution,
  onContributeReading,
}) => {
  const [hasContributedToday, setHasContributedToday] = useState(false);

  const percentage = Math.min(100, Math.round((data.currentReading / data.totalTarget) * 1000) / 10);
  const donationPercentage = Math.min(100, Math.round((data.currentReading / data.donationTarget) * 1000) / 10);
  const remainingForDonation = Math.max(0, data.donationTarget - data.currentReading);

  const handleContribute = () => {
    onContributeReading();
    setHasContributedToday(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  return (
    <div id="reading-thermometer-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-xs relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#5DA166]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF7F0] text-[#1A3C20] border border-[#EBE5D8] mb-3">
            <Flame className="w-3.5 h-3.5 text-[#F28D52] animate-bounce" />
            <span>중원도서관 시민 통합 독서 온도계</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1A3C20] tracking-tight">
            성남시민과 함께 채우는 <span className="text-[#5DA166]">독서 온도 38.4℃</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#526053] mt-2 leading-relaxed">
            비독자의 첫 걸음과 애독자의 깊은 탐험이 모여 성남시를 따뜻하게 밝힙니다. 
            완독과 대출 기록이 실시간으로 누적되며, 목표 달성 시 지역 사회에 희망을 기부합니다.
          </p>

          {/* Donation Milestone Card */}
          <div className="mt-4 p-4 rounded-2xl bg-[#FFF3EB] border border-[#FDC9A6] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F28D52] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#C2410C]">지역 아동 도서 기부 연동 캠페인</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#C2410C] border border-[#FDC9A6]">
                  {donationPercentage >= 100 ? '목표 달성 완료!' : `기부까지 ${remainingForDonation.toLocaleString()}권 남음`}
                </span>
              </div>
              <p className="text-[#1A3C20] leading-snug">
                {data.donationMilestoneText}
              </p>
              <div className="text-[11px] text-[#526053] font-medium">
                협력: {data.donationPartner} ({data.targetDate}까지)
              </div>
            </div>
          </div>
        </div>

        {/* Right Gauge & Contribution Action */}
        <div className="w-full lg:w-80 bg-[#FAF7F0] p-5 rounded-2xl border border-[#EBE5D8] shrink-0">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#526053] font-medium">전체 목표 완독수</span>
            <span className="font-bold text-[#1A3C20]">{data.currentReading.toLocaleString()} / {data.totalTarget.toLocaleString()}권</span>
          </div>

          {/* Thermometer Bar */}
          <div className="relative h-6 bg-[#EBE5D8] rounded-full overflow-hidden p-1 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5DA166] to-[#488250] transition-all duration-1000 relative shadow-sm"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute right-1 top-0 bottom-0 flex items-center pr-1">
                <span className="text-[10px] font-extrabold text-white leading-none drop-shadow-xs">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-center">
            <div className="p-2.5 bg-white rounded-xl border border-[#EBE5D8]">
              <span className="text-[11px] text-[#526053] block">함께한 중원시민</span>
              <span className="text-sm font-bold text-[#1A3C20] mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#5DA166]" />
                {data.totalParticipants.toLocaleString()}명
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-[#EBE5D8]">
              <span className="text-[11px] text-[#526053] block">내 기여도</span>
              <span className="text-sm font-bold text-[#C2410C] mt-0.5 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#F28D52]" />
                {userContribution}권 완독
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="contribute-reading-temp-btn"
            onClick={handleContribute}
            className={`w-full mt-4 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
              hasContributedToday 
                ? 'bg-[#1A3C20] hover:bg-[#244E2C]' 
                : 'bg-[#5DA166] hover:bg-[#488250] shadow-[#5DA166]/20'
            }`}
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>
              {hasContributedToday ? '오늘 완독 인증 완료 (+1권 추가)' : '오늘 완독/대출 1권 인증하고 온도 높이기'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
