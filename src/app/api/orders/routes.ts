export async function GET() {
	return Response.json({
		message: "API is working!",
		timestamp: new Date().toISOString(),
	});
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		return Response.json({
			success: true,
			message: "Order received!",
			data: body,
		});
	} catch (error) {
		return Response.json(
			{ error: "Failed to process request" },
			{ status: 500 }
		);
	}
}
