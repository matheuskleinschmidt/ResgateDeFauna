import axios from "axios";
debugger
export const fetchRescueData = async (baseUrl, id) => {
    try {
      debugger
      let apiUrl = `${baseUrl}/api/rescue`;
      if (id) {
        apiUrl += `/${id}`;
      }
  
      const response = await axios.get(apiUrl);
      const dataResponse = id ? response.data[0] : response.data;
  
      return dataResponse;
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      throw error;
    }
  };
  