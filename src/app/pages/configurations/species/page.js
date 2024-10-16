"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Link from "next/link";
import SpeciesForm from '@/app/components/SpeciesForm';

const SpeciesList = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSpecies, setCurrentSpecies] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchSpecies = async () => {
    try {
      const response = await axios.get('/api/dateUtil/speciesAndAnimalGroups');
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
                <TableCell>
                  <Link href={`/pages/species/${species.id}`}>
                    {species.id}
                  </Link>
                </TableCell>
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

export default SpeciesList;
