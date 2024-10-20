import { createOrUpdateAnimalGroup } from "@/app/api/controllers/animalGroups";

export async function POST(req, { params }) {
  const body = await req.json();
  let data = await createOrUpdateAnimalGroup(false, body)
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
  });
}