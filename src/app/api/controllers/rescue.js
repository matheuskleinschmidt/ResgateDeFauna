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
          include: [
            {
              model: AnimalGroups,
              attributes: ['id', 'groupName'] 
            }
          ]
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
      order: ['fullDate']
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


const INVALID_DATE_ERROR = 'Data inválida: Ano, mês ou dia ausentes.';
const INVALID_LOCATION_COORDS_ERROR = 'Coordenadas de localização inválidas';
const INVALID_RELEASE_COORDS_ERROR = 'Coordenadas de liberação inválidas';

function parseCoordinates(coordinateString, errorMessage) {
  if (!coordinateString || coordinateString.trim() === '') {
    return null;
  }

  const coords = coordinateString.split(',');
  if (coords.length !== 2) {
    throw new Error(errorMessage);
  }

  const [latitudeStr, longitudeStr] = coords.map(coord => coord.trim());
  const latitude = parseFloat(latitudeStr);
  const longitude = parseFloat(longitudeStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error(errorMessage);
  }

  return { latitude, longitude };
}

function buildFullDate(date, time) {
  const { year, month, day } = date;
  if (!year || !month || !day) {
    throw new Error(INVALID_DATE_ERROR);
  }

  const {
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
  } = time || {};

  return new Date(year, month - 1, day, hour, minute, second, millisecond);
}

function buildMeasurement(data) {
  const height = parseFloat(data.height);
  const length = parseFloat(data.length);
  const width = parseFloat(data.width);

  return {
    height: isNaN(height) ? 0 : height,
    length: isNaN(length) ? 0 : length,
    width: isNaN(width) ? 0 : width,
  };
}

function buildRescueData(data, fullDate, measurement, locationCoordinates, releaseLocationCoordinates) {
  return {
    speciesId: data.Species ? parseInt(data.Species, 10) || null : null,
    fullDate,
    weight: parseFloat(data.weight) || 0,
    measurement,
    occurrence: data.occurrence || '',
    calledById: data.calledBy ? parseInt(data.calledBy, 10) || null : null,
    procedureOrientationById: data.procedureBy ? parseInt(data.procedureBy, 10) || null : null,
    ageRangeId: data.ageRange !== null ? parseInt(data.ageRange, 10) || null : null,
    situationId: data.situation ? parseInt(data.situation, 10) || null : null,
    postRescueId: data.postRescue ? parseInt(data.postRescue, 10) || null : null,
    observation: data.observation || '',
    address: data.address || '',
    userId: null, 
    locationCoordinates,
    releaseLocationCoordinates,
    statusRescueId: null, 
  };
}

export async function createOrUpdateRescueRecord(id, data) {
  console.log('data', data);
  try {
    const { date = {}, time = {} } = data;
    const fullDate = buildFullDate(date, time);

    const measurement = buildMeasurement(data);

    const locationCoordinates = parseCoordinates(
      data.locationCoordinates,
      INVALID_LOCATION_COORDS_ERROR
    );

    const releaseLocationCoordinates = parseCoordinates(
      data.releaseLocationCoordinates,
      INVALID_RELEASE_COORDS_ERROR
    );

    const rescueData = buildRescueData(
      data,
      fullDate,
      measurement,
      locationCoordinates,
      releaseLocationCoordinates
    );

    if (id) {
      const [updatedRows] = await Rescues.update(rescueData, { where: { id } });
      if (updatedRows === 0) {
        console.warn(`Nenhum registro encontrado para o ID: ${id}`);
      } else {
        console.log('Registro de resgate atualizado com sucesso');
      }
    } else {
      await Rescues.create(rescueData);
      console.log('Registro de resgate criado com sucesso');
    }
  } catch (error) {
    console.error('Erro ao criar ou atualizar registro de resgate:', error.message);
  }
}


export async function deleteRescue(id) {
  try {
    await Rescues.destroy({ where: { id: id } });
    console.log('Registro de resgate excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir registro de resgate:', error);
  }
}



