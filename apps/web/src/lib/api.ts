/**
 * API client for UMS backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ums-replica.onrender.com/api/v1";

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { token, ...fetchOptions } = options;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // ─── Auth ──────────────────────────────────────────────
    async login(email: string, password: string) {
        return this.request<{ access_token: string; refresh_token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async register(data: { email: string; password: string; full_name: string; enrollment_no?: string }) {
        return this.request("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // ─── Users ─────────────────────────────────────────────
    async getProfile(token: string) {
        return this.request<any>("/users/me", { token });
    }

    async updateProfile(token: string, data: any) {
        return this.request<any>("/users/me", { method: "PATCH", body: JSON.stringify(data), token });
    }

    // ─── Academics ─────────────────────────────────────────
    async getCourses(token: string) {
        return this.request<{ courses: any[]; total: number }>("/academics/courses", { token });
    }

    async getMyCourses(token: string) {
        return this.request<any[]>("/academics/my-courses", { token });
    }

    async enrollCourse(token: string, courseId: number) {
        return this.request<any>(`/academics/enroll/${courseId}`, { method: "POST", token });
    }

    async getAttendanceSummary(token: string) {
        return this.request<any[]>("/academics/attendance/summary", { token });
    }

    async getMyResults(token: string) {
        return this.request<any[]>("/academics/results/me", { token });
    }

    async getMyTimetable(token: string) {
        return this.request<any[]>("/academics/timetable/me", { token });
    }

    // ─── Housing ───────────────────────────────────────────
    async getRooms(token: string) {
        return this.request<{ rooms: any[]; total: number }>("/housing/rooms", { token });
    }

    async getMyRoom(token: string) {
        return this.request<any>("/housing/my-room", { token });
    }

    async createMaintenanceRequest(token: string, data: any) {
        return this.request<any>("/housing/maintenance", { method: "POST", body: JSON.stringify(data), token });
    }

    async getMaintenanceRequests(token: string) {
        return this.request<any[]>("/housing/maintenance", { token });
    }

    // ─── Communication ────────────────────────────────────
    async getChatRooms(token: string) {
        return this.request<any[]>("/communication/rooms", { token });
    }

    async createChatRoom(token: string, data: any) {
        return this.request<any>("/communication/rooms", { method: "POST", body: JSON.stringify(data), token });
    }

    async getChatMessages(token: string, roomId: number) {
        return this.request<any[]>(`/communication/rooms/${roomId}/messages`, { token });
    }

    async getMyLeaves(token: string) {
        return this.request<any[]>("/communication/leaves/me", { token });
    }

    async applyLeave(token: string, data: any) {
        return this.request<any>("/communication/leaves", { method: "POST", body: JSON.stringify(data), token });
    }
}

export const api = new ApiClient(API_BASE);
