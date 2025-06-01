"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product, CartItem } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import {
	ShoppingBag,
	Plus,
	Minus,
	Clock,
	AlertTriangle,
	ArrowLeft,
	Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MenuPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [basket, setBasket] = useState<CartItem[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [loading, setLoading] = useState(true);

	// Load menu from database
	useEffect(() => {
		async function loadMenu() {
			try {
				const { data, error } = await supabase
					.from("products")
					.select("*")
					.eq("available", true)
					.order("category", { ascending: true })
					.order("name", { ascending: true });

				if (error) throw error;
				setProducts(data || []);
			} catch (error) {
				console.error("Error loading menu:", error);
				toast.error("Failed to load menu. Please refresh the page.");
			} finally {
				setLoading(false);
			}
		}

		loadMenu();
	}, []);

	// Load basket from localStorage
	useEffect(() => {
		const savedBasket = localStorage.getItem("2tasty-cart");
		if (savedBasket) {
			setBasket(JSON.parse(savedBasket));
		}
	}, []);

	// Save basket to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("2tasty-cart", JSON.stringify(basket));
	}, [basket]);

	// Add item to basket
	const addToBasket = (product: Product) => {
		setBasket((prev) => {
			const existing = prev.find((item) => item.product.id === product.id);
			if (existing) {
				return prev.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prev, { product, quantity: 1 }];
		});
		toast.success(`${product.name} added to basket`, {
			style: {
				background: "#ffffff",
				color: "#1f2937",
				border: "1px solid #e5e7eb",
				borderRadius: "12px",
				fontSize: "14px",
			},
		});
	};

	// Remove item from basket
	const removeFromBasket = (productId: number) => {
		setBasket((prev) => {
			const existing = prev.find((item) => item.product.id === productId);
			if (existing && existing.quantity > 1) {
				return prev.map((item) =>
					item.product.id === productId
						? { ...item, quantity: item.quantity - 1 }
						: item
				);
			}
			return prev.filter((item) => item.product.id !== productId);
		});
	};

	// Get basket item quantity
	const getBasketQuantity = (productId: number) => {
		const item = basket.find((item) => item.product.id === productId);
		return item ? item.quantity : 0;
	};

	// Calculate basket total
	const basketTotal = basket.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);
	const basketItemCount = basket.reduce(
		(total, item) => total + item.quantity,
		0
	);

	// Filter products by category
	const filteredProducts =
		selectedCategory === "all"
			? products
			: products.filter((product) => product.category === selectedCategory);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-primary-500 mx-auto"></div>
					<p className="mt-4 text-gray-600 text-sm">Loading menu...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Toaster position="top-center" />

			{/* Header */}
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<button
								onClick={() => (window.location.href = "/")}
								className="flex items-center text-gray-600 hover:text-gray-900 mr-6 p-2 rounded-xl hover:bg-gray-100 transition-colors">
								<ArrowLeft className="h-5 w-5 mr-2" />
								<span className="font-medium">Home</span>
							</button>
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-button">
									<span className="text-white font-bold text-lg">2T</span>
								</div>
								<div>
									<h1 className="text-xl font-bold text-gray-900">
										2Tasty Menu
									</h1>
									<p className="text-xs text-gray-500">
										Fresh • Local • Delicious
									</p>
								</div>
							</div>
						</div>

						{/* Right side */}
						<div className="flex items-center space-x-4">
							<button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
								<Search className="h-5 w-5" />
							</button>

							<button
								onClick={() => (window.location.href = "/cart")}
								className="relative bg-gray-900 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all duration-200 shadow-button">
								<ShoppingBag className="h-4 w-4" />
								<span className="font-medium">Basket</span>
								{basketItemCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
										{basketItemCount}
									</span>
								)}
								{basketTotal > 0 && (
									<span className="ml-1 font-semibold">
										£{basketTotal.toFixed(2)}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Category Filters */}
			<section className="bg-white border-b border-gray-200 sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex space-x-2 py-6 overflow-x-auto scrollbar-hide">
						<button
							onClick={() => setSelectedCategory("all")}
							className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
								selectedCategory === "all"
									? "bg-gray-900 text-white shadow-button"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}>
							All Items
						</button>
						{CATEGORIES.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
									selectedCategory === category.id
										? "bg-gray-900 text-white shadow-button"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}>
								<span className="text-base">{category.icon}</span>
								<span>{category.name}</span>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Menu Items */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{filteredProducts.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
							<ShoppingBag className="h-8 w-8 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No items found
						</h3>
						<p className="text-gray-500">Try selecting a different category</p>
					</div>
				) : (
					<div className="space-y-6">
						{filteredProducts.map((product) => {
							const quantity = getBasketQuantity(product.id);
							return (
								<div
									key={product.id}
									className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6">
									<div className="flex justify-between items-start">
										{/* Product Info */}
										<div className="flex-1 pr-6">
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<h3 className="text-xl font-semibold text-gray-900 mb-2">
														{product.name}
													</h3>
													<p className="text-gray-600 leading-relaxed mb-3">
														{product.description}
													</p>
												</div>
												<span className="text-2xl font-bold text-primary-600 ml-4">
													£{product.price.toFixed(2)}
												</span>
											</div>

											{/* Details row */}
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4 text-sm text-gray-500">
													<div className="flex items-center">
														<Clock className="h-4 w-4 mr-1" />
														<span>{product.prep_time_minutes} mins</span>
													</div>

													{product.allergens.length > 0 && (
														<div className="flex items-center">
															<AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
															<span className="text-amber-700">
																Contains: {product.allergens.join(", ")}
															</span>
														</div>
													)}
												</div>

												{/* Add to Basket Controls */}
												<div className="flex items-center">
													{quantity === 0 ? (
														<button
															onClick={() => addToBasket(product)}
															className="bg-gray-900 text-white py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2 font-medium shadow-button hover:shadow-card-hover">
															<Plus className="h-4 w-4" />
															<span>Add to Basket</span>
														</button>
													) : (
														<div className="flex items-center bg-gray-100 rounded-xl p-1">
															<button
																onClick={() => removeFromBasket(product.id)}
																className="bg-white rounded-lg p-2.5 hover:bg-gray-50 transition-colors shadow-sm">
																<Minus className="h-4 w-4 text-gray-600" />
															</button>
															<span className="font-semibold text-lg px-4 text-gray-900 min-w-[3rem] text-center">
																{quantity}
															</span>
															<button
																onClick={() => addToBasket(product)}
																className="bg-gray-900 text-white rounded-lg p-2.5 hover:bg-gray-800 transition-colors">
																<Plus className="h-4 w-4" />
															</button>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>

			{/* Floating Basket Summary (Mobile) */}
			{basketItemCount > 0 && (
				<div className="fixed bottom-6 left-4 right-4 md:hidden z-50">
					<button
						onClick={() => (window.location.href = "/cart")}
						className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-card-hover backdrop-blur-sm">
						<div className="flex items-center space-x-3">
							<ShoppingBag className="h-5 w-5" />
							<span className="font-medium">
								{basketItemCount} item{basketItemCount !== 1 ? "s" : ""}
							</span>
						</div>
						<span className="font-bold text-lg">£{basketTotal.toFixed(2)}</span>
					</button>
				</div>
			)}

			{/* Bottom Spacing for Mobile Basket */}
			{basketItemCount > 0 && <div className="h-20 md:hidden"></div>}
		</div>
	);
}
