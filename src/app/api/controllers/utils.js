import Rescues from "@/app/api/models/Rescues";
import Species from "@/app/api/models/Species.js";
import CalledBys from "@/app/api/models/CalledBys.js";
import ProcedureOrientationBys from "@/app/api/models/ProcedureOrientationBys.js";
import Situations from "@/app/api/models/Situations.js";
import PostRescues from "@/app/api/models/PostRescues.js";
import status from "@/app/api/models/Status.js";
import AnimalGroups from "@/app/api/models/AnimalGroups.js";
import AgeRanges from "@/app/api/models/ageRanges.js";
import Users from "@/app/api/models/users";

export async function getauxiliaryInfos() {
  try {
    return {
      calledBys: await CalledBys.findAll(),
      procedureOrientationBys: await ProcedureOrientationBys.findAll(),
      situations: await Situations.findAll(),
      postRescues: await PostRescues.findAll(),
      status: await status.findAll(),
      ageRanges: await AgeRanges.findAll(),
    };
  } catch (err) {
    console.error("Erro ao buscar informações auxiliares:", err);
    throw err;
  }
}

export async function getSpeciesAndAnimalGroups() {
  try {
    let species = await Species.findAll({
      include: [
        {
          model: AnimalGroups,
          attributes: ["id", "groupName"],
        },
      ],
      attributes: ["id", "scientificName", "commonName", "AnimalGroupId"],
    });

    let animalGroups = await AnimalGroups.findAll({
      attributes: ["id", "groupName"],
    });

    return { species, animalGroups };
  } catch (err) {
    console.error(
      "Erro ao buscar informações sobre species e grupos de animais:",
      err
    );
    throw err;
  }
}