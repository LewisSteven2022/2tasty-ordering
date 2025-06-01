export const CATEGORIES = [
	{ id: "breakfast", name: "Breakfast", icon: "🍳" },
	{ id: "mains", name: "Main Dishes", icon: "🍽️" },
	{ id: "salads", name: "Salads", icon: "🥗" },
	{ id: "wraps", name: "Wraps", icon: "🌯" },
	{ id: "drinks", name: "Drinks", icon: "☕" },
	{ id: "desserts", name: "Desserts", icon: "🍰" },
];

export const ORDER_STATUSES = {
	pending: { label: "Order Placed", color: "yellow", icon: "⏳" },
	accepted: { label: "Accepted", color: "blue", icon: "✅" },
	rejected: { label: "Rejected", color: "red", icon: "❌" },
	preparing: { label: "Preparing", color: "orange", icon: "👨‍🍳" },
	ready: { label: "Ready", color: "green", icon: "🍽️" },
	completed: { label: "Completed", color: "gray", icon: "✅" },
};

export const ALLERGENS = [
	"gluten",
	"dairy",
	"eggs",
	"fish",
	"shellfish",
	"nuts",
	"peanuts",
	"soy",
];

export const PREP_TIMES = [
	{ value: 15, label: "15 minutes" },
	{ value: 20, label: "20 minutes" },
	{ value: 25, label: "25 minutes" },
	{ value: 30, label: "30 minutes" },
	{ value: 45, label: "45 minutes" },
	{ value: 60, label: "1 hour" },
];
