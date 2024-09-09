import data from "./../../../api/rescue/mock.json";

const rescues = data;

const teste = {
  id: 1,
  typeOfAnimal: 1,
  species: "Arara-azul",
  weight: 2.5,
  height: 0.85,
  width: 0.3,
  length: 0.9,
  age: 5,
  situation: 3,
  address: "Parque Nacional do Pantanal, Mato Grosso do Sul",
  addressGeo: {
    latitude: -19.0151,
    longitude: -57.0024,
  },
  occurrence: "Animal encontrado com asa ferida, incapaz de voar.",
  calledVia: 2,
  procedureVia: 1,
  date: "2024-08-01T14:30:00Z",
  postRescue: 4,
  observation: "Asa direita quebrada, será necessário procedimento cirúrgico.",
  releaseLocation: {
    latitude: -19.5123,
    longitude: -56.7124,
  },
};

export async function GET(req, { params }) {
  const { id } = params; // Pegando o id da URL diretamente de params

  console.log(id);
  return new Response(JSON.stringify(teste), {
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

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(
      "---------------------------------------------------------------------------------------------------------------------"
    );
    console.log("Request Body:", body);

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
