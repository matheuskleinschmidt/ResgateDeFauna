export async function GET(req) {
  return new Response(JSON.stringify({ text: 'Hello' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req) {
  return new Response(JSON.stringify({ text: 'Hello' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
