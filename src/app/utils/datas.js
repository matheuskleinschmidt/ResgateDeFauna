"use client";

const calledBy = [
    { key: "1", label: "Ouvidoria" },
    { key: "2", label: "Telefone" },
    { key: "3", label: "Whatsapp" },
    { key: "4", label: "Facebook" },
    { key: "5", label: "Instagram" },
    { key: "6", label: "E-mail" },
    { key: "7", label: "Na fujama" },
    { key: "8", label: "Bombeiros" },
    { key: "9", label: "Outros" },
  ];
  
  const procedureBy = [
    { key: "1", label: "Resgate " },
    { key: "2", label: "Telefone " },
    { key: "3", label: "Whatsapp" },
    { key: "4", label: "Facebook" },
    { key: "5", label: "Instagram" },
    { key: "6", label: "E-mail" },
    { key: "7", label: "Sistema Ouvidoria" },
    { key: "8", label: "Animal não localizado" },
    { key: "9", label: "Outros" },
  ];
  
  const ageRanges = [
    { key: "1", label: "Filhote" },
    { key: "2", label: "Adulto" },
    { key: "3", label: "Idoso" },
    { key: "4", label: "Outros" },
  ];
  
  const situations = [
    { key: "1", label: "Atropelamento" },
    { key: "2", label: "Caça" },
    { key: "3", label: "Ataque por Pets" },
    { key: "4", label: "Vidraça" },
    { key: "5", label: "Cativeiro" },
    { key: "6", label: "Outros" },
  ];
  
  const postRescue = [
    { key: "1", label: "Soltura imediata" },
    { key: "2", label: "Veterinário + soltura/internação " },
    { key: "3", label: "Veterinário + soltura sem internação " },
    { key: "4", label: "Cetas" },
    { key: "5", label: "Obito" },
    { key: "6", label: "Butanta " },
    { key: "7", label: "Outros" },
  ];
  
  const AnimalGroups = [
    { key: "1", label: "Mamifero" },
    { key: "2", label: "Répteis " },
    { key: "3", label: "Aves " },
    { key: "4", label: "Peixes" },
    { key: "5", label: "Anfibios" },
    { key: "6", label: "Outros" },
  ];
  
  const allSpecies = [
    {
      id: "1",
      scientificName: "Canis lupus",
      commonName: "Lobo",
      AnimalGroupId: "1",
    },
    {
      id: "2",
      scientificName: "Felis catus",
      commonName: "Gato",
      AnimalGroupId: "1", 
    },
    {
      id: "3",
      scientificName: "Python regius",
      commonName: "Píton-real",
      AnimalGroupId: "2",
    },
    {
      id: "4",
      scientificName: "Chelonia mydas",
      commonName: "Tartaruga-verde",
      AnimalGroupId: "2",
    },
    {
      id: "5",
      scientificName: "Falco peregrinus",
      commonName: "Falcão-peregrino",
      AnimalGroupId: "3",
    },
    {
      id: "6",
      scientificName: "Ara macao",
      commonName: "Arara-vermelha",
      AnimalGroupId: "3",
    },
  ];

  module.exports = {calledBy, procedureBy,ageRanges,situations,postRescue,AnimalGroups,allSpecies}