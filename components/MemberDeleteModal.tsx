import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    memberName: string;
}

const MemberDeleteModal: React.FC<MemberDeleteModalProps> = ({ isOpen, onClose, onConfirm, memberName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[80] flex items-center justify-center p-6 backdrop-blur-sm"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{memberName}님을 삭제하시겠습니까?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                이 멤버와 관련된 정산 내역이 있다면 문제가 생길 수 있습니다.<br />
                                정말 삭제하시겠습니까?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    삭제
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MemberDeleteModal;
