"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types";
import {
	ArrowLeft,
	Plus,
	Minus,
	Trash2,
	ShoppingBag,
	ArrowRight,
	Clock,
	Star,
	CreditCard,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CartPage() {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);

	// Load cart from localStorage
	useEffect(() => {
		const savedCart = localStorage.getItem("2tasty-cart");
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
		setLoading(false);
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("2tasty-cart", JSON.stringify(cart));
	}, [cart]);

	// Update item quantity
	const updateQuantity = (productId: number, newQuantity: number) => {
		if (newQuantity <= 0) {
			removeItem(productId);
			return;
		}

		setCart((prev) =>
			prev.map((item) =>
				item.product.id === productId
					? { ...item, quantity: newQuantity }
					: item
			)
		);
	};

	// Remove item from cart
	const removeItem = (productId: number) => {
		const item = cart.find((item) => item.product.id === productId);
		setCart((prev) => prev.filter((item) => item.product.id !== productId));
		if (item) {
			toast.success(`${item.product.name} removed from cart`, {
				style: {
					background: "#ffffff",
					color: "#1f2937",
					border: "1px solid #e5e7eb",
					borderRadius: "12px",
					fontSize: "14px",
				},
			});
		}
	};

	// Update item instructions
	const updateInstructions = (productId: number, instructions: string) => {
		setCart((prev) =>
			prev.map((item) =>
				item.product.id === productId ? { ...item, instructions } : item
			)
		);
	};

	// Clear entire cart
	const clearCart = () => {
		setCart([]);
		toast.success("Cart cleared", {
			style: {
				background: "#ffffff",
				color: "#1f2937",
				border: "1px solid #e5e7eb",
				borderRadius: "12px",
				fontSize: "14px",
			},
		});
	};

	// Calculate totals
	const subtotal = cart.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-500 mx-auto"></div>
					<p className="mt-4 text-gray-600 text-sm">Loading cart...</p>
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
						<h1 className="text-xl font-semibold text-gray-900">Your Order</h1>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{cart.length === 0 ? (
					/* Empty Cart */
					<div className="text-center py-20">
						<div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
							<ShoppingBag className="h-12 w-12 text-gray-400" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Your cart is empty
						</h2>
						<p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
							Looks like you haven't added any delicious items to your cart yet.
							Let's fix that!
						</p>
						<button
							onClick={() => (window.location.href = "/")}
							className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-button">
							Browse Menu
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Cart Items */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-2xl shadow-card overflow-hidden">
								<div className="p-6 border-b border-gray-200">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-semibold text-gray-900">
											Order Items ({itemCount})
										</h2>
										{cart.length > 0 && (
											<button
												onClick={clearCart}
												className="text-gray-400 hover:text-red-500 text-sm flex items-center p-2 rounded-xl hover:bg-red-50 transition-colors">
												<Trash2 className="h-4 w-4 mr-2" />
												Clear All
											</button>
										)}
									</div>
								</div>

								<div className="divide-y divide-gray-200">
									{cart.map((item) => (
										<div key={item.product.id} className="p-6">
											<div className="flex items-start space-x-4">
												{/* Product Image */}
												<div className="flex-shrink-0">
													<div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
														<span className="text-2xl opacity-60">🍽️</span>
													</div>
												</div>

												{/* Product Details */}
												<div className="flex-1 min-w-0">
													<div className="flex justify-between items-start mb-2">
														<h3 className="font-semibold text-gray-900 text-lg">
															{item.product.name}
														</h3>
														<button
															onClick={() => removeItem(item.product.id)}
															className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors ml-4">
															<Trash2 className="h-4 w-4" />
														</button>
													</div>

													<p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
														{item.product.description}
													</p>

													<div className="flex items-center justify-between mb-4">
														<div className="flex items-center space-x-4">
															<span className="text-lg font-bold text-gray-900">
																£{item.product.price.toFixed(2)}
															</span>
															<span className="text-sm text-gray-400">
																× {item.quantity} = £
																{(item.product.price * item.quantity).toFixed(
																	2
																)}
															</span>
														</div>
													</div>

													{/* Quantity Controls */}
													<div className="flex items-center space-x-4">
														<div className="flex items-center bg-gray-100 rounded-xl p-1">
															<button
																onClick={() =>
																	updateQuantity(
																		item.product.id,
																		item.quantity - 1
																	)
																}
																className="p-2 hover:bg-white rounded-lg transition-colors">
																<Minus className="h-4 w-4 text-gray-600" />
															</button>
															<span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
																{item.quantity}
															</span>
															<button
																onClick={() =>
																	updateQuantity(
																		item.product.id,
																		item.quantity + 1
																	)
																}
																className="p-2 hover:bg-white rounded-lg transition-colors">
																<Plus className="h-4 w-4 text-gray-600" />
															</button>
														</div>
													</div>

													{/* Special Instructions */}
													<div className="mt-4">
														<label className="block text-sm font-medium text-gray-700 mb-2">
															Special instructions (optional)
														</label>
														<textarea
															value={item.instructions || ""}
															onChange={(e) =>
																updateInstructions(
																	item.product.id,
																	e.target.value
																)
															}
															placeholder="e.g., No onions, extra sauce..."
															className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
															rows={2}
														/>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl shadow-card sticky top-24">
								<div className="p-6">
									<h3 className="text-xl font-semibold text-gray-900 mb-6">
										Order Summary
									</h3>

									{/* Items breakdown */}
									<div className="space-y-3 mb-6">
										{cart.map((item) => (
											<div
												key={item.product.id}
												className="flex justify-between text-sm">
												<span className="text-gray-600 flex-1 mr-2">
													{item.quantity}× {item.product.name}
												</span>
												<span className="font-medium text-gray-900">
													£{(item.product.price * item.quantity).toFixed(2)}
												</span>
											</div>
										))}
									</div>

									<div className="border-t border-gray-200 pt-4 space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Subtotal</span>
											<span className="font-medium text-gray-900">
												£{subtotal.toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Delivery Fee</span>
											<span className="font-medium text-green-600">FREE</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Service Fee</span>
											<span className="font-medium text-gray-900">£0.00</span>
										</div>
									</div>

									<div className="border-t border-gray-200 pt-4 mt-4">
										<div className="flex justify-between items-center">
											<span className="text-xl font-semibold text-gray-900">
												Total
											</span>
											<span className="text-2xl font-bold text-gray-900">
												£{subtotal.toFixed(2)}
											</span>
										</div>
									</div>

									{/* Checkout Button */}
									<button
										onClick={() => (window.location.href = "/checkout")}
										className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl mt-6 hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 font-medium shadow-button">
										<CreditCard className="h-5 w-5" />
										<span>Proceed to Checkout</span>
										<ArrowRight className="h-5 w-5" />
									</button>

									{/* Continue Shopping */}
									<button
										onClick={() => (window.location.href = "/")}
										className="w-full text-gray-600 py-3 px-6 rounded-xl mt-3 hover:bg-gray-50 transition-colors font-medium">
										Continue Shopping
									</button>

									{/* Info Cards */}
									<div className="mt-6 space-y-4">
										{/* Estimated prep time */}
										<div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
											<div className="flex items-center text-primary-800">
												<Clock className="h-5 w-5 mr-3" />
												<div>
													<p className="text-sm font-medium">
														Estimated prep time
													</p>
													<p className="text-xs text-primary-600">
														20-30 minutes
													</p>
												</div>
											</div>
										</div>

										{/* Rating prompt */}
										<div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
											<div className="flex items-center text-yellow-800">
												<Star className="h-5 w-5 mr-3 text-yellow-500" />
												<div>
													<p className="text-sm font-medium">
														Rate your experience
													</p>
													<p className="text-xs text-yellow-600">
														Help us serve you better
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
