const rescues = [
  {
    "typeOfAnimal": 1,
    "species": "Arara-azul",
    "weight": 2.5,
    "measurement": {
      "height": 0.85,
      "width": 0.3,
      "length": 0.9
    },
    "age": 5,
    "situation": 3,
    "address": "Parque Nacional do Pantanal, Mato Grosso do Sul",
    "addressGeo": {
      "latitude": -19.0151,
      "longitude": -57.0024
    },
    "occurrence": "Animal encontrado com asa ferida, incapaz de voar.",
    "calledVia": 2,
    "procedureVia": 1,
    "date": "2024-08-01T14:30:00Z",
    "postRescue": 4,
    "observation": "Asa direita quebrada, será necessário procedimento cirúrgico.",
    "releaseLocation": {
      "latitude": -19.5123,
      "longitude": -56.7124
    }
  },
  {
    "typeOfAnimal": 2,
    "species": "Tartaruga-verde",
    "weight": 150.0,
    "measurement": {
      "height": 1.0,
      "width": 0.8,
      "length": 1.2
    },
    "age": 50,
    "situation": 1,
    "address": "Praia do Forte, Bahia",
    "addressGeo": {
      "latitude": -12.5781,
      "longitude": -38.1012
    },
    "occurrence": "Tartaruga resgatada após ficar presa em rede de pesca.",
    "calledVia": 3,
    "procedureVia": 2,
    "date": "2024-08-03T09:15:00Z",
    "postRescue": 5,
    "observation": "Animal estava exausto, mas sem ferimentos graves.",
    "releaseLocation": {
      "latitude": -12.5803,
      "longitude": -38.1040
    }
  },
  {
    "typeOfAnimal": 3,
    "species": "Onça-pintada",
    "weight": 90.0,
    "measurement": {
      "height": 0.75,
      "width": 0.5,
      "length": 1.5
    },
    "age": 8,
    "situation": 2,
    "address": "Floresta Amazônica, Amazonas",
    "addressGeo": {
      "latitude": -3.4653,
      "longitude": -62.2159
    },
    "occurrence": "Onça capturada após invadir área urbana em busca de comida.",
    "calledVia": 1,
    "procedureVia": 3,
    "date": "2024-08-05T17:45:00Z",
    "postRescue": 3,
    "observation": "Animal em boas condições de saúde, será monitorado após soltura.",
    "releaseLocation": {
      "latitude": -3.7698,
      "longitude": -62.5172
    }
  }
]





export async function GET(req) {
  return new Response(JSON.stringify(rescues), {
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
