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
	Star,
	Search,
	MapPin,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MenuPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [cart, setCart] = useState<CartItem[]>([]);
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

	// Load cart from localStorage
	useEffect(() => {
		const savedCart = localStorage.getItem("2tasty-cart");
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("2tasty-cart", JSON.stringify(cart));
	}, [cart]);

	// Add item to cart
	const addToCart = (product: Product) => {
		setCart((prev) => {
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
		toast.success(`${product.name} added to cart`, {
			style: {
				background: "#ffffff",
				color: "#1f2937",
				border: "1px solid #e5e7eb",
				borderRadius: "12px",
				fontSize: "14px",
			},
		});
	};

	// Remove item from cart
	const removeFromCart = (productId: number) => {
		setCart((prev) => {
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

	// Get cart item quantity
	const getCartQuantity = (productId: number) => {
		const item = cart.find((item) => item.product.id === productId);
		return item ? item.quantity : 0;
	};

	// Calculate cart total
	const cartTotal = cart.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);
	const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-button">
									<span className="text-white font-bold text-lg">2T</span>
								</div>
								<div>
									<h1 className="text-xl font-bold text-gray-900">2Tasty</h1>
									<p className="text-xs text-gray-500">
										Fresh • Local • Delicious
									</p>
								</div>
							</div>
						</div>

						{/* Navigation */}
						<nav className="hidden md:flex items-center space-x-8">
							<a
								href="#"
								className="text-gray-900 font-medium hover:text-primary-600 transition-colors">
								Home
							</a>
							<a
								href="#menu"
								className="text-gray-500 hover:text-gray-900 transition-colors">
								Menu
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-gray-900 transition-colors">
								About
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-gray-900 transition-colors">
								Contact
							</a>
						</nav>

						{/* Right side */}
						<div className="flex items-center space-x-4">
							<button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
								<Search className="h-5 w-5" />
							</button>

							<button
								onClick={() => (window.location.href = "/cart")}
								className="relative bg-gray-900 text-white px-6 py-2.5 rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-all duration-200 shadow-button">
								<ShoppingBag className="h-4 w-4" />
								<span className="font-medium">Cart</span>
								{cartItemCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
										{cartItemCount}
									</span>
								)}
								{cartTotal > 0 && (
									<span className="ml-1 font-semibold">
										£{cartTotal.toFixed(2)}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative bg-white overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 lg:w-full lg:max-w-2xl xl:max-w-none">
						<main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
							<div className="sm:text-center lg:text-left">
								<h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
									<span className="block xl:inline">Order your</span>
									<span className="block text-primary-500 xl:inline">
										{" "}
										favourite Foods
									</span>
								</h1>
								<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
									Fresh and tasty food delivered to your door. Choose from our
									wide selection of delicious meals prepared with love.
								</p>

								{/* Stats */}
								<div className="mt-8 flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
									<div className="flex items-center">
										<Clock className="h-4 w-4 mr-2 text-primary-500" />
										<span>Mon-Sat: 7:30 AM - 4:00 PM</span>
									</div>
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-2 text-primary-500" />
										<span>Delivery & Collection Available</span>
									</div>
									<div className="flex items-center">
										<Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
										<span>4.8★ (200+ reviews)</span>
									</div>
								</div>

								<div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
									<div className="rounded-xl">
										<a
											href="#menu"
											className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-button hover:shadow-card-hover">
											Browse Menu
										</a>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
				<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
					<div className="h-56 w-full bg-gradient-to-br from-primary-50 via-orange-50 to-primary-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative">
						{/* Decorative food emoji */}
						<div className="text-8xl opacity-80">🥗</div>
						<div className="absolute top-10 right-10 text-4xl animate-bounce">
							🍅
						</div>
						<div className="absolute bottom-20 left-10 text-3xl animate-pulse">
							🥑
						</div>
					</div>
				</div>
			</section>

			{/* Category Filters */}
			<section
				id="menu"
				className="bg-white border-b border-gray-200 sticky top-16 z-40">
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredProducts.map((product) => {
							const quantity = getCartQuantity(product.id);
							return (
								<div key={product.id} className="group">
									<div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
										{/* Product Image */}
										<div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
											{product.image_url ? (
												<img
													src={product.image_url}
													alt={product.name}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<span className="text-5xl opacity-60">
														{CATEGORIES.find((c) => c.id === product.category)
															?.icon || "🍽️"}
													</span>
												</div>
											)}
											{/* Rating Badge */}
											<div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
												<Star className="h-3 w-3 text-yellow-400 fill-current" />
												<span className="text-xs font-medium text-gray-900">
													4.8
												</span>
											</div>
										</div>

										{/* Product Info */}
										<div className="p-5">
											<div className="flex justify-between items-start mb-2">
												<h3 className="font-semibold text-gray-900 leading-tight text-lg">
													{product.name}
												</h3>
												<span className="text-lg font-bold text-gray-900 ml-2">
													£{product.price.toFixed(2)}
												</span>
											</div>

											<p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
												{product.description}
											</p>

											{/* Prep time and allergens */}
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center space-x-1 text-xs text-gray-400">
													<Clock className="h-3 w-3" />
													<span>{product.prep_time_minutes} mins</span>
												</div>
												{product.allergens.length > 0 && (
													<div className="text-xs text-gray-400">
														Contains: {product.allergens.slice(0, 2).join(", ")}
														{product.allergens.length > 2 ? "..." : ""}
													</div>
												)}
											</div>

											{/* Add to Cart Controls */}
											{quantity === 0 ? (
												<button
													onClick={() => addToCart(product)}
													className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-button hover:shadow-card-hover">
													<Plus className="h-4 w-4" />
													<span>Add to Cart</span>
												</button>
											) : (
												<div className="flex items-center justify-between bg-gray-100 rounded-xl p-1">
													<button
														onClick={() => removeFromCart(product.id)}
														className="bg-white rounded-lg p-2.5 hover:bg-gray-50 transition-colors shadow-sm">
														<Minus className="h-4 w-4 text-gray-600" />
													</button>
													<span className="font-semibold text-lg px-4 text-gray-900">
														{quantity}
													</span>
													<button
														onClick={() => addToCart(product)}
														className="bg-gray-900 text-white rounded-lg p-2.5 hover:bg-gray-800 transition-colors">
														<Plus className="h-4 w-4" />
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</main>

			{/* Floating Cart Summary (Mobile) */}
			{cartItemCount > 0 && (
				<div className="fixed bottom-6 left-4 right-4 md:hidden z-50">
					<button
						onClick={() => (window.location.href = "/cart")}
						className="w-full bg-gray-900 text-white py-4 px-6 rounded-2xl flex items-center justify-between shadow-card-hover backdrop-blur-sm">
						<div className="flex items-center space-x-3">
							<ShoppingBag className="h-5 w-5" />
							<span className="font-medium">
								{cartItemCount} item{cartItemCount !== 1 ? "s" : ""}
							</span>
						</div>
						<span className="font-bold text-lg">£{cartTotal.toFixed(2)}</span>
					</button>
				</div>
			)}

			{/* Bottom Spacing for Mobile Cart */}
			{cartItemCount > 0 && <div className="h-20 md:hidden"></div>}
		</div>
	);
}
