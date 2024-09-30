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
    // Verifique se data.date existe e tem year, month e day válidos
    const { year, month, day } = data.date || {};
    if (!year || !month || !day) {
      throw new Error('Data inválida: Ano, mês ou dia ausentes.');
    }

    const { hour = 0, minute = 0, second = 0, millisecond = 0 } = data.time || {};

    const fullDate = new Date(year, month - 1, day, hour, minute, second, millisecond);

    // Verifique se height, length e width são válidos
    const measurement = {
      height: parseFloat(data.height) || 0,
      length: parseFloat(data.length) || 0,
      width: parseFloat(data.width) || 0,
    };

    // Verifique se locationCoordinates é uma string válida
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

    // Verifique se releaseLocationCoordinates é uma string válida
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
      animalTypeId: parseInt(data.Species) || null,
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



