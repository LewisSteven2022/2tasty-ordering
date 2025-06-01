import { NextRequest } from "next/server";

export async function GET() {
	return Response.json({
		message: "✅ Orders API is working!",
		timestamp: new Date().toISOString(),
		method: "GET",
	});
}

export async function POST(request: NextRequest) {
	try {
		console.log("📝 Order API called");

		const orderData = await request.json();
		console.log("📦 Order data received:", orderData);

		// Just return success for now to test
		return Response.json({
			success: true,
			message: "Order received successfully!",
			order: {
				id: Math.floor(Math.random() * 1000),
				order_number: `2T-${Date.now()}`,
				...orderData,
			},
		});
	} catch (error) {
		console.error("💥 API Error:", error);
		return Response.json(
			{
				error: "Failed to process order",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
