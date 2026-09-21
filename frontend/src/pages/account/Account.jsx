import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LuTrash2,
    LuUser,
    LuMail,
    LuShieldCheck,
} from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';

const Account = () => {
    const navigate = useNavigate();

    const {
        user,
        deleteUser,
        isLoading,
        isCustomer,
        isOrganizer
    } = useAuth();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const userName = user?.name || 'User';
    const userEmail = user?.email || 'No email available';

    const handleDeleteAccount = async () => {
        try {
            setDeleteError('');

            await deleteUser();

            navigate('/signin', { replace: true });
        } catch (error) {
            setDeleteError(
                isCustomer
                    ? 'Failed to delete your account while you have bookings.'
                    : 'Failed to delete your account while you have events.'
            );
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">
                    Account Settings
                </h1>

                <p className="text-sm text-zinc-500 mt-1">
                    Manage your account information and settings.
                </p>
            </div>

            {/* Account Information */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-5">
                    Account Information
                </h2>

                <div className="space-y-5">

                    {/* Name */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <LuUser className="w-5 h-5 text-zinc-500" />
                        </div>

                        <div>
                            <p className="text-xs text-zinc-500">
                                Name
                            </p>

                            <p className="text-sm font-medium text-zinc-900">
                                {userName}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <LuMail className="w-5 h-5 text-zinc-500" />
                        </div>

                        <div>
                            <p className="text-xs text-zinc-500">
                                Email
                            </p>

                            <p className="text-sm font-medium text-zinc-900">
                                {userEmail}
                            </p>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <LuShieldCheck className="w-5 h-5 text-zinc-500" />
                        </div>

                        <div>
                            <p className="text-xs text-zinc-500">
                                Account Type
                            </p>

                            <p className="text-sm font-medium text-zinc-900 capitalize">
                                {user?.role || 'User'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden">

                <div className="p-6">
                    <h2 className="text-lg font-semibold text-rose-700">
                        Danger Zone
                    </h2>

                    <p className="text-sm text-zinc-500 mt-1">
                        Permanently delete your account.
                    </p>
                </div>

                <div className="border-t border-rose-100 bg-rose-50/50 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <p className="font-medium text-zinc-900">
                                Delete Account
                            </p>

                            <p className="text-sm text-zinc-500 mt-1">
                                This action cannot be undone.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setDeleteError('');
                                setShowDeleteConfirm(true);
                            }}
                            disabled={isLoading}
                            className="
                                inline-flex items-center justify-center gap-2
                                px-4 py-2.5
                                rounded-xl
                                bg-rose-600
                                hover:bg-rose-700
                                text-white
                                text-sm
                                font-medium
                                transition-colors
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            <LuTrash2 className="w-4 h-4" />
                            Delete Account
                        </button>

                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => {
                            if (!isLoading) {
                                setShowDeleteConfirm(false);
                            }
                        }}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                            <LuTrash2 className="w-6 h-6 text-rose-600" />
                        </div>

                        <h2 className="text-xl font-bold text-zinc-900">
                            Delete your account?
                        </h2>

                        <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                            Are you sure you want to permanently delete your
                            account? This action cannot be undone.
                        </p>

                        {/* Backend error */}
                        {deleteError && (
                            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
                                {deleteError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isLoading}
                                className="
                                    px-4 py-2.5
                                    rounded-xl
                                    border border-zinc-200
                                    text-sm font-medium
                                    text-zinc-700
                                    hover:bg-zinc-50
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={isLoading}
                                className="
                                    px-4 py-2.5
                                    rounded-xl
                                    bg-rose-600
                                    hover:bg-rose-700
                                    text-white
                                    text-sm font-medium
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                {isLoading
                                    ? 'Deleting...'
                                    : 'Yes, Delete Account'}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;