'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from '@nextui-org/react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Select, SelectItem } from "@nextui-org/select";
import { useForm, Controller } from 'react-hook-form';

const SpeciesList = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSpecies, setCurrentSpecies] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchSpecies = async () => {
    try {
      const response = await axios.get('/api/dateUtil/speciesAndAnimalGroups');
      console.log(response.data.species);
      setSpeciesList(response.data.species);
    } catch (error) {
      console.error('Erro ao buscar as espécies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  const handleEdit = (species) => {
    setCurrentSpecies(species);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/dateUtil/species/${id}`);
      fetchSpecies();
    } catch (error) {
      console.error('Erro ao deletar a espécie:', error);
    }
  };

  const handleCreate = () => {
    setCurrentSpecies(null);
    onOpen();
  };

  const handleFormSubmit = () => {
    onOpenChange(false);
    fetchSpecies();
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <Button onClick={handleCreate}>Criar Nova Espécie</Button>
      <Table isStriped isCompact>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nome Científico</TableColumn>
          <TableColumn>Nome Comum</TableColumn>
          <TableColumn>Grupo Animal</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Não há espécies cadastradas."}>
          {Array.isArray(speciesList) && speciesList.length > 0 ? (
            speciesList.map((species) => (
              <TableRow key={species.id}>
                <TableCell>{species.id}</TableCell>
                <TableCell>{species.scientificName}</TableCell>
                <TableCell>{species.commonName}</TableCell>
                <TableCell>{species.AnimalGroup.groupName}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleEdit(species)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    color="error"
                    onClick={() => handleDelete(species.id)}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : null}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentSpecies ? "Editar Espécie" : "Criar Nova Espécie"}
              </ModalHeader>
              <ModalBody>
                <SpeciesForm species={currentSpecies} onSubmit={handleFormSubmit} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={() => { handleFormSubmit(); onClose(); }}>
                  Voltar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

const SpeciesForm = ({ species, onSubmit }) => {
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      scientificName: '',
      commonName: '',
      AnimalGroupId: ''
    }
  });
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
  }, []);

  useEffect(() => {
    console.log('Species passed to form:', species);
    if (species) {
      reset({
        scientificName: species.scientificName || '',
        commonName: species.commonName || '',
        AnimalGroupId: species.AnimalGroupId || ''
      });
    } else {
      reset({
        scientificName: '',
        commonName: '',
        AnimalGroupId: ''
      });
    }
  }, [species, reset]);

  const onSubmitForm = async (data) => {
    console.log(data);
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
        <Controller
          name="AnimalGroupId"
          control={control}
          render={({ field }) => (
            <Select
              label="Qual o grupo do animal?"
              placeholder="Selecione um grupo"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys).pop())}
            >
              {animalGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.groupName}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
};

export default SpeciesList;
