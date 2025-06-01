"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types";
import {
	ArrowLeft,
	CreditCard,
	MapPin,
	Clock,
	User,
	Mail,
	Phone,
	Truck,
	Store,
	Shield,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		customerName: "",
		customerEmail: "",
		customerPhone: "",
		deliveryType: "delivery", // 'delivery' or 'collection'
		deliveryAddress: "",
		paymentMethod: "card", // 'card', 'paypal', 'cash'
		specialInstructions: "",
		termsAccepted: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Load cart from localStorage
	useEffect(() => {
		const savedCart = localStorage.getItem("2tasty-cart");
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
		setLoading(false);
	}, []);

	// Calculate totals
	const subtotal = cart.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

	// Form validation
	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.customerName.trim()) {
			newErrors.customerName = "Name is required";
		}

		if (!formData.customerEmail.trim()) {
			newErrors.customerEmail = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
			newErrors.customerEmail = "Please enter a valid email";
		}

		if (!formData.customerPhone.trim()) {
			newErrors.customerPhone = "Phone number is required";
		} else if (
			!/^(\+44|44|0)?[1-9]\d{8,9}$/.test(
				formData.customerPhone.replace(/\s/g, "")
			)
		) {
			newErrors.customerPhone = "Please enter a valid UK/Jersey phone number";
		}

		if (
			formData.deliveryType === "delivery" &&
			!formData.deliveryAddress.trim()
		) {
			newErrors.deliveryAddress = "Delivery address is required";
		}

		if (!formData.termsAccepted) {
			newErrors.termsAccepted = "Please accept the terms and conditions";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (cart.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		if (!validateForm()) {
			toast.error("Please fix the errors below");
			return;
		}

		setSubmitting(true);

		try {
			// Prepare order data
			const orderData = {
				customer_name: formData.customerName,
				customer_email: formData.customerEmail || null,
				customer_phone: formData.customerPhone,
				delivery_address:
					formData.deliveryType === "delivery"
						? formData.deliveryAddress
						: null,
				delivery_type: formData.deliveryType,
				payment_method: formData.paymentMethod,
				special_instructions: formData.specialInstructions || null,
				total_amount: subtotal,
				items: cart.map((item) => ({
					product_id: item.product.id,
					quantity: item.quantity,
					unit_price: item.product.price,
					item_instructions: item.instructions || null,
				})),
			};

			// Submit order
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				throw new Error("Failed to place order");
			}

			const result = await response.json();

			// Clear cart
			localStorage.removeItem("2tasty-cart");

			// Redirect to confirmation page
			window.location.href = `/order/${result.order.id}?success=true`;
		} catch (error) {
			console.error("Order submission error:", error);
			toast.error("Failed to place order. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	// Handle input changes
	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	// Redirect if cart is empty
	if (cart.length === 0 && !loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
						<CreditCard className="h-8 w-8 text-gray-400" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Your cart is empty
					</h2>
					<p className="text-gray-500 mb-6">
						Add some items to your cart before checking out
					</p>
					<button
						onClick={() => (window.location.href = "/")}
						className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
						Browse Menu
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Toaster position="top-center" />

			{/* Header */}
			<header className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center h-16">
						<button
							onClick={() => window.history.back()}
							className="flex items-center text-gray-600 hover:text-gray-900 mr-6 p-2 rounded-xl hover:bg-gray-100 transition-colors">
							<ArrowLeft className="h-5 w-5 mr-2" />
							<span className="font-medium">Back</span>
						</button>
						<h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Checkout Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Customer Information */}
						<div className="bg-white rounded-2xl shadow-card p-6">
							<div className="flex items-center mb-6">
								<User className="h-5 w-5 text-gray-400 mr-3" />
								<h2 className="text-lg font-semibold text-gray-900">
									Customer Information
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name *
									</label>
									<input
										type="text"
										value={formData.customerName}
										onChange={(e) =>
											handleInputChange("customerName", e.target.value)
										}
										className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
											errors.customerName ? "border-red-300" : "border-gray-200"
										}`}
										placeholder="John Smith"
									/>
									{errors.customerName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.customerName}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number *
									</label>
									<input
										type="tel"
										value={formData.customerPhone}
										onChange={(e) =>
											handleInputChange("customerPhone", e.target.value)
										}
										className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
											errors.customerPhone
												? "border-red-300"
												: "border-gray-200"
										}`}
										placeholder="+44 7700 900123"
									/>
									{errors.customerPhone && (
										<p className="mt-1 text-sm text-red-600">
											{errors.customerPhone}
										</p>
									)}
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address *
									</label>
									<input
										type="email"
										value={formData.customerEmail}
										onChange={(e) =>
											handleInputChange("customerEmail", e.target.value)
										}
										className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
											errors.customerEmail
												? "border-red-300"
												: "border-gray-200"
										}`}
										placeholder="john@example.com"
									/>
									{errors.customerEmail && (
										<p className="mt-1 text-sm text-red-600">
											{errors.customerEmail}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Delivery Options */}
						<div className="bg-white rounded-2xl shadow-card p-6">
							<div className="flex items-center mb-6">
								<Truck className="h-5 w-5 text-gray-400 mr-3" />
								<h2 className="text-lg font-semibold text-gray-900">
									Delivery Options
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<button
									type="button"
									onClick={() => handleInputChange("deliveryType", "delivery")}
									className={`p-4 border-2 rounded-xl text-left transition-colors ${
										formData.deliveryType === "delivery"
											? "border-primary-500 bg-primary-50"
											: "border-gray-200 hover:border-gray-300"
									}`}>
									<div className="flex items-center mb-2">
										<Truck className="h-5 w-5 text-primary-500 mr-2" />
										<span className="font-medium">Delivery</span>
										<span className="ml-auto text-green-600 font-medium">
											FREE
										</span>
									</div>
									<p className="text-sm text-gray-500">
										Delivered to your door
									</p>
									<p className="text-xs text-gray-400 mt-1">30-45 minutes</p>
								</button>

								<button
									type="button"
									onClick={() =>
										handleInputChange("deliveryType", "collection")
									}
									className={`p-4 border-2 rounded-xl text-left transition-colors ${
										formData.deliveryType === "collection"
											? "border-primary-500 bg-primary-50"
											: "border-gray-200 hover:border-gray-300"
									}`}>
									<div className="flex items-center mb-2">
										<Store className="h-5 w-5 text-primary-500 mr-2" />
										<span className="font-medium">Collection</span>
									</div>
									<p className="text-sm text-gray-500">Pick up from 2Tasty</p>
									<p className="text-xs text-gray-400 mt-1">20-30 minutes</p>
								</button>
							</div>

							{formData.deliveryType === "delivery" && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Delivery Address *
									</label>
									<textarea
										value={formData.deliveryAddress}
										onChange={(e) =>
											handleInputChange("deliveryAddress", e.target.value)
										}
										rows={3}
										className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
											errors.deliveryAddress
												? "border-red-300"
												: "border-gray-200"
										}`}
										placeholder="123 High Street, St. Helier, Jersey, JE2 3AB"
									/>
									{errors.deliveryAddress && (
										<p className="mt-1 text-sm text-red-600">
											{errors.deliveryAddress}
										</p>
									)}
								</div>
							)}
						</div>

						{/* Payment Method */}
						<div className="bg-white rounded-2xl shadow-card p-6">
							<div className="flex items-center mb-6">
								<CreditCard className="h-5 w-5 text-gray-400 mr-3" />
								<h2 className="text-lg font-semibold text-gray-900">
									Payment Method
								</h2>
							</div>

							<div className="space-y-3">
								{[
									{
										id: "card",
										label: "Credit/Debit Card",
										icon: CreditCard,
										note: "Secure payment via Stripe",
									},
									{
										id: "paypal",
										label: "PayPal",
										icon: Shield,
										note: "Pay with your PayPal account",
									},
									{
										id: "cash",
										label: "Cash on Delivery",
										icon: MapPin,
										note: "Pay when your order arrives",
									},
								].map((method) => (
									<button
										key={method.id}
										type="button"
										onClick={() =>
											handleInputChange("paymentMethod", method.id)
										}
										className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
											formData.paymentMethod === method.id
												? "border-primary-500 bg-primary-50"
												: "border-gray-200 hover:border-gray-300"
										}`}>
										<div className="flex items-center">
											<method.icon className="h-5 w-5 text-primary-500 mr-3" />
											<div className="flex-1">
												<span className="font-medium block">
													{method.label}
												</span>
												<span className="text-sm text-gray-500">
													{method.note}
												</span>
											</div>
											<div
												className={`w-4 h-4 rounded-full border-2 ${
													formData.paymentMethod === method.id
														? "border-primary-500 bg-primary-500"
														: "border-gray-300"
												}`}>
												{formData.paymentMethod === method.id && (
													<div className="w-full h-full bg-white rounded-full scale-50"></div>
												)}
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Special Instructions */}
						<div className="bg-white rounded-2xl shadow-card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Special Instructions
							</h3>
							<textarea
								value={formData.specialInstructions}
								onChange={(e) =>
									handleInputChange("specialInstructions", e.target.value)
								}
								rows={3}
								className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
								placeholder="Any special requests or instructions for your order..."
							/>
						</div>

						{/* Terms and Conditions */}
						<div className="bg-white rounded-2xl shadow-card p-6">
							<div className="flex items-start">
								<input
									type="checkbox"
									checked={formData.termsAccepted}
									onChange={(e) =>
										handleInputChange("termsAccepted", e.target.checked)
									}
									className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
								/>
								<div className="ml-3">
									<label className="text-sm text-gray-700">
										I accept the{" "}
										<a
											href="#"
											className="text-primary-600 hover:text-primary-700 underline">
											terms and conditions
										</a>{" "}
										and{" "}
										<a
											href="#"
											className="text-primary-600 hover:text-primary-700 underline">
											privacy policy
										</a>
									</label>
									{errors.termsAccepted && (
										<p className="mt-1 text-sm text-red-600">
											{errors.termsAccepted}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-card sticky top-24">
							<div className="p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">
									Order Summary
								</h3>

								{/* Items */}
								<div className="space-y-4 mb-6">
									{cart.map((item) => (
										<div key={item.product.id} className="flex justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-gray-900">
													{item.product.name}
												</h4>
												<p className="text-sm text-gray-500">
													Qty: {item.quantity}
												</p>
												{item.instructions && (
													<p className="text-xs text-gray-400 mt-1">
														Note: {item.instructions}
													</p>
												)}
											</div>
											<span className="font-medium text-gray-900">
												£{(item.product.price * item.quantity).toFixed(2)}
											</span>
										</div>
									))}
								</div>

								{/* Totals */}
								<div className="border-t border-gray-200 pt-4 space-y-2">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-medium">£{subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Delivery</span>
										<span className="font-medium text-green-600">FREE</span>
									</div>
									<div className="flex justify-between text-lg font-semibold pt-2 border-t">
										<span>Total</span>
										<span>£{subtotal.toFixed(2)}</span>
									</div>
								</div>

								{/* Place Order Button */}
								<button
									type="submit"
									disabled={submitting}
									className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl mt-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
									{submitting
										? "Placing Order..."
										: `Place Order • £${subtotal.toFixed(2)}`}
								</button>

								{/* Security note */}
								<div className="mt-4 p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center text-gray-600 text-sm">
										<Shield className="h-4 w-4 mr-2" />
										<span>Your order is secure and encrypted</span>
									</div>
								</div>

								{/* Estimated time */}
								<div className="mt-4 p-3 bg-primary-50 rounded-lg">
									<div className="flex items-center text-primary-700 text-sm">
										<Clock className="h-4 w-4 mr-2" />
										<span>
											Estimated{" "}
											{formData.deliveryType === "delivery"
												? "delivery"
												: "ready"}
											:
											{formData.deliveryType === "delivery"
												? " 30-45 mins"
												: " 20-30 mins"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
