export interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	image_url?: string;
	available: boolean;
	prep_time_minutes: number;
	allergens: string[];
	created_at: string;
	updated_at: string;
}

export interface CartItem {
	product: Product;
	quantity: number;
	instructions?: string;
}

export interface Order {
	id: number;
	order_number: string;
	customer_name: string;
	customer_email?: string;
	customer_phone: string;
	delivery_address?: string;
	delivery_type: "delivery" | "collection";
	total_amount: number;
	payment_method: string;
	status:
		| "pending"
		| "accepted"
		| "rejected"
		| "preparing"
		| "ready"
		| "completed";
	estimated_ready_time?: string;
	rejection_reason?: string;
	special_instructions?: string;
	sms_sent: Record<string, boolean>;
	created_at: string;
	updated_at: string;
	order_items: OrderItem[];
}

export interface OrderItem {
	id: number;
	order_id: number;
	product_id: number;
	quantity: number;
	unit_price: number;
	item_instructions?: string;
	product?: Product;
}

export type OrderStatus =
	| "pending"
	| "accepted"
	| "rejected"
	| "preparing"
	| "ready"
	| "completed";
