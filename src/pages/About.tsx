import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';
import { getAbout, type AboutInfo } from '../admin/utils/storage';

export const About = () => {
  const [data, setData] = useState<AboutInfo>(getAbout());
  const [campusFailed, setCampusFailed] = useState(false);
  const [principalFailed, setPrincipalFailed] = useState(false);

  const campusImageUrl = '/assets/about/campus.jpg';
  const principalImageUrl = '/assets/about/principal.jpg';

  useEffect(() => {
    setData(getAbout());
  }, []);

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="section-title">About Phumelele THS</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="border-l-4 border-school-gold pl-5 mb-6">
              <h2 className="text-2xl font-bold text-school-navy">Our School</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              {data.historyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-blue-50 rounded-3xl overflow-hidden shadow-lg border border-school-gold"
          >
            <div className="bg-school-navy p-6 sm:p-8">
              <div
                className="w-full rounded-3xl bg-school-navy p-2 sm:p-3"
                style={{ border: '4px solid #F5A800' }}
              >
                <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '4/3' }}>
                  {!campusFailed ? (
                    <img
                      src={campusImageUrl}
                      alt="School campus"
                      className="w-full h-full object-contain bg-school-navy"
                      onError={() => setCampusFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-school-navy via-school-gold to-school-navy flex items-center justify-center">
                      <div className="text-center text-white/70 px-6">
                        <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                          <ImageIcon />
                        </div>
                        <div className="font-semibold">Campus image</div>
                        <div className="text-sm text-white/60 font-mono">public/assets/about/</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-24"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-school-navy mb-2">Principal's Message</h2>
            <div className="w-16 h-1 bg-school-navy mx-auto rounded-full" />
          </div>

          <div className="bg-blue-50 rounded-3xl overflow-hidden shadow-lg border border-school-gold">
            <div className="grid grid-cols-1 md:grid-cols-3">

              <div className="flex flex-col items-center justify-center bg-school-navy p-8 md:p-10">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-school-gold shadow-xl mb-5">
                  {!principalFailed ? (
                    <img
                      src={principalImageUrl}
                      alt="Principal"
                      className="w-full h-full object-cover object-top"
                      onError={() => setPrincipalFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-school-navy to-school-gold flex items-center justify-center">
                      <ImageIcon className="text-white/40" size={48} />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-school-gold text-center">{data.principalName}</h3>
                <p className="text-sm text-white/70 font-medium">{data.principalTitle}</p>
              </div>

              <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {data.principalMessage.map((msg, i) => (
                    <p key={i}>{msg}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section>
          <h2 className="section-title">Our Technical Streams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Civil Technology', 'Electrical Technology', 'Mechanical Technology', 'Engineering Graphics & Design', 'Woodworking', 'Construction'].map((stream) => (
              <div key={stream} className="card text-center p-6">
                <h3 className="text-lg font-bold text-school-navy">{stream}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
