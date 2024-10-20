import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button } from '@nextui-org/react';
import { Select, SelectItem } from "@nextui-org/select";
import axios from 'axios';

const SpeciesForm = ({ species, onSubmit }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [animalGroups, setAnimalGroups] = useState([]);

  const fetchAnimalGroups = async () => {
    try {
      const response = await axios.get('/api/dateUtil/speciesAndAnimalGroups');
      setAnimalGroups(response.data.animalGroups);
    } catch (error) {
      console.error('Erro ao buscar os grupos de animais:', error);
    }
  };

  useEffect(() => {
    fetchAnimalGroups();
    if (species) {
      setValue('scientificName', species.scientificName);
      setValue('commonName', species.commonName);
      setValue('AnimalGroupId', species.AnimalGroupId);
    }
  }, [species, setValue]);

  const onSubmitForm = async (data) => {
    try {
      if (species) {
        await axios.put(`/api/dateUtil/species/${species.id}`, data);
      } else {
        await axios.post('/api/dateUtil/species/', data);
      }
      onSubmit();
    } catch (error) {
      console.error('Erro ao salvar a espécie:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Input {...register('scientificName')} label="Nome Científico" placeholder="Nome Científico" />
      <Input {...register('commonName')} label="Nome Comum" placeholder="Nome Comum" />
      <div>
        <Select
          id="animalGroup"
          {...register('AnimalGroupId')}
          defaultValue={species?.AnimalGroupId || ''}
          onChange={(e) => setValue('AnimalGroupId', Number(e.target.value))}
          label="Qual o grupo do animal?"
        >
          <SelectItem value="" disabled>
            Selecione um grupo
          </SelectItem>
          {animalGroups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.groupName}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
};

export default SpeciesForm;
