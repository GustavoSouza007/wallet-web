import { apiProject } from "../api";

export const getFinancesData = async () => {
  try {
    const email = localStorage.getItem("@walletApp_email");
    const date = "2022-12-15";
    const result = await apiProject.get(`finances?date=${date}`, {
      headers: {
        email: email,
      },
    });

    return result.data;
  } catch (error) {
    alert("Erro ao buscar dados da API");
    return { error };
  }
};

export const categoriesCall = (data) => apiProject.get("/categories", data);

export const onCallAddFinance = async (data) => {
  try {
    const email = localStorage.getItem("@walletApp_email");
    const result = await apiProject.post("/finances", JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        email: email,
      },
    });
    return result.data;
  } catch (error) {
    alert("Erro ao adicionar novo item");
    return { error };
  }
};

export const onDeleteItem = async (id) => {
  try {
    const email = localStorage.getItem("@walletApp_email");
    apiProject.delete(`/finances/${id}`, {
      headers: {
        email: email,
      },
    });
  } catch (error) {
    alert("Erro ao deletar item.");
  }
};
