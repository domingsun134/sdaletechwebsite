import React from 'react';
import { X, CheckCircle, AlertTriangle, HelpCircle, Brain, Target, Users, Briefcase } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const ResumeAnalysisModal = ({ isOpen, onClose, analysis, candidateName, jobTitle, applicationId, onAnalysisUpdate }) => {
    const [isGeneratingQuestions, setIsGeneratingQuestions] = React.useState(false);
    const [localAnalysis, setLocalAnalysis] = React.useState(analysis);

    React.useEffect(() => {
        setLocalAnalysis(analysis);
    }, [analysis]);

    const handleGenerateQuestions = async () => {
        setIsGeneratingQuestions(true);
        try {
            const response = await fetch(`http://localhost:3000/api/generate-questions/${applicationId}`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                const updatedAnalysis = { ...localAnalysis, interview_questions: data.interview_questions };
                setLocalAnalysis(updatedAnalysis);
                if (onAnalysisUpdate) {
                    onAnalysisUpdate(applicationId, updatedAnalysis);
                }
            } else {
                alert('Failed to generate questions');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Error generating questions');
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    if (!isOpen || !localAnalysis) return null;

    // Handle legacy format fallback
    const scores = localAnalysis.scores || {
        overall: localAnalysis.score || 0,
        skills_match: localAnalysis.score || 0,
        experience_match: localAnalysis.score || 0,
        cultural_fit: localAnalysis.score || 0
    };

    const chartData = [
        { subject: 'Skills', A: scores.skills_match, fullMark: 100 },
        { subject: 'Experience', A: scores.experience_match, fullMark: 100 },
        { subject: 'Culture', A: scores.cultural_fit, fullMark: 100 },
        { subject: 'Overall', A: scores.overall, fullMark: 100 },
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Candidate Analysis</h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {candidateName} • <span className="font-medium text-primary">{jobTitle}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Top Section: Score & Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Radar Chart */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Candidate"
                                            dataKey="A"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            fill="#3b82f6"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold border ${getScoreColor(scores.overall)}`}>
                                Overall Match: {scores.overall}%
                            </div>
                        </div>

                        {/* Executive Summary */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Brain size={16} /> Executive Summary
                                </h3>
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {localAnalysis.summary}
                                </p>
                            </div>

                            {/* Key Metrics Cards */}
                            <div className="grid grid-cols-3 gap-4 pt-2">
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-xs text-blue-600 font-medium mb-1">Skills</div>
                                    <div className="text-2xl font-bold text-blue-700">{scores.skills_match}%</div>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="text-xs text-purple-600 font-medium mb-1">Experience</div>
                                    <div className="text-2xl font-bold text-purple-700">{scores.experience_match}%</div>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="text-xs text-indigo-600 font-medium mb-1">Culture</div>
                                    <div className="text-2xl font-bold text-indigo-700">{scores.cultural_fit}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Target size={18} className="text-green-600" />
                                Matched Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(localAnalysis.technical_analysis?.matched_skills || localAnalysis.pros || []).map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-1.5">
                                        <CheckCircle size={12} /> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-amber-500" />
                                Missing / Gaps
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(localAnalysis.technical_analysis?.missing_skills || localAnalysis.cons || []).map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Soft Skills & Red Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Users size={16} /> Soft Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(localAnalysis.soft_skills || []).map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                                {(!localAnalysis.soft_skills || localAnalysis.soft_skills.length === 0) && (
                                    <span className="text-slate-400 text-sm italic">No specific soft skills highlighted.</span>
                                )}
                            </div>
                        </div>

                        {localAnalysis.red_flags && localAnalysis.red_flags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertTriangle size={16} /> Potential Concerns
                                </h3>
                                <ul className="space-y-2">
                                    {localAnalysis.red_flags.map((flag, idx) => (
                                        <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                                            <span className="mt-1">•</span> {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Interview Questions */}
                    <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <HelpCircle size={20} className="text-indigo-600" />
                                Suggested Interview Questions
                            </h3>
                            {!localAnalysis.interview_questions && (
                                <button
                                    onClick={handleGenerateQuestions}
                                    disabled={isGeneratingQuestions}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isGeneratingQuestions ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Brain size={16} />
                                            Generate Questions
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {localAnalysis.interview_questions && localAnalysis.interview_questions.length > 0 ? (
                            <div className="grid gap-4">
                                {localAnalysis.interview_questions.map((q, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                        <p className="font-medium text-slate-800 mb-2">"{q.question}"</p>
                                        <p className="text-sm text-slate-500 italic">Context: {q.context}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !isGeneratingQuestions && (
                                <div className="text-center py-8 text-slate-500 italic">
                                    Click "Generate Questions" to get AI-suggested interview topics based on this resume.
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalysisModal;
