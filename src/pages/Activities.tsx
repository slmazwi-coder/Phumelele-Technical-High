import React from 'react';
import { BookOpen, Mic, Brain, PenTool, Wrench, Lightbulb } from 'lucide-react';

const activities = [
  {
    name: 'Technical Olympiad',
    icon: Wrench,
    description: 'Annual technical skills competition across all streams — Civil, Electrical, Mechanical, and more.',
  },
  {
    name: 'Debate Club',
    icon: Mic,
    description: 'Structured debating that develops critical thinking, research, and public speaking.',
  },
  {
    name: 'Science Club',
    icon: Brain,
    description: 'Experiments, projects, and exploration of practical science and technology.',
  },
  {
    name: 'Reading & Writing Club',
    icon: BookOpen,
    description: 'Creative writing, reading circles, and language enrichment activities.',
  },
  {
    name: 'Spelling Bee',
    icon: PenTool,
    description: 'Building vocabulary, spelling accuracy, and confidence in public performance.',
  },
  {
    name: 'Entrepreneurship Club',
    icon: Lightbulb,
    description: 'Developing business skills, innovation thinking, and project planning for learners.',
  },
];

export const Activities = () => {
  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center">Activities</h1>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Academic and technical activities help learners grow confidence, strengthen problem-solving skills, and prepare for competitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div key={a.name} className="bg-gray-50 rounded-3xl border border-gray-100 p-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-white border border-gray-200 text-school-navy">
                  <a.icon size={22} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">{a.name}</h2>
              </div>
              <p className="text-gray-600">{a.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-school-gold rounded-3xl p-6 sm:p-7">
          <div className="text-sm font-black uppercase tracking-widest text-school-navy">More activities</div>
          <p className="text-gray-700 mt-2">
            The school may add more academic activities over time, such as quiz competitions, coding club,
            chess, career guidance programs, and technical workshops.
          </p>
        </div>
      </div>
    </div>
  );
};
