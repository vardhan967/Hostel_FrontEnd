import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../lib/api';
import { UserDetail } from '../lib/api';
import { Button } from '../components/ui/button'; // KEEPING THIS IMPORT

import { 
  User, Mail, Phone, MapPin, GraduationCap, Users, Hash, Clock, ArrowLeft, 
  ShieldCheck, ShieldOff, Loader2, Landmark, Briefcase 
} from 'lucide-react'; // Added and organized icons

// Helper component for the Stat Box
const StatBox: React.FC<{ label: string, value: React.ReactNode, unit: string, Icon: React.ElementType, color: string }> = ({ label, value, unit, Icon, color }) => (
    <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center transition-all hover:shadow-lg border border-gray-100">
        <Icon className={`w-6 h-6 mb-2 ${color}`} />
        <div className="text-2xl font-extrabold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label} {unit && <span className="text-gray-400">{unit}</span>}</div>
    </div>
);

// Helper component for the Info Row
const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center gap-3 text-gray-700 font-medium text-sm">
            <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <span>{label}</span>
        </div>
        <div className="text-gray-800 font-normal text-sm text-right max-w-[60%] break-words">
            {value}
        </div>
    </div>
);

const UserProfile: React.FC = () => {
    // --- ORIGINAL FUNCTIONALITY: State and useParams ---
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ORIGINAL FUNCTIONALITY: useEffect and Data Fetching ---
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !userId) return;
        setLoading(true);
        // FUNCTIONALITY UNTOUCHED: API call
        getUserById(Number(userId), token)
            .then(setUser)
            .catch(err => {
                console.error("Failed to load user profile:", err);
                setError('Failed to load user profile. Check network and permissions.');
            })
            .finally(() => setLoading(false));
    }, [userId]);

    // --- ORIGINAL FUNCTIONALITY: Loading/Error/Not Found States ---
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="ml-3 text-gray-600">Loading profile...</p>
        </div>
    );
    if (error) return <div className="p-8 text-red-500 font-semibold">{error}</div>;
    if (!user) return <div className="p-8 text-gray-700 font-semibold">User not found.</div>;

    // Helper to render boolean status
    const renderStatus = (status: boolean | undefined) => {
        if (status === undefined) return <span className="text-gray-400">N/A</span>;
        return status ? 
            <span className="text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Yes</span> : 
            <span className="text-red-600 font-semibold flex items-center gap-1"><ShieldOff className="w-4 h-4" /> No</span>;
    };

    // Custom Avatar component
    const AvatarPlaceholder = () => (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex justify-center items-center text-white font-extrabold text-xl shadow-lg border-2 border-white">
            {user.name ? user.name[0].toUpperCase() : 'U'}
        </div>
    );
    
    // Determine STAT box values
    const statData = [
        { 
            label: "User ID", value: user.id || 'N/A', unit: "#", 
            Icon: Hash, color: "text-blue-600" 
        },
        { 
            label: "User Type", value: user.user_type?.toUpperCase() || 'N/A', unit: "", 
            Icon: Users, color: "text-purple-600" 
        },
        { 
            label: "Account Active", value: renderStatus(user.is_active), unit: "", 
            Icon: ShieldCheck, color: user.is_active ? "text-emerald-600" : "text-red-600" 
        },
        { 
            label: "Is Staff", value: renderStatus(user.is_staff), unit: "", 
            Icon: Briefcase, color: user.is_staff ? "text-emerald-600" : "text-red-600"
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* --- Sticky Header --- */}
            <header className="sticky top-0 z-10 bg-white shadow-md border-b p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="text-gray-700 hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-xl font-bold text-gray-900 flex-grow text-center ml-[-40px] sm:ml-0">
                    Profile Detail
                </h1>
                <AvatarPlaceholder />
            </header>

            <div className="container max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
                
                {/* --- Main Profile Header --- */}
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-600">
                    <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center font-extrabold text-3xl text-blue-600 border-4 border-white shadow-md">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">@{user.username || user.email.split('@')[0]}</p>
                </div>


                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-2 gap-4">
                    {statData.map((stat, index) => (
                        <StatBox key={index} {...stat} />
                    ))}
                </div>

                {/* --- Contact & Role Details Card --- */}
                <div className="bg-white rounded-xl p-6 shadow-xl space-y-2 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Contact & Role Details</h3>
                    
                    <InfoRow icon={User} label="Full Name" value={user.name} />
                    <InfoRow icon={Mail} label="Email Address" value={user.email} />
                    <InfoRow icon={Phone} label="Phone Number" value={user.phone_number || <span className="text-gray-400">Not provided</span>} /> 
                    <InfoRow icon={MapPin} label="Address" value={user.address || <span className="text-gray-400">Not provided</span>} />
                    
                    {user.roll_no && <InfoRow icon={GraduationCap} label="Roll Number" value={user.roll_no} />}
                    {user.college && <InfoRow icon={Landmark} label="College/Uni" value={user.college} />}
                    {user.warden_id && <InfoRow icon={Briefcase} label="Warden ID" value={user.warden_id} />}
                </div>

                {/* --- System Status Card --- */}
                <div className="bg-white rounded-xl p-6 shadow-xl space-y-2 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">System Status</h3>
                    
                    <InfoRow icon={ShieldCheck} label="Superuser" value={renderStatus(user.is_superuser)} />
                    <InfoRow icon={Clock} label="Date Joined" value={user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'} />
                    {user.last_login && <InfoRow icon={Clock} label="Last Login" value={new Date(user.last_login).toLocaleString()} />}
                </div>

                {/* --- Back Button --- */}
                <div className="pt-4 pb-8">
                    <Button onClick={() => window.history.back()} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;