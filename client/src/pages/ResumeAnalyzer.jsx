import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { resumeService } from '../services';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ResumeAnalyzer() {
  const [resume,    setResume]    = useState(null);
  const [uploading, setUploading] = useState(false);
  const [polling,   setPolling]   = useState(false);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    resumeService.getLatest()
      .then(({ data }) => setResume(data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!resume || resume.isAnalyzed) { setPolling(false); return; }
    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const { data } = await resumeService.getById(resume._id);
        if (data.resume.isAnalyzed) {
          setResume(data.resume);
          setPolling(false);
          clearInterval(interval);
          // Show different toast based on whether it was valid
          const prob = data.resume.analysis?.interviewProbability;
          if (prob === 0) {
            toast.error('File does not look like a resume — please upload your CV');
          } else {
            toast.success('Resume analyzed!');
          }
        }
      } catch { clearInterval(interval); setPolling(false); }
    }, 3000);
    return () => clearInterval(interval);
  }, [resume?._id, resume?.isAnalyzed]);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file — use PDF, DOCX, or TXT under 5MB');
      return;
    }
    if (!accepted.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('resume', accepted[0]);
    try {
      const { data } = await resumeService.upload(fd);
      setResume(data.resume);
      toast.success('Uploaded — analyzing your resume…');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize:  5 * 1024 * 1024,
    disabled: uploading,
  });

  const analysis     = resume?.analysis;
  const isNotResume  = analysis && analysis.interviewProbability === 0 && !analysis.role?.includes('Developer') === false && analysis.skills?.strong?.length === 0 && analysis.skills?.missing?.length === 0;
  const isInvalidFile = analysis?.summary?.startsWith('⚠️');
  const probColor    = (p) => p >= 70 ? '#10d98c' : p >= 50 ? '#f59e0b' : '#f87171';
  const circumference = 2 * Math.PI * 40;

  if (loading) return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display text-2xl font-bold mb-1">AI Resume Analyzer</h1>
      <p className="text-[#7a7a8a] text-sm mb-8">
        Upload your resume — get skill gap analysis, interview probability, and personalized questions
      </p>

      {/* Upload zone */}
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-8
          ${uploading    ? 'opacity-50 cursor-not-allowed border-border' :
            isDragActive ? 'border-accent bg-accent/5' :
                           'border-border-2 hover:border-accent/60 hover:bg-bg-3'}`}>
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-[#7a7a8a] text-sm">Uploading…</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">{isDragActive ? '📂' : '📄'}</div>
            <p className="font-medium mb-1.5">{isDragActive ? 'Drop it here!' : 'Drop your resume'}</p>
            <p className="text-sm text-[#7a7a8a] mb-4">PDF, DOCX, or TXT · Max 5MB</p>
            <button className="btn-primary" type="button">Browse Files</button>
            <p className="text-xs text-[#4a4a5a] mt-3">
              Make sure it's your actual CV with work experience and skills
            </p>
          </>
        )}
      </div>

      {resume && (
        <div className="animate-fade-in">
          {/* File card */}
          <div className="flex items-center gap-4 card p-4 mb-5">
            <div className="text-2xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{resume.fileName || 'Resume'}</p>
              <p className="text-xs text-[#7a7a8a]">
                {resume.fileSize ? `${(resume.fileSize / 1024).toFixed(0)} KB · ` : ''}
                {analysis?.role && !isInvalidFile ? analysis.role : 'Analyzing…'}
              </p>
            </div>
            {polling ? (
              <div className="flex items-center gap-2 text-warn text-xs flex-shrink-0">
                <Spinner size="sm" /> Analyzing…
              </div>
            ) : resume.isAnalyzed ? (
              isInvalidFile
                ? <span className="text-xs text-danger flex-shrink-0">⚠ Not a resume</span>
                : <span className="text-xs text-success flex-shrink-0">✓ Analysis complete</span>
            ) : null}
          </div>

          {/* Re-upload */}
          <div className="flex justify-end mb-5">
            <button onClick={() => setResume(null)} className="btn-ghost text-xs">
              Upload different file
            </button>
          </div>

          {/* Invalid file warning */}
          {resume.isAnalyzed && isInvalidFile && (
            <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-medium text-danger mb-2">This doesn't look like a resume</h3>
              <p className="text-sm text-[#7a7a8a] mb-4 max-w-md mx-auto leading-relaxed">
                {analysis.summary.replace('⚠️ ', '')}
              </p>
              <div className="bg-bg-4 rounded-xl p-4 text-left max-w-sm mx-auto mb-5">
                <p className="text-xs font-medium mb-2">Your resume should contain:</p>
                <ul className="text-xs text-[#7a7a8a] space-y-1">
                  <li>• Your name, email, and contact info</li>
                  <li>• Work experience with job titles</li>
                  <li>• Education section</li>
                  <li>• Technical skills and technologies</li>
                  <li>• Projects (optional but helpful)</li>
                </ul>
              </div>
              <button
                onClick={() => setResume(null)}
                className="btn-primary">
                Upload Your Actual Resume
              </button>
            </div>
          )}

          {/* Valid analysis results */}
          {resume.isAnalyzed && !isInvalidFile && analysis && (
            <>
              {/* Probability + Summary */}
              <div className="grid grid-cols-3 gap-5 mb-6">
                <div className="card p-5 text-center">
                  <p className="text-xs text-[#7a7a8a] mb-4">Interview Probability</p>
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="48" cy="48" r="40" fill="none" stroke="#212128" strokeWidth="8" />
                      <circle cx="48" cy="48" r="40" fill="none"
                        stroke={probColor(analysis.interviewProbability)}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - (analysis.interviewProbability || 0) / 100)}
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-xl font-bold"
                        style={{ color: probColor(analysis.interviewProbability) }}>
                        {analysis.interviewProbability || 0}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#7a7a8a]">
                    {(analysis.interviewProbability || 0) >= 70 ? '🟢 Strong profile' :
                     (analysis.interviewProbability || 0) >= 50 ? '🟡 Good potential' :
                     '🔴 Needs improvement'}
                  </p>
                </div>
                <div className="card p-5 col-span-2">
                  <p className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-3">AI Summary</p>
                  <p className="text-sm leading-relaxed">{analysis.summary || 'No summary available.'}</p>
                </div>
              </div>

              {/* Skill Gap */}
              <div className="card p-5 mb-6">
                <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-5">Skill Gap Analysis</h3>
                {[
                  ['Missing Skills',  analysis.skills?.missing || [], 'badge-red',   'Skills top companies want that aren\'t on your resume'],
                  ['Weak Skills',     analysis.skills?.weak    || [], 'badge-amber',  'Areas that need more depth or experience'],
                  ['Strong Skills',   analysis.skills?.strong  || [], 'badge-green',  'Skills you can confidently talk about'],
                ].map(([label, skills, cls, desc]) =>
                  skills.length > 0 ? (
                    <div key={label} className="mb-5 last:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs font-medium text-[#7a7a8a]">{label}</p>
                        <p className="text-xs text-[#4a4a5a]">— {desc}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => <span key={s} className={`badge ${cls}`}>{s}</span>)}
                      </div>
                    </div>
                  ) : null
                )}
                {!analysis.skills?.missing?.length && !analysis.skills?.weak?.length && !analysis.skills?.strong?.length && (
                  <p className="text-sm text-[#4a4a5a]">
                    Could not extract skill data — try uploading a more detailed resume
                  </p>
                )}
              </div>

              {/* Generated Questions */}
              {analysis.generatedQuestions?.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">
                    Questions Based on Your Resume
                  </h3>
                  <p className="text-xs text-[#4a4a5a] mb-4">
                    These are the questions an interviewer is likely to ask based on what's in your resume
                  </p>
                  <div className="space-y-3">
                    {analysis.generatedQuestions.map((q, i) => (
                      <div key={i} className="bg-bg-4 rounded-xl p-4">
                        <p className="text-sm mb-1.5">"{q.question}"</p>
                        {q.context && (
                          <p className="text-xs text-[#4a4a5a]">Based on: {q.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}