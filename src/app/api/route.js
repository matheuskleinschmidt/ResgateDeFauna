import Rescues from './models/Rescues.js';
import Species from './models/Species.js';
import CalledBys from './models/CalledBys.js';
import ProcedureOrientationBys from './models/ProcedureOrientationBys.js';
import Situations from './models/Situations.js';
import PostRescues from './models/PostRescues.js';
import RescueStatus from './models/RescueStatus.js';
import AnimalGroups from './models/AnimalGroups.js';

Rescues.associate({
  Species,
  CalledBys,
  ProcedureOrientationBys,
  Situations,
  PostRescues,
  RescueStatus,
});

Species.associate({ AnimalGroups });
CalledBys.associate({ Rescues });
ProcedureOrientationBys.associate({ Rescues });
Situations.associate({ Rescues });
PostRescues.associate({ Rescues });
RescueStatus.associate({ Rescues });

async function getRescuessWithStrings() {
  try {
    const rescues = await Rescues.findAll({
      include: [
        {
          model: Species,
          as: 'species',
          attributes: ['commonName', 'scientificName'],
        },
        {
          model: CalledBys,
          as: 'calledBy',
          attributes: ['name'],
        },
        {
          model: ProcedureOrientationBys,
          as: 'procedureOrientationBy',
          attributes: ['name'],
        },
        {
          model: Situations,
          as: 'situation',
          attributes: ['name'],
        },
        {
          model: PostRescues,
          as: 'postRescue',
          attributes: ['name'],
        },
        {
          model: RescueStatus,
          as: 'statusRescue',
          attributes: ['name'], 
        },
      ],
      attributes: [
        'id',
        'fullDate',
        'weight',
        'measurement',
        'address',
        'occurrence',
        'age',
        'observation',
        'releaseLocationCoordinates',
      ],
    });

    return rescues;
  } catch (error) {
    console.error('Error fetching rescues with string fields:', error);
  }
}

const getSpeciesWithGroups = async () => {
  try {
    const speciesWithGroups = await Species.findAll({
      attributes: ['id', 'scientificName', 'commonName'],
      include: [
        {
          model: AnimalGroups,
          as: 'animalGroup',  
          attributes: ['groupName'],
        },
      ],
    });

    return speciesWithGroups;
  } catch (error) {
    console.error('Erro ao buscar espécies com grupos:', error);
  }
};

export async function GET(req) {
  const animalGroups = await getRescuessWithStrings()

  return new Response(JSON.stringify(animalGroups), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
