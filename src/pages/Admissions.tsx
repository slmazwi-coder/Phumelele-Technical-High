import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  CheckCircle,
  X,
  FileText,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import {
  generateId,
  generateStudentNumber,
  getApplications,
  setApplications,
  type Application,
  type UploadedFile,
} from '../admin/utils/storage';

type UploadField = { key: string; label: string; required?: boolean };

const uploadFields: UploadField[] = [
  { key: 'learnerId',     label: 'Copy of Birth Certificate / ID',                    required: true },
  { key: 'reportCard',    label: 'Progress Report from Previous School',              required: true },
  { key: 'guardianId',    label: 'Parent/Guardian ID Copy',                           required: true },
  { key: 'residence',     label: 'Proof of Residence',                                required: true },
  { key: 'transfer',      label: 'Transfer Letter from Previous School (if applicable)' },
  { key: 'immunisation',  label: 'Copy of Immunisation Records (if available)' },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

const Field = ({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inp =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F5A800]/40 focus:border-[#003580] transition w-full bg-white';

const sel = inp + ' cursor-pointer';

const SectionHeading = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-4">
    <span className="text-[#003580]">{icon}</span>
    <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">{title}</h3>
  </div>
);

const StepBadge = ({
  num, label, active, done,
}: { num: number; label: string; active: boolean; done: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
        ${done   ? 'bg-[#F5A800] border-[#003580] text-white'
        : active ? 'bg-white border-white text-[#003580]'
        :          'bg-white/20 border-white/30 text-white/60'}`}
    >
      {done ? <CheckCircle size={14} /> : num}
    </div>
    <span
      className={`text-xs font-bold uppercase tracking-widest transition-all
        ${active ? 'text-white' : done ? 'text-green-200' : 'text-white/50'}`}
    >
      {label}
    </span>
  </div>
);

export const Admissions = () => {
  const [step,       setStep]       = useState<1 | 2 | 3>(1);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [disclaimer, setDisclaimer] = useState(false);
  const [files,      setFiles]      = useState<Record<string, File | null>>({});

  const [learner, setL] = useState({
    surname: '', firstName: '', initials: '', otherNames: '',
    dob: '', gender: '', identificationNumber: '', citizenship: '', race: '',
    grade: '', year: '2027', stream: '',
    highestGradePassed: '', yearWhenGradeWasPassed: '',
    countryOfResidence: '', province: '', physicalAddress: '', citySuburb: '', postalCode: '',
    homeLanguage: '', preferredLanguageOfInstruction: '',
    homeTelephone: '', emergencyTelephone: '', learnerCell: '', learnerEmail: '',
    religion: '',
  });

  const [prevSchool, setPrevSchool] = useState({
    name: '', address: '', province: '', country: '',
  });

  const [medical, setMedical] = useState({
    medicalAidNumber: '', medicalAidName: '',
    doctorName: '', doctorTelephoneNumber: '',
    medicalCondition: '',
  });

  const [parent1, setParent1] = useState({
    title: '', firstName: '', surname: '', gender: '',
    identificationNumber: '', occupation: '',
    residentialStreetAddress: '', citySuburb: '', code: '',
    relationshipToLearner: '',
  });

  const [otherContact, setOtherContact] = useState({
    homeTelephone: '', cellNumber: '', emailAddress: '',
  });

  const missingRequiredUploads = useMemo(
    () => uploadFields.filter((f) => f.required && !files[f.key]),
    [files],
  );

  const patchL  = (k: string, v: string) => setL(p => ({ ...p, [k]: v }));
  const patchPS = (k: string, v: string) => setPrevSchool(p => ({ ...p, [k]: v }));
  const patchM  = (k: string, v: string) => setMedical(p => ({ ...p, [k]: v }));
  const patchP1 = (k: string, v: string) => setParent1(p => ({ ...p, [k]: v }));
  const patchOC = (k: string, v: string) => setOtherContact(p => ({ ...p, [k]: v }));

  const validateStep = () => {
    if (step === 1) {
      if (!learner.firstName || !learner.surname || !learner.dob || !learner.gender) {
        setError('Please complete learner name, surname, date of birth and gender.');
        return false;
      }
      if (!learner.grade) { setError('Please select the grade applied for.'); return false; }
    }
    if (step === 3) {
      if (!parent1.firstName || !parent1.surname) {
        setError('Please complete Parent/Guardian first name and surname.');
        return false;
      }
      if (missingRequiredUploads.length > 0) {
        setError(`Please upload all required documents (${missingRequiredUploads.map(f => f.label).join(', ')}).`);
        return false;
      }
      if (!disclaimer) {
        setError('Please read and accept the declaration before submitting.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const goNext = () => { if (validateStep()) setStep(s => (s < 3 ? (s + 1) as 1|2|3 : s)); };
  const goBack = () => { setError(''); setStep(s => (s > 1 ? (s - 1) as 1|2|3 : s)); };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles(p => ({ ...p, [key]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const uploads: UploadedFile[] = [];
      for (const field of uploadFields) {
        const file = files[field.key];
        if (!file) continue;
        const dataUrl = await fileToDataUrl(file);
        uploads.push({ key: field.key, label: field.label, fileName: file.name, mimeType: file.type || 'application/octet-stream', dataUrl });
      }
      const studentNumber = generateStudentNumber(learner.year);
      const app: Application = {
        id: generateId(),
        firstName:          learner.firstName.trim(),
        lastName:           learner.surname.trim(),
        dob:                learner.dob,
        gender:             learner.gender,
        grade:              learner.grade,
        year:               learner.year,
        stream:             learner.stream,
        studentNumber,
        guardianName:       `${parent1.firstName} ${parent1.surname}`.trim(),
        guardianRelationship: parent1.relationshipToLearner || '',
        guardianPhone:      otherContact.cellNumber || learner.emergencyTelephone || '',
        guardianEmail:      otherContact.emailAddress || learner.learnerEmail || '',
        address:            learner.physicalAddress.trim(),
        locality:           learner.citySuburb.trim(),
        previousSchool:     prevSchool.name.trim(),
        lastGradeCompleted: learner.highestGradePassed.trim(),
        medicalInfo:        medical.medicalCondition.trim(),
        applicationType:    'General',
        uploads,
        subjectMarks: [],
        averageMark:  0,
        status:       'Pending',
        submittedDate: todayISO(),
      };
      setApplications([app, ...getApplications()]);
      setSubmitted(true);
    } catch {
      setError('Something went wrong while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-20 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-center p-10 sm:p-12 bg-white rounded-3xl shadow-2xl max-w-md"
        >
          <div className="w-20 h-20 bg-blue-50 text-[#003580] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for applying to Phumelele Technical High School. We have received your application and will be in contact shortly.
          </p>
          <a href="/" className="btn-primary w-full inline-block">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title">Application for Admission</h1>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#003580] px-8 py-7 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-bold">Application for Admission to School</h2>
                <p className="text-white/70 text-sm mt-1">
                  Phumelele Technical High School &nbsp;·&nbsp; Embizeni, Matatiele 4730
                </p>
              </div>
              <div className="text-right text-sm text-white/70">
                <div>Tel: +27 72 715 0626</div>
                <div>Step {step} of 3</div>
              </div>
            </div>

            <div className="relative h-1.5 bg-white/20 rounded-full mb-5 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#F5A800] rounded-full"
                animate={{ width: `${((step - 1) / 2) * 100 + 33.33}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <StepBadge num={1} label="Learner & Medical"  active={step === 1} done={step > 1} />
              <StepBadge num={2} label="Previous School"    active={step === 2} done={step > 2} />
              <StepBadge num={3} label="Parent / Documents" active={step === 3} done={false} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.22 }}
                className="p-6 sm:p-8 space-y-10"
              >

                {step === 1 && (
                  <>
                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Learner Particulars" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field label="Surname" required>
                          <input className={inp} value={learner.surname} onChange={e => patchL('surname', e.target.value)} />
                        </Field>
                        <Field label="First Name" required>
                          <input className={inp} value={learner.firstName} onChange={e => patchL('firstName', e.target.value)} />
                        </Field>
                        <Field label="Initials">
                          <input className={inp} value={learner.initials} onChange={e => patchL('initials', e.target.value)} maxLength={5} />
                        </Field>
                        <Field label="Date of Birth" required>
                          <input type="date" className={inp} value={learner.dob} onChange={e => patchL('dob', e.target.value)} />
                        </Field>
                        <Field label="Gender" required>
                          <select className={sel} value={learner.gender} onChange={e => patchL('gender', e.target.value)}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                          </select>
                        </Field>
                        <Field label="Race">
                          <select className={sel} value={learner.race} onChange={e => patchL('race', e.target.value)}>
                            <option value="">Select</option>
                            <option>African</option>
                            <option>Coloured</option>
                            <option>Indian/Asian</option>
                            <option>White</option>
                            <option>Other</option>
                          </select>
                        </Field>
                        <Field label="ID / Passport Number">
                          <input className={inp} value={learner.identificationNumber} onChange={e => patchL('identificationNumber', e.target.value)} />
                        </Field>
                        <Field label="Citizenship">
                          <input className={inp} value={learner.citizenship} onChange={e => patchL('citizenship', e.target.value)} placeholder="e.g. South African" />
                        </Field>
                        <Field label="Grade Applied For" required>
                          <select className={sel} value={learner.grade} onChange={e => patchL('grade', e.target.value)}>
                            <option value="">Select grade</option>
                            {['8','9','10','11','12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                          </select>
                        </Field>
                        <Field label="Year">
                          <select className={sel} value={learner.year} onChange={e => patchL('year', e.target.value)}>
                            {['2026','2027','2028'].map(y => <option key={y}>{y}</option>)}
                          </select>
                        </Field>
                        <Field label="Technical Stream (Grade 10+)">
                          <select className={sel} value={learner.stream} onChange={e => patchL('stream', e.target.value)}>
                            <option value="">Not applicable / Undecided</option>
                            <option>Civil Technology</option>
                            <option>Electrical Technology</option>
                            <option>Mechanical Technology</option>
                            <option>Engineering Graphics & Design</option>
                            <option>Woodworking</option>
                            <option>Construction</option>
                          </select>
                        </Field>
                        <Field label="Highest Grade Passed">
                          <input className={inp} value={learner.highestGradePassed} onChange={e => patchL('highestGradePassed', e.target.value)} placeholder="e.g. Grade 9" />
                        </Field>
                      </div>
                    </section>

                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Contact & Address" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field label="Physical Address">
                          <input className={inp} value={learner.physicalAddress} onChange={e => patchL('physicalAddress', e.target.value)} />
                        </Field>
                        <Field label="City / Suburb">
                          <input className={inp} value={learner.citySuburb} onChange={e => patchL('citySuburb', e.target.value)} />
                        </Field>
                        <Field label="Province">
                          <select className={sel} value={learner.province} onChange={e => patchL('province', e.target.value)}>
                            <option value="">Select</option>
                            <option>Eastern Cape</option>
                            <option>Free State</option>
                            <option>Gauteng</option>
                            <option>KwaZulu-Natal</option>
                            <option>Limpopo</option>
                            <option>Mpumalanga</option>
                            <option>North West</option>
                            <option>Northern Cape</option>
                            <option>Western Cape</option>
                          </select>
                        </Field>
                        <Field label="Postal Code">
                          <input className={inp} value={learner.postalCode} onChange={e => patchL('postalCode', e.target.value)} maxLength={5} />
                        </Field>
                        <Field label="Home Language">
                          <input className={inp} value={learner.homeLanguage} onChange={e => patchL('homeLanguage', e.target.value)} placeholder="e.g. IsiXhosa" />
                        </Field>
                        <Field label="Emergency Telephone">
                          <input className={inp} value={learner.emergencyTelephone} onChange={e => patchL('emergencyTelephone', e.target.value)} />
                        </Field>
                        <Field label="Learner Cellphone">
                          <input className={inp} value={learner.learnerCell} onChange={e => patchL('learnerCell', e.target.value)} />
                        </Field>
                        <Field label="Learner Email">
                          <input className={inp} value={learner.learnerEmail} onChange={e => patchL('learnerEmail', e.target.value)} />
                        </Field>
                      </div>
                    </section>

                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Medical Information" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field label="Medical Aid Name">
                          <input className={inp} value={medical.medicalAidName} onChange={e => patchM('medicalAidName', e.target.value)} />
                        </Field>
                        <Field label="Medical Aid Number">
                          <input className={inp} value={medical.medicalAidNumber} onChange={e => patchM('medicalAidNumber', e.target.value)} />
                        </Field>
                        <Field label="Doctor Name">
                          <input className={inp} value={medical.doctorName} onChange={e => patchM('doctorName', e.target.value)} />
                        </Field>
                        <Field label="Doctor Telephone">
                          <input className={inp} value={medical.doctorTelephoneNumber} onChange={e => patchM('doctorTelephoneNumber', e.target.value)} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Medical Conditions / Allergies">
                            <textarea className={inp} rows={3} value={medical.medicalCondition} onChange={e => patchM('medicalCondition', e.target.value)} placeholder="List any medical conditions, allergies or special needs" />
                          </Field>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {step === 2 && (
                  <>
                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Previous School" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="School Name">
                          <input className={inp} value={prevSchool.name} onChange={e => patchPS('name', e.target.value)} />
                        </Field>
                        <Field label="Address">
                          <input className={inp} value={prevSchool.address} onChange={e => patchPS('address', e.target.value)} />
                        </Field>
                        <Field label="Province">
                          <select className={sel} value={prevSchool.province} onChange={e => patchPS('province', e.target.value)}>
                            <option value="">Select</option>
                            <option>Eastern Cape</option>
                            <option>Free State</option>
                            <option>Gauteng</option>
                            <option>KwaZulu-Natal</option>
                            <option>Limpopo</option>
                            <option>Mpumalanga</option>
                            <option>North West</option>
                            <option>Northern Cape</option>
                            <option>Western Cape</option>
                          </select>
                        </Field>
                        <Field label="Country">
                          <input className={inp} value={prevSchool.country} onChange={e => patchPS('country', e.target.value)} placeholder="e.g. South Africa" />
                        </Field>
                      </div>
                    </section>
                  </>
                )}

                {step === 3 && (
                  <>
                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Parent / Guardian Details" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field label="Title">
                          <select className={sel} value={parent1.title} onChange={e => patchP1('title', e.target.value)}>
                            <option value="">Select</option>
                            <option>Mr</option>
                            <option>Mrs</option>
                            <option>Ms</option>
                            <option>Dr</option>
                          </select>
                        </Field>
                        <Field label="First Name" required>
                          <input className={inp} value={parent1.firstName} onChange={e => patchP1('firstName', e.target.value)} />
                        </Field>
                        <Field label="Surname" required>
                          <input className={inp} value={parent1.surname} onChange={e => patchP1('surname', e.target.value)} />
                        </Field>
                        <Field label="ID Number">
                          <input className={inp} value={parent1.identificationNumber} onChange={e => patchP1('identificationNumber', e.target.value)} />
                        </Field>
                        <Field label="Relationship to Learner">
                          <select className={sel} value={parent1.relationshipToLearner} onChange={e => patchP1('relationshipToLearner', e.target.value)}>
                            <option value="">Select</option>
                            <option>Father</option>
                            <option>Mother</option>
                            <option>Guardian</option>
                            <option>Other</option>
                          </select>
                        </Field>
                        <Field label="Occupation">
                          <input className={inp} value={parent1.occupation} onChange={e => patchP1('occupation', e.target.value)} />
                        </Field>
                        <Field label="Residential Address">
                          <input className={inp} value={parent1.residentialStreetAddress} onChange={e => patchP1('residentialStreetAddress', e.target.value)} />
                        </Field>
                        <Field label="City / Suburb">
                          <input className={inp} value={parent1.citySuburb} onChange={e => patchP1('citySuburb', e.target.value)} />
                        </Field>
                        <Field label="Code">
                          <input className={inp} value={parent1.code} onChange={e => patchP1('code', e.target.value)} maxLength={5} />
                        </Field>
                      </div>
                    </section>

                    <section>
                      <SectionHeading icon={<FileText size={16} />} title="Contact Numbers" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="Home Telephone">
                          <input className={inp} value={otherContact.homeTelephone} onChange={e => patchOC('homeTelephone', e.target.value)} />
                        </Field>
                        <Field label="Cell Number">
                          <input className={inp} value={otherContact.cellNumber} onChange={e => patchOC('cellNumber', e.target.value)} />
                        </Field>
                        <Field label="Email Address">
                          <input className={inp} value={otherContact.emailAddress} onChange={e => patchOC('emailAddress', e.target.value)} />
                        </Field>
                      </div>
                    </section>

                    <section>
                      <SectionHeading icon={<Upload size={16} />} title="Supporting Documents" />
                      <div className="space-y-3">
                        {uploadFields.map((uf) => {
                          const file = files[uf.key];
                          return (
                            <div key={uf.key} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition
                              ${file ? 'border-[#003580] bg-blue-50'
                              : uf.required ? 'border-dashed border-red-300 bg-red-50/30'
                              : 'border-dashed border-gray-300 bg-gray-50'}`}>
                              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                                ${file ? 'bg-[#F5A800] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                {file ? <CheckCircle size={16} /> : <Upload size={16} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-gray-700 leading-tight">
                                  {uf.label}{uf.required && <span className="text-red-500 ml-1">*</span>}
                                </div>
                                <div className={`text-xs mt-0.5 truncate ${file ? 'text-[#003580]' : 'text-gray-400'}`}>
                                  {file ? file.name : 'No file chosen'}
                                </div>
                              </div>
                              <label className="shrink-0 text-xs font-bold text-[#003580] cursor-pointer hover:underline">
                                {file ? 'Change' : 'Upload'}
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  onChange={e => handleFileChange(uf.key, e.target.files?.[0] ?? null)} />
                              </label>
                              {file && (
                                <button type="button" onClick={() => handleFileChange(uf.key, null)}
                                  className="shrink-0 text-gray-400 hover:text-red-500">
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <div className="bg-blue-50 border-2 border-[#003580]/30 rounded-2xl p-5">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={disclaimer}
                            onChange={(e) => setDisclaimer(e.target.checked)}
                            className="mt-1 shrink-0"
                          />
                          <span className="text-sm text-gray-700 leading-relaxed">
                            I, the undersigned, declare that the information provided above is true and correct to the best of my knowledge.
                            I accept the rules and regulations of Phumelele Technical High School and understand that false information
                            may disqualify this application.
                          </span>
                        </label>
                      </div>
                    </section>
                  </>
                )}

              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mx-6 sm:mx-8 mb-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                <AlertCircle size={18} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex justify-between gap-4">
              {step > 1 ? (
                <button type="button" onClick={goBack}
                  className="px-6 py-3 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button type="button" onClick={goNext}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-[#003580] text-white hover:bg-[#002255] transition flex items-center gap-2">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  className="px-8 py-3 rounded-xl text-sm font-bold bg-[#F5A800] text-[#003580] hover:bg-[#E09900] transition disabled:opacity-50 flex items-center gap-2">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
