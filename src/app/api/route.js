export async function GET(req) {
  return new Response(JSON.stringify({ Opa: "opa" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
