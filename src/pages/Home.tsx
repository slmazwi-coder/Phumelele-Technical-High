import React from 'react';
import { motion } from 'motion/react';
import { Award, TrendingUp, Users, Megaphone, ArrowRight, Wrench } from 'lucide-react';

const stats = [
  { label: 'Technical Streams', value: '6', icon: Wrench },
  { label: 'Grades Offered', value: '8–12', icon: TrendingUp },
  { label: 'Dedicated Staff', value: '20+', icon: Users },
];

const streams = [
  'Civil Technology',
  'Electrical Technology',
  'Mechanical Technology',
  'Engineering Graphics & Design',
  'Woodworking',
  'Construction',
];

export const Home = () => {
  return (
    <div className="flex flex-col">
      <section className="py-10 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-school-gold bg-blue-50 p-6 sm:p-7 flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-white border border-school-gold text-school-navy shrink-0">
                <Megaphone size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-black uppercase tracking-widest text-school-navy">Notice</div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-white border border-school-gold text-gray-700">
                    2027
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-2">Admissions applications are now open</h3>
                <p className="text-gray-700 mt-1">
                  Applications for the <span className="font-bold">2027</span> academic year are open for Grades 8–12.
                </p>
                <a href="/admissions" className="mt-4 inline-flex items-center gap-2 text-school-navy font-bold">
                  Apply now <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-7 flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-white border border-gray-200 text-school-navy shrink-0">
                <Wrench size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-black uppercase tracking-widest text-school-navy">Technical Streams</div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-2">Choose your stream</h3>
                <p className="text-gray-700 mt-1">
                  We offer {streams.length} technical streams designed to empower learners with practical skills.
                </p>
                <a href="/about" className="mt-4 inline-flex items-center gap-2 text-school-navy font-bold">
                  Learn more <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 -mt-4 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-6 border-b-4 border-school-gold"
            >
              <div className="p-4 bg-blue-50 rounded-xl text-school-navy">
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Our Technical Streams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <div key={stream} className="card text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-school-navy flex items-center justify-center">
                  <Wrench size={24} className="text-school-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{stream}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title">Our Vision</h2>
          <p className="text-2xl text-gray-700 leading-relaxed font-light italic">
            "Empowering learners through technical excellence, discipline, and innovation — building tomorrow's skilled workforce today."
          </p>
        </div>
      </section>
    </div>
  );
};
