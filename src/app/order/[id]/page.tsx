"use client";

import { useState, useEffect } from "react";
import {
	ShoppingBag,
	Search,
	Clock,
	MapPin,
	Star,
	ArrowRight,
} from "lucide-react";

export default function HomePage() {
	const [basketCount, setBasketCount] = useState(0);
	const [basketTotal, setBasketTotal] = useState(0);

	// Load basket from localStorage
	useEffect(() => {
		const savedBasket = localStorage.getItem("2tasty-cart");
		if (savedBasket) {
			const basket = JSON.parse(savedBasket);
			const itemCount = basket.reduce(
				(total: number, item: any) => total + item.quantity,
				0
			);
			const total = basket.reduce(
				(total: number, item: any) =>
					total + item.product.price * item.quantity,
				0
			);
			setBasketCount(itemCount);
			setBasketTotal(total);
		}
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
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
								href="/menu"
								className="text-gray-500 hover:text-gray-900 transition-colors">
								Menu
							</a>
							<a
								href="#about"
								className="text-gray-500 hover:text-gray-900 transition-colors">
								About
							</a>
							<a
								href="#contact"
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
								<span className="font-medium">Basket</span>
								{basketCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
										{basketCount}
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
											href="/menu"
											className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10 transition-all duration-200 shadow-button hover:shadow-card-hover">
											View Menu
											<ArrowRight className="ml-2 h-5 w-5" />
										</a>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
				<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
					<div className="h-56 w-full bg-gradient-to-br from-primary-50 via-orange-50 to-primary-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center relative">
						{/* Simple food emoji - no animation */}
						<div className="text-8xl opacity-80">🥗</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="about" className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Why Choose 2Tasty?
						</h2>
						<p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
							We're passionate about serving fresh, locally sourced food that
							brings people together.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🌱</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Fresh & Local
							</h3>
							<p className="text-gray-600">
								We source our ingredients locally from Jersey's finest
								suppliers, ensuring freshness and supporting our community.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🚚</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Fast Delivery
							</h3>
							<p className="text-gray-600">
								Quick delivery across Jersey or convenient collection from our
								café. Your food arrives fresh and hot!
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">❤️</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Made with Love
							</h3>
							<p className="text-gray-600">
								Every dish is prepared with care by our passionate chefs who
								take pride in creating delicious meals.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Get In Touch
					</h2>
					<p className="text-lg text-gray-600 mb-8">
						Have questions? We'd love to hear from you.
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
						<div className="flex items-center">
							<span className="text-primary-500 mr-2">📞</span>
							<span className="font-medium">+44 1534 123456</span>
						</div>
						<div className="flex items-center">
							<span className="text-primary-500 mr-2">✉️</span>
							<span className="font-medium">hello@2tasty.com</span>
						</div>
						<div className="flex items-center">
							<span className="text-primary-500 mr-2">📍</span>
							<span className="font-medium">St. Helier, Jersey</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
