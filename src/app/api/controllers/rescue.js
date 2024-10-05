import Rescues from '@/app/api/models/Rescues'; 
import Species from '@/app/api/models/Species.js';
import CalledBys from '@/app/api/models/CalledBys.js';
import ProcedureOrientationBys from '@/app/api/models/ProcedureOrientationBys.js';
import Situations from '@/app/api/models/Situations.js';
import PostRescues from '@/app/api/models/PostRescues.js';
import status from '@/app/api/models/Status.js';
import AnimalGroups from '@/app/api/models/AnimalGroups.js';
import AgeRanges from '@/app/api/models/ageRanges.js';
import Users from '@/app/api/models/users';

export async function getRescuesWithStrings(id) {
  try {
    const queryOptions = {
      include: [
        {
          model: Users,
        },
        {
          model: Species,
        },
        {
          model: CalledBys,
        },
        {
          model: AgeRanges,
        },
        {
          model: ProcedureOrientationBys,
        },
        {
          model: Situations,
        },
        {
          model: PostRescues,
        },
        {
          model: status,
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
    const { year, month, day } = data.date || {};
    if (!year || !month || !day) {
      throw new Error('Data inválida: Ano, mês ou dia ausentes.');
    }

    const { hour = 0, minute = 0, second = 0, millisecond = 0 } = data.time || {};

    const fullDate = new Date(year, month - 1, day, hour, minute, second, millisecond);

    const measurement = {
      height: parseFloat(data.height) || 0,
      length: parseFloat(data.length) || 0,
      width: parseFloat(data.width) || 0,
    };

    let locationCoordinates = null;
    if (data.locationCoordinates && data.locationCoordinates.trim() !== '') {
      const locationCoords = data.locationCoordinates.split(',');
      if (locationCoords.length === 2) {
        locationCoordinates = {
          latitude: parseFloat(locationCoords[0].trim()),
          longitude: parseFloat(locationCoords[1].trim()),
        };
      } else {
        throw new Error('Coordenadas de localização inválidas');
      }
    }

    let releaseLocationCoordinates = null;
    if (data.releaseLocationCoordinates && data.releaseLocationCoordinates.trim() !== '') {
      const releaseLocationCoords = data.releaseLocationCoordinates.split(',');
      if (releaseLocationCoords.length === 2) {
        releaseLocationCoordinates = {
          latitude: parseFloat(releaseLocationCoords[0].trim()),
          longitude: parseFloat(releaseLocationCoords[1].trim()),
        };
      } else {
        throw new Error('Coordenadas de liberação inválidas');
      }
    }

    const rescueData = {
      speciesId: parseInt(data.Species) || null,
      fullDate: fullDate,
      weight: parseFloat(data.weight) || 0,
      measurement: measurement,
      occurrence: data.occurrence || '',
      calledById: data.calledBy ? parseInt(data.calledBy) : null,
      procedureOrientationById: data.procedureBy ? parseInt(data.procedureBy) : null,
      ageRangeId: data.ageRange !== null ? parseInt(data.ageRange) : null,
      situationId: data.situation ? parseInt(data.situation) : null,
      postRescueId: data.postRescue ? parseInt(data.postRescue) : null,
      observation: data.observation || '',
      address: data.address || '',
      "userId": null,
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



