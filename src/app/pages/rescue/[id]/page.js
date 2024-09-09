"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React from "react";
import { DatePicker } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/react";
import useGeolocation from "../../../components/useGeolocation";
import data from "../../../utils/datas.js";

export default function App({ params }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const { location, getLocation, error } = useGeolocation();
  const [rescue, setRescue] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        
        const apiUrl = `${baseUrl}/api/rescue/${params.id}`;
        console.log(apiUrl);
        const response = await axios.get(apiUrl);

        console.log(response);
        setRescue(response.data);
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };
    

    fetchRescueData();
  }, []);

  const handleGetLocation = async () => {
    try {
      const location = await getLocation();
      if (location.latitude && location.longitude) {
        setValue("location", `${location.latitude}, ${location.longitude}`);
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const handleGetLocation1 = async () => {
    try {
      const location = await getLocation();
      if (location.latitude && location.longitude) {
        setValue("location1", `${location.latitude}, ${location.longitude}`);
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      const speciesForGroup = data.allSpecies.filter(
        (species) => species.groupId === selectedGroup
      );
      setFilteredSpecies(speciesForGroup);
    } else {
      setFilteredSpecies([]);
    }
  }, [selectedGroup]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const baseUrl = window.location.origin;

    const apiUrl = `${baseUrl}/api/rescue`;
    console.log(apiUrl);
    try {
      const response = await axios.post(apiUrl, data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md"
    >
    <div>My Post: {params.id}</div>
    <div>My Post: {rescue.typeOfAnimal}</div>
      <Controller
        name="date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            label="Dia da ocorrência"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização do resgate"
            placeholder="Clique no botão para preencher"
          />
        )}
      />
      {error && <p>Error: {error}</p>}
      <Button className="w-full max-w-xs mb-4" onClick={handleGetLocation}>
        Obter Localização
      </Button>

      <Controller
        name="AnimalGroup"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual o grupo do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              setSelectedGroup(value.target.value);
            }}
          >
            {data.AnimalGroups.map((AnimalGroups) => (
              <SelectItem key={AnimalGroups.key} value={AnimalGroups.key}>
                {AnimalGroups.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="Species"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual a espécie do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
            disabled={!selectedGroup}
          >
            {filteredSpecies.map((species) => (
              <SelectItem key={species.id} value={species.id}>
                {`${species.commonName} - ${species.scientificName}`}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="weight"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="0.00"
            label="Peso do animal (Kg)"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <h3>Medidas</h3>
      <h4>Em metros</h4>
      <Controller
        name="height"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="0.00"
            label="Altura do animal"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="length"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="0.00"
            label="Comprimento do animal"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="width"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="0.00"
            label="Largura do animal"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="adress"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço do resgate"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="occurrence"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Textarea
            inputMode="text"
            label="O que ocorreu?"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="calledBy"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="O chamado é via?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.calledBy.map((calledBy) => (
              <SelectItem key={calledBy.key} value={calledBy.key}>
                {calledBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="procedureBy"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="O procedimento foi via?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.procedureBy.map((procedureBy) => (
              <SelectItem key={procedureBy.key} value={procedureBy.key}>
                {procedureBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="age"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Idade do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.ages.map((ages) => (
              <SelectItem key={ages.key} value={ages.key}>
                {ages.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="situation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Situação do animal?"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.situations.map((situations) => (
              <SelectItem key={situations.key} value={situations.key}>
                {situations.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="postRescue"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Pós o resgate"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          >
            {data.postRescue.map((postRescue) => (
              <SelectItem key={postRescue.key} value={postRescue.key}>
                {postRescue.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Controller
        name="observation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Textarea
            inputMode="text"
            label="Alguma observação?"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="releaseLocation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço da soltura"
            className="w-full max-w-xs mb-4"
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="location1"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização da soltura"
            placeholder="Clique no botão para preencher"
          />
        )}
      />
      {error && <p>Error: {error}</p>}
      <Button className="w-full max-w-xs mb-4" onClick={handleGetLocation1}>
        Obter Localização
      </Button>

      <Button type="submit" className="mt-4 w-full sm:max-w-xs mb-4">
        Enviar
      </Button>
    </form>
  );
}
