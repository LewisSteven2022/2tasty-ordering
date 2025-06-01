import { createClient } from "@supabase/supabase-js";

// Temporary hardcoded values for debugging
// Replace these with your actual Supabase values:
const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL ||
	"https://zxcbtybqdbkhotswclhr.supabase.co";
const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2J0eWJxZGJraG90c3djbGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODYzNDgsImV4cCI6MjA2NDI2MjM0OH0.eM9r_B8h1zxAUKor3siRMRHEfYEhJxa3yhH16a3vI3A";

// Debug: Log what we're getting
console.log("🔍 Debug info:");
console.log("- supabaseUrl from env:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
	"- supabaseAnonKey from env:",
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Found" : "Missing"
);
console.log("- Using URL:", supabaseUrl);

if (!supabaseUrl || supabaseUrl.includes("YOUR-PROJECT-ID")) {
	console.error(
		"❌ Please replace the hardcoded values with your actual Supabase credentials"
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(
	supabaseUrl,
	process.env.SUPABASE_SERVICE_ROLE_KEY || "temp-service-key"
);
