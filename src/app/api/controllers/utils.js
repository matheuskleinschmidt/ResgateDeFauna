import Rescues from "@/app/api/models/Rescues";
import Species from "@/app/api/models/Species.js";
import CalledBys from "@/app/api/models/CalledBys.js";
import ProcedureOrientationBys from "@/app/api/models/ProcedureOrientationBys.js";
import Situations from "@/app/api/models/Situations.js";
import PostRescues from "@/app/api/models/PostRescues.js";
import status from "@/app/api/models/Status.js";
import AnimalGroups from "@/app/api/models/AnimalGroups.js";
import AgeRanges from "@/app/api/models/ageRanges.js";

export async function getauxiliaryInfos() {
  try {
    return {
      calledBys: await CalledBys.findAll({attributes: ["id", "name"]}),
      procedureOrientationBys: await ProcedureOrientationBys.findAll({attributes: ["id", "name"]}),
      situations: await Situations.findAll({attributes: ["id", "name"]}),
      postRescues: await PostRescues.findAll({attributes: ["id", "name"]}),
      status: await status.findAll({attributes: ["id", "name"]}),
      ageRanges: await AgeRanges.findAll({attributes: ["id", "name"]}),
    };
  } catch (err) {
    console.error("Erro ao buscar informações auxiliares:", err);
    throw err;
  }
}

export async function getSpeciesAndAnimalGroups() {
  try {
    const species = await Species.findAll({
      include: [
        {
          model: AnimalGroups,
          attributes: ['id', 'groupName'],
        },
      ],
      attributes: ['id', 'scientificName', 'commonName', 'AnimalGroupId'],
    });

    const animalGroups = await AnimalGroups.findAll({
      attributes: ['id', 'groupName'],
    });

    return { species, animalGroups };
  } catch (err) {
    console.error('Error fetching species and animal groups:', err);
    throw err;
  }
}
