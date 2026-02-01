"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface RecentSettlement {
  id: string;
  title: string;
  lastAccess: number;
}

export default function Home() {
  const router = useRouter();
  const [recentSettlements, setRecentSettlements] = useState<RecentSettlement[]>([]);

  useEffect(() => {
    // Load recent settlements from localStorage
    const stored = localStorage.getItem('nanumi_recent_settlements');
    if (stored) {
      setRecentSettlements(JSON.parse(stored));
    } else {
      // Seed with examples if empty (for demo purposes)
      const demoData: RecentSettlement[] = [
        { id: 'demo-1', title: '제주도 3박 4일', lastAccess: Date.now() },
        { id: 'demo-2', title: 'MT 회비', lastAccess: Date.now() - 86400000 },
        { id: 'demo-3', title: '친구 생일 정산', lastAccess: Date.now() - 172800000 },
      ];
      setRecentSettlements(demoData);
      localStorage.setItem('nanumi_recent_settlements', JSON.stringify(demoData));
    }
  }, []);

  const handleStart = () => {
    router.push('/create');
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-xl h-[100dvh] relative flex flex-col p-8 overflow-y-auto">

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 min-h-[50vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              여행·모임 정산을<br />
              <span className="text-blue-600">간단하게</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              로그인 없이<br />
              링크로 바로 정산하세요
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all"
          >
            정산 시작하기
          </motion.button>
        </div>

        {/* Recent Settlements */}
        <div className="flex-1 mt-10">
          <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-wide uppercase">
            최근 정산
          </h2>

          <div className="space-y-3">
            {recentSettlements.map((settlement) => (
              <Link
                key={settlement.id}
                href={`/settle/${settlement.id}`}
                className="block group"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-5 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {settlement.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(settlement.lastAccess).toLocaleDateString()} 마지막 접속
                    </p>
                  </div>
                  <div className="text-gray-300 group-hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            ))}

            {recentSettlements.length === 0 && (
              <div className="text-center py-10 text-gray-300 font-medium">
                최근 내역이 없습니다.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
