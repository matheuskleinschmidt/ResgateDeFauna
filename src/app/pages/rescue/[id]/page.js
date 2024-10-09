"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React from "react";
import { DatePicker } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/react";
import {TimeInput} from "@nextui-org/date-input";
import {parseDate, getLocalTimeZone, Time} from "@internationalized/date";
import useGeolocation from "../../../components/useGeolocation";
import data from "../../../utils/datas.js";
import { useRouter } from "next/navigation"; 

export default function App({ params }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const { getLocation, error } = useGeolocation();
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    control,
  } = useForm();

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/rescue/${params.id}`;
        const response = await axios.get(apiUrl);
        const dataResponse = response.data[0]; 

        setValue("Species", dataResponse.species.id.toString());

        setSelectedGroup(dataResponse.species.AnimalGroupId.toString());
        setValue("AnimalGroup", dataResponse.species.AnimalGroupId.toString());


        const dateString = dataResponse.fullDate.split("T")[0];
        const dateValue = parseDate(dateString);
        setValue("date", dateValue);

        const timeString = dataResponse.fullDate.split("T")[1]; 
        const timeParts = timeString.split(":"); 
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const timeValue = new Time(hours, minutes);
        setValue("time", timeValue);

        setValue(
          "locationCoordinates",
          `${dataResponse.locationCoordinates !=  null ? dataResponse.locationCoordinates.latitude : null}, ${dataResponse.locationCoordinates !=  null ? dataResponse.locationCoordinates.longitude : null}`
        );
        setValue("weight", dataResponse.weight);
        setValue("adress", dataResponse.address);
        setValue("occurrence", dataResponse.occurrence);
        setValue("observation", dataResponse.observation);

        setValue(
          "releaseLocationCoordinates",
          dataResponse.releaseLocationCoordinates 
            ? `${dataResponse.releaseLocationCoordinates.latitude}, ${dataResponse.releaseLocationCoordinates.longitude}`
            : null
        );

        setValue("height", dataResponse.measurement.height);
        setValue("length", dataResponse.measurement.length);
        setValue("width", dataResponse.measurement.width);

        const normalizeString = (str) => str.toString().toLowerCase().trim();

        const ageItem = data.ageRanges.find(
          (item) =>
            normalizeString(item.label) === normalizeString(dataResponse.ageRange.name.toString())
        );
        const ageKey = ageItem ? ageItem.key.toString() : null;
        setValue("ageRange", ageKey);

        const calledByName = dataResponse.calledBy?.name || null; 
        let calledByKey = null;
        
        if (calledByName && Array.isArray(data.calledBy)) {
          const calledByItem = data.calledBy.find(
            (item) => normalizeString(item.label) === normalizeString(calledByName)
          );
          calledByKey = calledByItem ? calledByItem.key.toString() : null;
        }
        setValue("calledBy", calledByKey);

        const procedureByName = dataResponse.procedureOrientationBy?.name || null;
        let procedureByKey = null;
        if (procedureByName && Array.isArray(data.procedureBy)) {
          const procedureByItem = data.procedureBy.find(
            (item) => normalizeString(item.label) === normalizeString(procedureByName)
          );
          procedureByKey = procedureByItem ? procedureByItem.key.toString() : null;
        }
        setValue("procedureBy", procedureByKey);

        const situationName = dataResponse.situation?.name || null;
        let situationKey = null;

        if (situationName && Array.isArray(data.situations)) {
          const situationItem = data.situations.find(
            (item) => normalizeString(item.label) === normalizeString(situationName)
          );
          situationKey = situationItem ? situationItem.key.toString() : null;
        }
        setValue("situation", situationKey);


        const postRescueName = dataResponse.postRescue?.name || null;
        let postRescueKey = null;

        if (postRescueName && Array.isArray(data.postRescue)) {
          const postRescueItem = data.postRescue.find(
            (item) => normalizeString(item.label) === normalizeString(postRescueName)
          );
          postRescueKey = postRescueItem ? postRescueItem.key.toString() : null;
        }
        setValue("postRescue", postRescueKey);

      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
      }
    };

    fetchRescueData();
  }, [params.id, setValue]);

  useEffect(() => {
    if (selectedGroup) {
      const speciesForGroup = data.allSpecies.filter(
        (species) => species.AnimalGroupId.toString() === selectedGroup
      );
      setFilteredSpecies(speciesForGroup);
    } else {
      setFilteredSpecies([]);
    }
  }, [selectedGroup]);

  const handleGetLocation = async (field) => {
    try {
      const location = await getLocation();
      if (location.latitude && location.longitude) {
        setValue(field, `${location.latitude}, ${location.longitude}`);
      } else {
        console.error("Localização não encontrada");
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };

  const onSubmit = async (data) => {
    const baseUrl = window.location.origin;
    const apiUrl = `${baseUrl}/api/rescue/${params.id}`; 
    try {
      const response = await axios.put(apiUrl, data);
      console.log("Response:", response.data);
      window.alert("Registro editado com sucesso!");
      router.push("/pages/rescue");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md"
    >
      <Controller
        name="time"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <TimeInput
            label="Hora do evento"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />


      <Controller
        name="date"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <DatePicker
            label="Dia da ocorrência"
            className="w-full max-w-xs mb-4"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name="locationCoordinates"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização do resgate"
            placeholder="Clique no botão para preencher"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {error && <p>Erro: {error}</p>}
      <Button
        className="w-full max-w-xs mb-4"
        onClick={() => handleGetLocation("locationCoordinates")}
      >
        Obter Localização do Resgate
      </Button>

      <Controller
        name="AnimalGroup"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Qual o grupo do animal?"
            className="w-full max-w-xs mb-4"
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
              setSelectedGroup(selectedKey);
            }}
          >
            {data.AnimalGroups.map((AnimalGroup) => (
              <SelectItem key={AnimalGroup.key.toString()} value={AnimalGroup.key.toString()}>
                {AnimalGroup.label}
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
            disabled={!selectedGroup}
          >
            {filteredSpecies.map((species) => (
              <SelectItem key={species.id.toString()} value={species.id.toString()}>
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
            value={field.value || ''}
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
            value={field.value || ''}
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
            value={field.value || ''}
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
            value={field.value || ''}
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
            value={field.value || ''}
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
            value={field.value || ''}
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
          >
            {data.calledBy.map((calledBy) => (
              <SelectItem key={calledBy.key.toString()} value={calledBy.key.toString()}>
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
          >
            {data.procedureBy.map((procedureBy) => (
              <SelectItem key={procedureBy.key.toString()} value={procedureBy.key.toString()}>
                {procedureBy.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="ageRange"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Select
            label="Idade do animal?"
            className="w-full max-w-xs mb-4"
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
          >
            {data.ageRanges.map((age) => (
              <SelectItem key={age.key.toString()} value={age.key.toString()}>
                {age.label}
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
          >
            {data.situations.map((situation) => (
              <SelectItem key={situation.key.toString()} value={situation.key.toString()}>
                {situation.label}
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
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys).pop();
              field.onChange(selectedKey);
            }}
          >
            {data.postRescue.map((postRescue) => (
              <SelectItem key={postRescue.key.toString()} value={postRescue.key.toString()}>
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
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />

      {/* <Controller
        name="releaseLocation"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Input
            inputMode="text"
            label="Endereço da soltura"
            className="w-full max-w-xs mb-4"
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      /> */}

      <Controller
        name="releaseLocationCoordinates"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            className="w-full max-w-xs mb-4"
            label="Localização da soltura"
            placeholder="Clique no botão para preencher"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Button
        className="w-full max-w-xs mb-4"
        onClick={() => handleGetLocation("releaseLocationCoordinates")}
      >
        Obter Localização da Soltura
      </Button>

      <Button type="submit" className="mt-4 w-full sm:max-w-xs mb-4">
        Atualizar
      </Button>
    </form>
  );
}
