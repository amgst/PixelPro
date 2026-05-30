import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
    const { user, isAdmin, loading, logout } = useAuth();

    // If a user is signed in but is not an authorized admin, sign them out so a
    // stale/unauthorized session can't linger.
    useEffect(() => {
        if (!loading && user && !isAdmin) {
            console.warn("[ProtectedRoute] Authenticated user is not an admin. Signing out.");
            void logout();
        }
    }, [loading, user, isAdmin, logout]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
                    <p className="text-gray-500 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ message: 'You are not authorized to access the admin area.' }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
