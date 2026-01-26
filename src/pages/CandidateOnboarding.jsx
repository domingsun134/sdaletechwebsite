import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, Plus, Trash2, Send, CheckCircle, AlertCircle } from 'lucide-react';

const CandidateOnboarding = () => {
    const { applicationId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    // Initial State using the structure from the requirements
    const [formData, setFormData] = useState({
        // Personal Details
        personal: {
            lastName: '',
            firstName: '',
            middleName: '',
            chineseName: '',
            gender: '',
            nationality: '',
            identityNo: '',
            dob: '',
            birthPlace: '',
            race: '',
            dialect: '',
            religion: '',
            maritalStatus: '',
            marriageDate: '',
            spouseName: '',
            spouseNationality: '',
            contributions: ''
        },
        // Family Details - Children
        children: [],
        // Contact Details
        contact: {
            addressType: '',
            blockNo: '',
            address1: '',
            address2: '',
            address3: '',
            city: '',
            postalCode: '',
            state: '',
            country: 'Singapore',
            homePhone: '',
            mobilePhone: ''
        },
        // Emergency Contacts
        emergencyContacts: [
            { name: '', relation: '', contactNo: '' }
        ]
    });

    const NATIONALITY_OPTIONS = [
        'Chinese / 中国',
        'Filipino / 菲律宾',
        'Indian / 印度',
        'Malaysian / 马来西亚',
        'Singaporean / 新加坡',
        'SPR Malaysian / 新加坡永久居民马来西亚',
        'SPR Chinese / 新加坡永久居民中国',
        'Myanmar / 缅甸'
    ];

    const RACE_OPTIONS = [
        'Chinese / 华', 'Indian / 印度', 'Malay / 马来', 'Filipino / 菲律宾', 'Myanmar / 缅甸'
    ];

    const DIALECT_OPTIONS = [
        'Cantonese / 广东', 'Fuzhou / 福州', 'Hainanese / 海南', 'Hindustani / 印度斯坦',
        'Hokkien / 福建', 'Hakka / 客家', 'Javanese / 爪哇', 'Khek / 克克',
        'Malay / 马来', 'Shanghainese / 上海', 'Tagalog / 塔加洛', 'Tamil / 泰米尔',
        'Teochew / 潮州', 'Others / 其他'
    ];

    const RELIGION_OPTIONS = [
        'Buddhism / 佛教', 'Catholic / 天主教', 'Christianity / 基督教', 'Hinduism / 印度教',
        'Islam / 伊斯兰教', 'Roman Catholic / 罗马天主教', 'Sikh / 锡克教', 'Taoism / 道教',
        'NIL / -', 'Others / 其他'
    ];

    const CONTRIBUTION_OPTIONS = [
        'CDAC / 华社自助理事会', 'MENDAKI / 新加坡马来德教社区发展理事会',
        'SINDA / 新加坡印度发展协会', 'ECF / 欧亚共同体协会',
        'Not Applicable / 无需', 'Opt-Out / 不参与'
    ];

    const MARITAL_STATUS_OPTIONS = [
        'Single / 单身', 'Married / 已婚', 'Widowed / 寡', 'Divorced / 离婚', 'Separated / 分开'
    ];

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Child Management
    const addChild = () => {
        setFormData(prev => ({
            ...prev,
            children: [...prev.children, { name: '', nationality: '', dob: '', gender: '' }]
        }));
    };

    const updateChild = (index, field, value) => {
        const newChildren = [...formData.children];
        newChildren[index][field] = value;
        setFormData(prev => ({ ...prev, children: newChildren }));
    };

    const removeChild = (index) => {
        setFormData(prev => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };

    // Emergency Contact Management
    const addEmergencyContact = () => {
        setFormData(prev => ({
            ...prev,
            emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', contactNo: '' }]
        }));
    };

    const updateEmergencyContact = (index, field, value) => {
        const newContacts = [...formData.emergencyContacts];
        newContacts[index][field] = value;
        setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
    };

    const removeEmergencyContact = (index) => {
        setFormData(prev => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                application_id: applicationId || null,
                personal_details: formData.personal,
                family_details: {
                    children: formData.children,
                    spouse_name: formData.personal.spouseName,
                    spouse_nationality: formData.personal.spouseNationality,
                    marriage_date: formData.personal.marriageDate,
                    marital_status: formData.personal.maritalStatus
                },
                contact_details: formData.contact,
                emergency_contacts: formData.emergencyContacts,
                status: 'submitted'
            };

            const { error: insertError } = await supabase
                .from('onboarding_submissions')
                .insert([payload]);

            if (insertError) throw insertError;

            // Trigger Email Notification (Non-blocking)
            fetch('/api/notify-onboarding-submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId })
            }).catch(err => console.error('Failed to trigger notification:', err));

            setSubmitted(true);
            window.scrollTo(0, 0);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">Submission Successful</h1>
                    <p className="text-slate-600 mb-8">
                        Thank you for submitting your details. Our HR team has received your information and will proceed with the next steps of your onboarding.
                    </p>
                    <a href="/" className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors">
                        Return to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary px-8 py-6 text-white">
                        <h1 className="text-3xl font-bold">New Hire Onboarding</h1>
                        <p className="text-blue-100 mt-2">Please complete your personal information to facilitate your onboarding process.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Section 1: Personal Details */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 border-slate-100">
                                <span className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center text-sm">1</span>
                                Personal Details / 个人资料
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormInput label="Last Name / 姓" value={formData.personal.lastName} onChange={(e) => handleChange('personal', 'lastName', e.target.value)} required />
                                <FormInput label="First Name / 名" value={formData.personal.firstName} onChange={(e) => handleChange('personal', 'firstName', e.target.value)} required />
                                <FormInput label="Middle Name" value={formData.personal.middleName} onChange={(e) => handleChange('personal', 'middleName', e.target.value)} />

                                <FormInput label="Employee Name / 姓名" value={formData.personal.chineseName} onChange={(e) => handleChange('personal', 'chineseName', e.target.value)} />
                                <FormSelect label="Gender / 性别" value={formData.personal.gender} onChange={(e) => handleChange('personal', 'gender', e.target.value)} options={['', 'Male', 'Female']} />
                                <FormSelect label="Nationality / 国籍" value={formData.personal.nationality} onChange={(e) => handleChange('personal', 'nationality', e.target.value)} options={['', ...NATIONALITY_OPTIONS]} required />


                                <FormInput label="Identity No (NRIC/FIN/Passport)" value={formData.personal.identityNo} onChange={(e) => handleChange('personal', 'identityNo', e.target.value)} required />
                                <FormInput label="Date of Birth / 出生日期" type="date" value={formData.personal.dob} onChange={(e) => handleChange('personal', 'dob', e.target.value)} required />
                                <FormInput label="Birth Place / 出生地点" value={formData.personal.birthPlace} onChange={(e) => handleChange('personal', 'birthPlace', e.target.value)} required />

                                <FormSelect label="Race / 种族" value={formData.personal.race} onChange={(e) => handleChange('personal', 'race', e.target.value)} options={['', ...RACE_OPTIONS]} />
                                <FormSelect label="Dialect / 方言" value={formData.personal.dialect} onChange={(e) => handleChange('personal', 'dialect', e.target.value)} options={['', ...DIALECT_OPTIONS]} />
                                <FormSelect label="Religion / 宗教" value={formData.personal.religion} onChange={(e) => handleChange('personal', 'religion', e.target.value)} options={['', ...RELIGION_OPTIONS]} />
                            </div>

                            <div className="mt-6">
                                <FormSelect label="Contributions to Self-Help Group Funds / 向自助困基金捐款" value={formData.personal.contributions} onChange={(e) => handleChange('personal', 'contributions', e.target.value)} options={['', ...CONTRIBUTION_OPTIONS]} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <FormSelect label="Marital Status / 婚姻状况" value={formData.personal.maritalStatus} onChange={(e) => handleChange('personal', 'maritalStatus', e.target.value)} options={['', ...MARITAL_STATUS_OPTIONS]} />
                                {formData.personal.maritalStatus && formData.personal.maritalStatus.includes('Married') && (
                                    <FormInput label="Marriage Date / 结婚日期" type="date" value={formData.personal.marriageDate} onChange={(e) => handleChange('personal', 'marriageDate', e.target.value)} />
                                )}
                            </div>

                            {(formData.personal.maritalStatus && formData.personal.maritalStatus.includes('Married')) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-slate-50">
                                    <FormInput label="Spouse Name / 配偶姓名" value={formData.personal.spouseName} onChange={(e) => handleChange('personal', 'spouseName', e.target.value)} />
                                    <FormSelect label="Spouse Nationality / 配偶国籍" value={formData.personal.spouseNationality} onChange={(e) => handleChange('personal', 'spouseNationality', e.target.value)} options={['', ...NATIONALITY_OPTIONS]} />
                                </div>
                            )}
                        </section>

                        {/* Section 2: Children */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 border-slate-100">
                                <span className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center text-sm">2</span>
                                Children Information / 子女资料
                            </h2>
                            <div className="space-y-4">
                                {formData.children.map((child, index) => (
                                    <div key={index} className="bg-slate-50 p-6 rounded-xl relative border border-slate-200">
                                        <button type="button" onClick={() => removeChild(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                        <h4 className="font-medium text-slate-700 mb-4">Child {index + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <FormInput label="Name" value={child.name} onChange={(e) => updateChild(index, 'name', e.target.value)} />
                                            <FormSelect label="Nationality" value={child.nationality} onChange={(e) => updateChild(index, 'nationality', e.target.value)} options={['', ...NATIONALITY_OPTIONS]} />
                                            <FormInput label="Date of Birth" type="date" value={child.dob} onChange={(e) => updateChild(index, 'dob', e.target.value)} />
                                            <FormSelect label="Gender" value={child.gender} onChange={(e) => updateChild(index, 'gender', e.target.value)} options={['', 'Male', 'Female']} />
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addChild} className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors px-2">
                                    <Plus size={20} /> Add Child
                                </button>
                            </div>
                        </section>

                        {/* Section 3: Contact Details */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 border-slate-100">
                                <span className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center text-sm">3</span>
                                Contact Details / 联络资料
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormSelect label="Address Type" value={formData.contact.addressType} onChange={(e) => handleChange('contact', 'addressType', e.target.value)} options={['', 'Local', 'Overseas', 'Mailing']} />
                                <FormInput label="Block No" value={formData.contact.blockNo} onChange={(e) => handleChange('contact', 'blockNo', e.target.value)} />
                            </div>
                            <div className="space-y-4">
                                <FormInput label="Address Line 1 (Street)" value={formData.contact.address1} onChange={(e) => handleChange('contact', 'address1', e.target.value)} required />
                                <FormInput label="Address Line 2 (Unit/Building)" value={formData.contact.address2} onChange={(e) => handleChange('contact', 'address2', e.target.value)} />
                                <FormInput label="Address Line 3" value={formData.contact.address3} onChange={(e) => handleChange('contact', 'address3', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                                <FormInput label="City" value={formData.contact.city} onChange={(e) => handleChange('contact', 'city', e.target.value)} />
                                <FormInput label="Postal Code" value={formData.contact.postalCode} onChange={(e) => handleChange('contact', 'postalCode', e.target.value)} required />
                                <FormInput label="State" value={formData.contact.state} onChange={(e) => handleChange('contact', 'state', e.target.value)} />
                                <FormInput label="Country" value={formData.contact.country} onChange={(e) => handleChange('contact', 'country', e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <FormInput label="Home Phone No." value={formData.contact.homePhone} onChange={(e) => handleChange('contact', 'homePhone', e.target.value)} />
                                <FormInput label="Mobile Phone No." value={formData.contact.mobilePhone} onChange={(e) => handleChange('contact', 'mobilePhone', e.target.value)} required />
                            </div>
                        </section>

                        {/* Section 4: Emergency Contacts */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2 border-slate-100">
                                <span className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center text-sm">4</span>
                                Emergency Contacts / 紧急联系人
                            </h2>
                            <div className="space-y-4">
                                {formData.emergencyContacts.map((contact, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                                        {index > 0 && (
                                            <button type="button" onClick={() => removeEmergencyContact(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 shadow-sm hover:bg-red-200">
                                                <XIcon size={14} />
                                            </button>
                                        )}
                                        <FormInput label="Name / 姓名" value={contact.name} onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)} required />
                                        <FormInput label="Relation / 关系" value={contact.relation} onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)} required />
                                        <FormInput label="Contact No / 电话" value={contact.contactNo} onChange={(e) => updateEmergencyContact(index, 'contactNo', e.target.value)} required />
                                    </div>
                                ))}
                                <button type="button" onClick={addEmergencyContact} className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors px-2">
                                    <Plus size={20} /> Add Contact
                                </button>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Send size={20} /> Submit Onboarding Form
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const FormInput = ({ label, type = "text", value, onChange, required = false, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
        />
    </div>
);

const FormSelect = ({ label, value, onChange, options, required = false }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
        >
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

const XIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M18 6 6 18" /><path d="m6 6 18 18" />
    </svg>
);


export default CandidateOnboarding;
