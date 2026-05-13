import React from 'react';
import { User } from 'lucide-react';

interface StaffMember {
  name: string;
  position: string;
  subject?: string;
  category: string;
  image?: string;
}

const staffData: StaffMember[] = [
  {
    name: 'Mr. Ramabele',
    position: 'Principal',
    category: 'Leadership',
    image: './assets/about/FB_IMG_1778353894461.jpg',
  },
  {
    name: 'Deputy Principal',
    position: 'Deputy Principal',
    category: 'Leadership',
  },

  {
    name: 'HOD — Technical Subjects',
    position: 'Head of Department',
    subject: 'Civil, Electrical, Mechanical Technology',
    category: 'Departmental Heads',
  },
  {
    name: 'HOD — Sciences & Maths',
    position: 'Head of Department',
    subject: 'Mathematics & Physical Sciences',
    category: 'Departmental Heads',
  },
  {
    name: 'HOD — Languages',
    position: 'Head of Department',
    subject: 'English & IsiXhosa',
    category: 'Departmental Heads',
  },

  { name: 'Class Teacher', position: 'Class Teacher — Grade 8A',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 8B',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 9A',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 9B',  category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 10A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 10B', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 11A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 11B', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 12A', category: 'Class Teachers' },
  { name: 'Class Teacher', position: 'Class Teacher — Grade 12B', category: 'Class Teachers' },

  { name: 'Workshop Instructor', position: 'Workshop Instructor — Electrical', subject: 'Electrical Technology', category: 'Technical Staff' },
  { name: 'Workshop Instructor', position: 'Workshop Instructor — Civil',      subject: 'Civil Technology',      category: 'Technical Staff' },
  { name: 'Workshop Instructor', position: 'Workshop Instructor — Mechanical', subject: 'Mechanical Technology', category: 'Technical Staff' },
  { name: 'Workshop Instructor', position: 'Workshop Instructor — Woodworking',subject: 'Woodworking',           category: 'Technical Staff' },

  { name: 'School Administrator', position: 'School Administrator', category: 'Support Staff' },
  { name: 'Security Officer',     position: 'Security Officer',     category: 'Support Staff' },
];

const categories = [
  'Leadership',
  'Departmental Heads',
  'Class Teachers',
  'Technical Staff',
  'Support Staff',
];

const StaffCard = ({ member }: { member: StaffMember }) => (
  <div
    className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center p-6 text-center hover:-translate-y-1"
    style={{ background: '#f0f7ff', border: '1px solid #F5A800' }}
  >
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden"
      style={{ background: '#e8f1ff', border: '3px solid #F5A800' }}
    >
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <User size={40} style={{ color: '#F5A800', opacity: 0.5 }} />
      )}
    </div>

    <h3 className="text-sm font-bold leading-tight" style={{ color: '#003580' }}>
      {member.name}
    </h3>
    <p className="text-xs font-semibold mt-1" style={{ color: '#F5A800' }}>
      {member.position}
    </p>
    {member.subject && (
      <span
        className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full"
        style={{ background: '#e8f1ff', color: '#003580', border: '1px solid #F5A800' }}
      >
        {member.subject}
      </span>
    )}
  </div>
);

export const Staff = () => {
  const [activeCategory, setActiveCategory] = React.useState('Leadership');
  const filtered = staffData.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#f0f7ff' }}>
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: '#003580' }}>
            Our Staff
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: '#F5A800' }} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={
                activeCategory === cat
                  ? { background: '#003580', color: 'white' }
                  : { background: 'white', color: '#003580', border: '1px solid #003580' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((member, i) => (
            <div key={`${member.name}-${i}`}>
              <StaffCard member={member} />
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-3xl text-center" style={{ background: '#003580' }}>
          <p className="text-sm" style={{ color: 'rgba(245,168,0,0.8)' }}>
            Staff information can be updated via the Staff Portal by administrators.
          </p>
        </div>
      </div>
    </div>
  );
};
