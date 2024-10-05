import Users from "./models/users";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
  Users.create({
    id: uuidv4(),
    name: "Admin",
    email: "matheuseckel@gmail.com",
    password: "admin",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return new Response(JSON.stringify({ Opa: "opa" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
