import Rescues from '@/app/api/models/Rescues'; 


async function createRescueRecord(data) {
  try {

    const { year, month, day } = data.date;
    const fullDate = new Date(`${year}-${month}-${day}`);

    const measurement = {
      height: parseFloat(data.height),
      length: parseFloat(data.length),
      width: parseFloat(data.width),
    };

    const locationCoordinates = {
      latitude: parseFloat(data.location.split(',')[0]),
      longitude: parseFloat(data.location.split(',')[1]),
    };

    const releaseLocationCoordinates = {
      latitude: parseFloat(data.location1.split(',')[0]),
      longitude: parseFloat(data.location1.split(',')[1]),
    };

    const rescue = await Rescues.create({
      animalTypeId: parseInt(data.Species), 
      fullDate: fullDate,
      weight: parseFloat(data.weight),
      measurement: measurement,
      occurrence: data.occurrence, 
      calledById: parseInt(data.calledBy),
      procedureOrientationById: parseInt(data.procedureBy), 
      age: parseInt(data.age),
      situationId: parseInt(data.situation),
      postRescueId: parseInt(data.postRescue), 
      observation: data.observation,
      address: data.adress, 
      locationCoordinates: locationCoordinates, 
      releaseLocationCoordinates: releaseLocationCoordinates, 
      statusRescueId: null, 
    });

    console.log('Registro de resgate criado com sucesso:', rescue);
  } catch (error) {
    console.error('Erro ao criar registro de resgate:', error);
  }
}


export default createRescueRecord; 
