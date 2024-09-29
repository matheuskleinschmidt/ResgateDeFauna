import Rescues from '@/app/api/models/Rescues'; 
import Species from '@/app/api/models/Species.js';
import CalledBys from '@/app/api/models/CalledBys.js';
import ProcedureOrientationBys from '@/app/api/models/ProcedureOrientationBys.js';
import Situations from '@/app/api/models/Situations.js';
import PostRescues from '@/app/api/models/PostRescues.js';
import RescueStatus from '@/app/api/models/RescueStatus.js';
import AnimalGroups from '@/app/api/models/AnimalGroups.js';
import AgeRanges from '@/app/api/models/ageRanges.js';

Rescues.associate({
  Species,
  CalledBys,
  ProcedureOrientationBys,
  Situations,
  PostRescues,
  RescueStatus,
  AgeRanges
});

Species.associate({ AnimalGroups });
CalledBys.associate({ Rescues });
ProcedureOrientationBys.associate({ Rescues });
Situations.associate({ Rescues });
PostRescues.associate({ Rescues });
RescueStatus.associate({ Rescues });
AgeRanges.associate({ Rescues });

export async function getRescuesWithStrings(id) {
  try {
    const queryOptions = {
      include: [
        {
          model: Species,
          as: 'species',
          attributes: ['commonName', 'scientificName','groupId','id'],
        },
        {
          model: CalledBys,
          as: 'calledBy',
          attributes: ['name'],
        },
        {
          model: AgeRanges,
          as: 'ageRange',
          attributes: ['name','id'],
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
        'locationCoordinates',
      ],
    };

    if (id) {
      queryOptions.where = { id };
    }

    const rescues = await Rescues.findAll(queryOptions);
    return rescues;
  } catch (error) {
    console.error('Error fetching rescues with string fields:', error);
  }
}


export async function createOrUpdateRescueRecord(id, data) {
  try {
    const { year, month, day } = data.date;
    const { hour = 0, minute = 0, second = 0, millisecond = 0 } = data.time || {};

    const fullDate = new Date(year, month - 1, day, hour, minute, second, millisecond);

    const measurement = {
      height: parseFloat(data.height),
      length: parseFloat(data.length),
      width: parseFloat(data.width),
    };

    const locationCoords = data.locationCoordinates.split(',');
    const locationCoordinates = {
      latitude: parseFloat(locationCoords[0].trim()),
      longitude: parseFloat(locationCoords[1].trim()),
    };

    let releaseLocationCoordinates = null;
    if (data.releaseLocationCoordinates && data.releaseLocationCoordinates.trim() !== '') {
      const releaseLocationCoords = data.releaseLocationCoordinates.split(',');
      releaseLocationCoordinates = {
        latitude: parseFloat(releaseLocationCoords[0].trim()),
        longitude: parseFloat(releaseLocationCoords[1].trim()),
      };
    }

    const rescueData = {
      animalTypeId: parseInt(data.Species),
      fullDate: fullDate,
      weight: parseFloat(data.weight),
      measurement: measurement,
      occurrence: data.occurrence,
      calledById: data.calledBy ? parseInt(data.calledBy) : null,
      procedureOrientationById: data.procedureBy ? parseInt(data.procedureBy) : null,
      age: data.age !== null ? parseInt(data.age) : null,
      situationId: data.situation ? parseInt(data.situation) : null,
      postRescueId: data.postRescue ? parseInt(data.postRescue) : null,
      observation: data.observation,
      address: data.adress,
      locationCoordinates: locationCoordinates,
      releaseLocationCoordinates: releaseLocationCoordinates,
      statusRescueId: null,
    };

    if (id) {
      await Rescues.update(rescueData, { where: { id: id } });
      console.log('Registro de resgate atualizado com sucesso');
    } else {
      await Rescues.create(rescueData);
      console.log('Registro de resgate criado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar registro de resgate:', error);
  }
}



