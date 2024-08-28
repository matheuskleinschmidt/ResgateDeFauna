"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RescuePage = () => {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/rescue');
        console.log(response)
        setRescues(response.data);
      } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
      }
    };

    fetchRescueData();
  }, []);

  return (
    <div>
      <h1>Lista de Resgates</h1>
      <ul>
        {rescues.map((rescue, index) => (
          <li key={index}>
            <p><strong>Tipo de Animal:</strong> {rescue.typeOfAnimal}</p>
            <p><strong>Espécie:</strong> {rescue.species}</p>
            <p><strong>Peso:</strong> {rescue.weight} kg</p>
            <p><strong>Data do Resgate:</strong> {new Date(rescue.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RescuePage;
