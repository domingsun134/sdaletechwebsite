import React from 'react';
import { CheckCircle, AlertCircle, HelpCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusModal = ({ isOpen, onClose, type = 'info', title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', isLoading = false }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={32} className="text-green-600" />;
            case 'error':
                return <AlertCircle size={32} className="text-red-600" />;
            case 'confirm':
                return <HelpCircle size={32} className="text-primary" />;
            default:
                return <HelpCircle size={32} className="text-slate-600" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            case 'confirm':
                return 'bg-primary/10';
            default:
                return 'bg-slate-100';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                >
                    <div className="p-6 text-center">
                        <div className={`w-16 h-16 ${getBgColor()} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {getIcon()}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-slate-500 mb-6">{message}</p>

                        <div className="flex gap-3 justify-center">
                            {type === 'confirm' ? (
                                <>
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex-1"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex-1 flex items-center justify-center gap-2"
                                    >
                                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                                        {confirmText}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors min-w-[100px]"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StatusModal;
