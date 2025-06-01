import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwindcss-merge";

// Utility function for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Format currency for display
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: "GBP",
	}).format(amount);
}

// Format date for display
export function formatDate(date: string | Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

// Format time only
export function formatTime(date: string | Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

// Generate a random order number
export function generateOrderNumber(): string {
	const timestamp = Date.now().toString().slice(-6);
	const random = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `2T-${timestamp}-${random}`;
}

// Validate email address
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Validate UK phone number (including Jersey)
export function isValidPhoneNumber(phone: string): boolean {
	// Remove all non-digit characters
	const cleanPhone = phone.replace(/\D/g, "");

	// Check for UK/Jersey format (including +44 and 07)
	const phoneRegex = /^(?:(?:\+44|44|0)?(?:7\d{9}|1534\d{6}))$/;
	return phoneRegex.test(cleanPhone);
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
	const cleanPhone = phone.replace(/\D/g, "");

	// Jersey landline format
	if (cleanPhone.startsWith("1534")) {
		return `+44 ${cleanPhone.slice(0, 4)} ${cleanPhone.slice(
			4,
			7
		)} ${cleanPhone.slice(7)}`;
	}

	// UK mobile format
	if (cleanPhone.startsWith("44")) {
		const withoutCountryCode = cleanPhone.slice(2);
		return `+44 ${withoutCountryCode.slice(0, 1)} ${withoutCountryCode.slice(
			1,
			5
		)} ${withoutCountryCode.slice(5)}`;
	}

	// Default format
	return phone;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + "...";
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(null, args), delay);
	};
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate initials from name
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

// Calculate estimated delivery time
export function calculateEstimatedTime(prepTimeMinutes: number): Date {
	const now = new Date();
	const estimatedTime = new Date(now.getTime() + prepTimeMinutes * 60 * 1000);
	return estimatedTime;
}

// Format estimated time for display
export function formatEstimatedTime(prepTimeMinutes: number): string {
	const estimatedTime = calculateEstimatedTime(prepTimeMinutes);
	const now = new Date();
	const diffMinutes = Math.round(
		(estimatedTime.getTime() - now.getTime()) / (1000 * 60)
	);

	if (diffMinutes < 1) return "Ready now";
	if (diffMinutes === 1) return "1 minute";
	if (diffMinutes < 60) return `${diffMinutes} minutes`;

	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;

	if (hours === 1 && minutes === 0) return "1 hour";
	if (hours === 1) return `1 hour ${minutes} minutes`;
	if (minutes === 0) return `${hours} hours`;

	return `${hours} hours ${minutes} minutes`;
}

// Check if restaurant is currently open
export function isRestaurantOpen(): boolean {
	const now = new Date();
	const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
	const hour = now.getHours();
	const minute = now.getMinutes();
	const currentTime = hour * 60 + minute; // Convert to minutes

	// Restaurant hours: 7:30 AM - 4:00 PM, Monday to Saturday
	const openTime = 7 * 60 + 30; // 7:30 AM in minutes
	const closeTime = 16 * 60; // 4:00 PM in minutes

	// Closed on Sunday
	if (day === 0) return false;

	// Check if current time is within opening hours
	return currentTime >= openTime && currentTime < closeTime;
}

// Get restaurant status message
export function getRestaurantStatus(): { isOpen: boolean; message: string } {
	const isOpen = isRestaurantOpen();

	if (isOpen) {
		return {
			isOpen: true,
			message: "Open now - Orders being accepted",
		};
	}

	const now = new Date();
	const day = now.getDay();

	if (day === 0) {
		return {
			isOpen: false,
			message: "Closed - Open Monday at 7:30 AM",
		};
	}

	const hour = now.getHours();

	if (hour < 7 || (hour === 7 && now.getMinutes() < 30)) {
		return {
			isOpen: false,
			message: "Closed - Opens at 7:30 AM",
		};
	}

	if (hour >= 16) {
		return {
			isOpen: false,
			message: "Closed - Opens tomorrow at 7:30 AM",
		};
	}

	return {
		isOpen: false,
		message: "Currently closed",
	};
}

// Local storage helpers with error handling
export const storage = {
	get: (key: string, defaultValue: any = null) => {
		try {
			if (typeof window === "undefined") return defaultValue;
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(`Error getting ${key} from localStorage:`, error);
			return defaultValue;
		}
	},

	set: (key: string, value: any) => {
		try {
			if (typeof window === "undefined") return;
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting ${key} in localStorage:`, error);
		}
	},

	remove: (key: string) => {
		try {
			if (typeof window === "undefined") return;
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing ${key} from localStorage:`, error);
		}
	},
};

// API response helpers
export function createResponse(data: any, status: number = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export function createErrorResponse(message: string, status: number = 400) {
	return createResponse({ error: message }, status);
}

// Form validation helpers
export function validateRequired(
	value: string,
	fieldName: string
): string | null {
	if (!value || value.trim().length === 0) {
		return `${fieldName} is required`;
	}
	return null;
}

export function validateMinLength(
	value: string,
	minLength: number,
	fieldName: string
): string | null {
	if (value.length < minLength) {
		return `${fieldName} must be at least ${minLength} characters`;
	}
	return null;
}

export function validateMaxLength(
	value: string,
	maxLength: number,
	fieldName: string
): string | null {
	if (value.length > maxLength) {
		return `${fieldName} must be no more than ${maxLength} characters`;
	}
	return null;
}

// URL helpers
export function getBaseUrl(): string {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
