// src/lib/api.ts

// Central API base URL. Override via Vite env: VITE_API_BASE_URL
// Example .env: VITE_API_BASE_URL=https://vardhan.pythonanywhere.com/api
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://vardhan.pythonanywhere.com/api';

// --- INTERFACES ---
export interface UserProfile {
    name: string;
    phone_number: string;
    address: string;
    user_type: 'STUDENT' | 'STRANGER' | 'WARDEN';
    roll_no?: string;
    college?: string;
}

export interface AuthUser {
    id: number;
    email: string;
    username: string;
    profile: UserProfile;
}

export interface UserDetail {
    id: number;
    email: string;
    username: string;
    name?: string;
    phone_number?: string;
    address?: string;
    user_type: 'STUDENT' | 'STRANGER' | 'WARDEN';
    roll_no?: string;
    college?: string;
    warden_id?: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: string;
    last_login?: string;
}

export interface Hostel {
    id: number;
    name: string;
    address: string;
    description: string;
    contact_email?: string;
    contact_phone?: string;
    images: string[];
    amenities: string[];
    features: string[];
    warden: number;
    warden_name?: string;
    rooms: Room[];
    reviews: Review[];
    // Optional helper fields provided by the backend
    private_price_per_day?: string | null;
    private_monthly_rent_min?: string | null;
    dorm_price_per_day?: string | null;
    dorm_monthly_rent_min?: string | null;
    // Hostel-level defaults
    default_price_per_day?: string | null;
    default_monthly_rent?: string | null;
}

export interface Room {
    id: number;
    hostel: number;
    room_type: string;
    capacity: number;
    price_per_night: string;
    monthly_rent: string;
    beds: Bed[];
}

export interface Bed {
    id: number;
    room: number;
    bed_number: number;
    is_available: boolean;
}

export interface Booking {
    id: number;
    user: number;
    bed: number;
    check_in_date: string;
    check_out_date: string;
    total_price: string;
    status: string;
    user_email: string;
    user_phone?: string;
    payment_id?: string;
    created_at: string;
}

export interface Review {
    id: number;
    user: number;
    hostel: number;
    rating: number;
    review_text: string;
    created_at: string;
}

// --- HELPER FUNCTION ---
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        // Attempt to parse the error body for detailed messages
        const errorData = await response.json().catch(() => ({ detail: `HTTP Error ${response.status}` }));
        throw new Error(JSON.stringify(errorData));
    }
    return response.json();
};

// --- AUTHENTICATION FUNCTIONS ---

export const registerUser = async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials: any): Promise<{ token: string }> => {
    // Include both username and email to support backends that accept either field
    const payload = {
        username: credentials.username,
        email: credentials.username,
        password: credentials.password,
    };

    const response = await fetch(`${API_BASE_URL}/auth/token/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    // Custom check for login errors to return the token cleanly
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(JSON.stringify(errorData));
    }

    // Some backends return { token } others may return { auth_token } or { key }
    const data = await response.json();
    const token = data.token || data.auth_token || data.key || data.access || null;
    if (!token) {
        // If no token field found, return the raw response so callers can inspect
        return data as any;
    }
    return { token } as any;
};

export const getMe = async (token: string): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    return handleResponse(response);
};

// --- HOSTEL & BOOKING FUNCTIONS ---

export const getHostels = async (search?: string): Promise<Hostel[]> => {
    const url = search ? `${API_BASE_URL}/hostels/hostels/?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/hostels/hostels/`;
    const response = await fetch(url);
    return handleResponse(response);
};

export const getHostel = async (id: number): Promise<Hostel> => {
    const response = await fetch(`${API_BASE_URL}/hostels/hostels/${id}/`);
    return handleResponse(response);
};

export const createBooking = async (bookingData: any, token: string): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/hostels/bookings/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
};

export const getBookings = async (token: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/hostels/bookings/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    return handleResponse(response);
};

// (Payment functions removed for discovery-only mode)

export interface BookedDateRange {
    start: string;
    end: string;
}

// ... (Add this function to the bottom of the file) ...

export const getBookedDates = async (bedId: number): Promise<BookedDateRange[]> => {
    // This calls the custom action we created on the BedViewSet
    const response = await fetch(`${API_BASE_URL}/hostels/beds/${bedId}/booked_dates/`);
    return handleResponse(response);
};

// --- ROOM / BED MANAGEMENT (WARDEN) ---

export const createRoom = async (hostelId: number, roomData: any, token: string) => {
    const body = { ...roomData, hostel: hostelId };
    const response = await fetch(`${API_BASE_URL}/hostels/rooms/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

export const updateRoom = async (roomId: number, roomData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/hostels/rooms/${roomId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(roomData),
    });
    return handleResponse(response);
};

export const deleteRoom = async (roomId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/hostels/rooms/${roomId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
    });
    if (response.status === 204) return { ok: true };
    return handleResponse(response);
};

export const createBed = async (roomId: number, bedData: any, token: string) => {
    const body = { ...bedData, room: roomId };
    const response = await fetch(`${API_BASE_URL}/hostels/beds/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(body),
    });
    return handleResponse(response);
};

export const updateBed = async (bedId: number, bedData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/hostels/beds/${bedId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(bedData),
    });
    return handleResponse(response);
};

export const deleteBed = async (bedId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/hostels/beds/${bedId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
    });
    if (response.status === 204) return { ok: true };
    return handleResponse(response);
};

// --- USER MANAGEMENT (ADMIN) ---

export const getAllUsers = async (token: string): Promise<UserDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/auth/users/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    return handleResponse(response);
};

export const getUserById = async (userId: number, token: string): Promise<UserDetail> => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    return handleResponse(response);
};

export const updateUser = async (userId: number, userData: Partial<UserDetail>, token: string): Promise<UserDetail> => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const deleteUser = async (userId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
    });
    if (response.status === 204) return { ok: true };
    return handleResponse(response);
};

// --- HOSTEL MANAGEMENT (WARDEN) ---
export const updateHostel = async (hostelId: number, hostelData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/hostels/hostels/${hostelId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(hostelData),
    });
    return handleResponse(response);
};