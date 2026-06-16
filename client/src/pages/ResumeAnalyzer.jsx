import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { resumeService } from "../services";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import {
  FileText,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeService
      .getLatest()
      .then(({ data }) => setResume(data.resume))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!resume || resume.isAnalyzed) {
      setPolling(false);
      return;
    }
    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const { data } = await resumeService.getById(resume._id);
        if (data.resume.isAnalyzed) {
          setResume(data.resume);
          setPolling(false);
          clearInterval(interval);

          const prob = data.resume.analysis?.interviewProbability;
          if (prob === 0) {
            toast.error(
              "File does not look like a resume — please upload your CV",
            );
          } else {
            toast.success("Resume analyzed!");
          }
        }
      } catch {
        clearInterval(interval);
        setPolling(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [resume?._id, resume?.isAnalyzed]);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error("Invalid file — use PDF, DOCX, or TXT under 5MB");
      return;
    }
    if (!accepted.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("resume", accepted[0]);
    try {
      const { data } = await resumeService.upload(fd);
      setResume(data.resume);
      toast.success("Uploaded — analyzing your resume…");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: uploading,
  });

  const analysis = resume?.analysis;
  const isInvalidFile = analysis?.summary?.startsWith("text-accent");
  const probColor = (p) =>
    p >= 70 ? "#10d98c" : p >= 50 ? "#f59e0b" : "#f87171";
  const circumference = 2 * Math.PI * 40;

  if (loading)
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="mt-12 sm:mt-0">
        <h1 className="font-display text-xl sm:text-2xl font-bold mb-1">
          AI Resume Analyzer
        </h1>
        <p className="text-[#7a7a8a] text-xs sm:text-sm mb-6 sm:mb-8">
          Upload your resume — get skill gap analysis, interview probability,
          and personalized questions
        </p>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center cursor-pointer transition-all mb-6 sm:mb-8
          ${
            uploading
              ? "opacity-50 cursor-not-allowed border-border"
              : isDragActive
                ? "border-accent bg-accent/5"
                : "border-border-2 hover:border-accent/60 hover:bg-bg-3"
          }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Spinner size="lg" />
            <p className="text-[#7a7a8a] text-sm font-medium">
              Uploading and parsing CV content…
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div
              className={`p-4 rounded-full bg-bg-4 mb-4 text-accent transition-transform duration-200 ${isDragActive ? "scale-110" : ""}`}
            >
              {isDragActive ? (
                <FileSpreadsheet size={36} />
              ) : (
                <UploadCloud size={36} />
              )}
            </div>
            <p className="font-medium text-sm sm:text-base mb-1.5">
              {isDragActive ? "Drop it here!" : "Drop your resume"}
            </p>
            <p className="text-xs sm:text-sm text-[#7a7a8a] mb-4">
              PDF, DOCX, or TXT · Max 5MB
            </p>
            <button
              className="btn-primary text-sm px-5 py-2 w-full sm:w-auto justify-center"
              type="button"
            >
              Browse Files
            </button>
            <p className="text-[11px] sm:text-xs text-[#4a4a5a] mt-4 leading-relaxed">
              Make sure it's your actual CV containing verifiable work history
              blocks and skills
            </p>
          </div>
        )}
      </div>

      {resume && (
        <div className="animate-fade-in space-y-4 sm:space-y-6">
          {/* File card */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 card p-4">
            <div className="p-2 rounded-xl bg-accent/10 text-accent flex-shrink-0 hidden sm:block">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm truncate">
                {resume.fileName || "Resume"}
              </p>
              <p className="text-[11px] sm:text-xs text-[#7a7a8a] truncate mt-0.5">
                {resume.fileSize
                  ? `${(resume.fileSize / 1024).toFixed(0)} KB · `
                  : ""}
                {analysis?.role && !isInvalidFile
                  ? analysis.role
                  : "Analyzing profile…"}
              </p>
            </div>
            <div className="flex sm:justify-end flex-shrink-0 pt-2 sm:pt-0 border-t border-border/40 sm:border-t-0">
              {polling ? (
                <div className="flex items-center gap-2 text-warn text-xs font-medium">
                  <Spinner size="sm" /> Parsing Details…
                </div>
              ) : resume.isAnalyzed ? (
                isInvalidFile ? (
                  <span className="text-xs text-danger font-medium flex items-center gap-1">
                    <AlertTriangle size={14} /> Not a resume
                  </span>
                ) : (
                  <span className="text-xs text-success font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} /> Analysis complete
                  </span>
                )
              ) : null}
            </div>
          </div>

          {/* Re-upload utility triggers */}
          <div className="flex justify-end">
            <button
              onClick={() => setResume(null)}
              className="btn-ghost text-xs px-1 flex items-center gap-1"
            >
              <RefreshCw size={12} /> Upload different file
            </button>
          </div>

          {/* Invalid file warning UI blocks */}
          {resume.isAnalyzed && isInvalidFile && (
            <div className="bg-danger/5 border border-danger/20 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center">
              <div className="p-3 bg-danger/10 text-danger rounded-full mb-3">
                <AlertTriangle size={32} />
              </div>
              <h3 className="font-medium text-danger text-sm sm:text-base mb-2">
                This doesn't look like a resume
              </h3>
              <p className="text-xs sm:text-sm text-[#7a7a8a] mb-4 max-w-md mx-auto leading-relaxed">
                {analysis.summary.replace("text-accent ", "")}
              </p>
              <div className="bg-bg-4 rounded-xl p-4 text-left max-w-sm w-full mb-5 border border-border/40">
                <p className="text-xs font-semibold mb-2 text-[#e0e0e6] flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-accent" /> Your resume
                  should contain:
                </p>
                <ul className="text-xs text-[#7a7a8a] space-y-1.5 pl-1">
                  <li>• Clear identification structure (Name, Email)</li>
                  <li>• Professional summary or historical job titles</li>
                  <li>• Chronological work experience timeline mapping</li>
                  <li>• Categorized technical skill arrays</li>
                </ul>
              </div>
              <button
                onClick={() => setResume(null)}
                className="btn-primary w-full sm:w-auto text-sm justify-center"
              >
                Upload Your Actual Resume
              </button>
            </div>
          )}

          {/* Valid analysis results UI wrapper */}
          {resume.isAnalyzed && !isInvalidFile && analysis && (
            <>
              {/* Probability + Summary Flex System */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div className="card p-5 text-center flex flex-col justify-center items-center">
                  <p className="text-[11px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-4">
                    Interview Probability
                  </p>
                  <div className="relative w-24 h-24 mb-3 flex-shrink-0">
                    <svg
                      width="96"
                      height="96"
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#212128"
                        strokeWidth="8"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke={probColor(analysis.interviewProbability)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={
                          circumference *
                          (1 - (analysis.interviewProbability || 0) / 100)
                        }
                        style={{ transition: "stroke-dashoffset 1s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-display text-xl font-bold"
                        style={{
                          color: probColor(analysis.interviewProbability),
                        }}
                      >
                        {analysis.interviewProbability || 0}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-medium mt-1">
                    {(analysis.interviewProbability || 0) >= 70
                      ? "🟢 Strong profile"
                      : (analysis.interviewProbability || 0) >= 50
                        ? "🟡 Good potential"
                        : "🔴 Needs improvement"}
                  </p>
                </div>

                <div className="card p-5 md:col-span-2">
                  <p className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-2.5">
                    AI Summary
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#c0c0cc]">
                    {analysis.summary || "No summary available."}
                  </p>
                </div>
              </div>

              {/* Skill Gap Container Layout */}
              <div className="card p-4 sm:p-5">
                <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-4 sm:mb-5">
                  Skill Gap Analysis
                </h3>
                {[
                  [
                    "Missing Skills",
                    analysis.skills?.missing || [],
                    "badge-red",
                    "Skills companies look for that aren't here",
                  ],
                  [
                    "Weak Skills",
                    analysis.skills?.weak || [],
                    "badge-amber",
                    "Areas needing more foundational depth",
                  ],
                  [
                    "Strong Skills",
                    analysis.skills?.strong || [],
                    "badge-green",
                    "Skills you are ready to expand on",
                  ],
                ].map(([label, skills, cls, desc]) =>
                  skills.length > 0 ? (
                    <div
                      key={label}
                      className="mb-5 last:mb-0 pb-4 last:pb-0 border-b border-border/30 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start md:items-center gap-1 mb-2.5">
                        <p className="text-xs font-semibold text-[#e0e0e6]">
                          {label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-[#6a6a7a] sm:before:content-['—_']">
                          {desc}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span key={s} className={`badge ${cls} text-xs`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null,
                )}
                {!analysis.skills?.missing?.length &&
                  !analysis.skills?.weak?.length &&
                  !analysis.skills?.strong?.length && (
                    <p className="text-xs sm:text-sm text-[#4a4a5a] py-2">
                      Could not extract skill datasets. Consider expanding
                      details within your core resume document file.
                    </p>
                  )}
              </div>

              {/* Generated Targeted Questions Grid Layout */}
              {analysis.generatedQuestions?.length > 0 && (
                <div className="card p-4 sm:p-5">
                  <h3 className="text-[10px] sm:text-xs text-[#7a7a8a] uppercase tracking-wider mb-2">
                    Questions Based on Your Resume
                  </h3>
                  <p className="text-xs text-[#5a5a6a] mb-4">
                    These are standard custom prompt iterations interview panels
                    typically ask based on your recorded experience profile
                    history.
                  </p>
                  <div className="space-y-3">
                    {analysis.generatedQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="bg-bg-4 rounded-xl p-3 sm:p-4 border border-border/30 flex items-start gap-3 group"
                      >
                        <div className="mt-0.5 text-accent opacity-60 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-[#e0e0e6] mb-1">
                            "{q.question}"
                          </p>
                          {q.context && (
                            <p className="text-[11px] text-[#7a7a8a] italic">
                              Context target: {q.context}
                            </p>
                          )}
                        </div>
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
