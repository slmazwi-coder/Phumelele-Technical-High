import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Award, Image as ImageIcon } from 'lucide-react';
import { getHallOfFame, type HallOfFameEntry } from '../admin/utils/storage';

const StudentAvatar = ({ image, name, year }: { image: string; name: string; year: string }) => {
  const [hasError, setHasError] = useState(!image);

  return (
    <div className="aspect-[3/4] sm:aspect-square w-full relative overflow-hidden bg-gray-100 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center group">
      {!hasError ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 p-6 text-center">
          <div className="mb-4 w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-gray-200">
            <ImageIcon className="opacity-60" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">{name}</p>
          <p className="text-xs text-gray-400 italic">Class of {year}</p>
          <p className="text-[11px] text-gray-400 mt-2">
            Add image in <span className="font-mono">public/assets/achievements/</span>
          </p>
        </div>
      )}
      <div className="absolute top-0 right-0 bg-blue-50 p-4 text-school-navy opacity-0 group-hover:opacity-100 transition-opacity">
        <Award size={24} />
      </div>
    </div>
  );
};

export const Achievements = () => {
  const [activeAchieversYear, setActiveAchieversYear] = useState<string>('2025');
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>(getHallOfFame());

  useEffect(() => {
    setHallOfFame(getHallOfFame());
  }, []);

  const achieversByYear: Record<string, HallOfFameEntry[]> = {};
  hallOfFame.forEach((entry) => {
    if (!achieversByYear[entry.year]) achieversByYear[entry.year] = [];
    achieversByYear[entry.year].push(entry);
  });

  const yearsList = Object.keys(achieversByYear).sort((a, b) => parseInt(b) - parseInt(a));
  if (yearsList.length > 0 && !yearsList.includes(activeAchieversYear)) {
    setActiveAchieversYear(yearsList[0]);
  }

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center mb-12 sm:mb-16">Technical Excellence & Achievements</h1>

        <section className="mb-16 sm:mb-24">
          <div className="bg-school-navy border-2 border-school-gold rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Star size={200} className="text-school-navy" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-school-gold rounded-full flex flex-col items-center justify-center text-school-navy border-8 border-white shadow-lg shrink-0">
                <Trophy size={40} />
                <span className="text-sm font-bold uppercase tracking-tighter italic mt-1">Excellence</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-school-gold font-bold uppercase tracking-widest text-sm mb-2">
                  <Star size={16} fill="currentColor" /> Technical Achievement <Star size={16} fill="currentColor" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-school-gold mb-4 text-center md:text-left">
                  Celebrating our achievers
                </h2>
                <p className="text-base sm:text-lg text-gray-300 max-w-2xl italic leading-relaxed text-center md:text-left">
                  "Phumelele THS produces skilled technical graduates who excel in competitions, exams, and the workplace."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-school-navy mb-2 flex items-center justify-center gap-2">
              <Trophy size={28} className="text-school-gold" /> Hall of Fame
            </h2>
            <div className="w-16 h-1 bg-school-gold mx-auto rounded-full" />
          </div>

          {yearsList.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {yearsList.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveAchieversYear(year)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeAchieversYear === year
                      ? 'bg-school-navy text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {(achieversByYear[activeAchieversYear] || []).length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No entries yet for {activeAchieversYear}. Add them in the Staff Portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(achieversByYear[activeAchieversYear] || []).map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <StudentAvatar image={entry.image} name={entry.name} year={entry.year} />
                  <div className="mt-3 text-center">
                    <h3 className="font-bold text-gray-900">{entry.name}</h3>
                    <p className="text-sm text-school-navy">{entry.title}</p>
                    {entry.desc && <p className="text-xs text-gray-500 mt-1">{entry.desc}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
