import { useEffect, useState } from "react";
import Select from "react-select";
import { Button } from "../Button";
import { Input } from "../Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { onCallAddFinance, categoriesCall } from "../../services/request";

export const Modal = ({ onClose, onFinanceAdded }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    const fetchCategories = async () => {
      try {
        const response = await categoriesCall();
        const formattedCategories = response.data.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategoryOptions(formattedCategories);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const mutation = useMutation((newFinance) => onCallAddFinance(newFinance), {
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Erro ao adicionar o lançamento.";
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success("Lançamento adicionado com sucesso!");
      onClose();
      onFinanceAdded();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      value: "",
      date: "",
      category: null,
    },
    validationSchema: Yup.object({
      title: Yup.string(2, "digite no mínimo 2 caracteres.").required(
        "Título é obrigatório."
      ),
      value: Yup.number()
        .required("Valor é obrigatório.")
        .typeError("Valor deve ser um número."),
      date: Yup.date().required("Data é obrigatória."),
      category: Yup.object().nullable().required("Categoria é obrigatória."),
    }),
    onSubmit: (data) => {
      const formattedData = {
        title: data.title,
        value: parseFloat(data.value),
        date: data.date,
        category_id: data.category.value,
      };
      mutation.mutate(formattedData);
    },
  });

  // Estilização customizada para o React-Select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "2px solid #22d3ee", // Cor da borda (cyan-400)
      borderRadius: "0.5rem", // rounded-lg
      padding: "0.5rem", // p-2
      boxShadow: "none",
      "&:hover": {
        borderColor: "#22d3ee", // Cor da borda ao passar o mouse
      },
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "0.5rem", // p-2
      cursor: "pointer",
      borderRadius: "0.375rem", // rounded-md
      backgroundColor: state.isFocused ? "#f1f5f9" : "#ffffff", // bg-gray-100 no hover
      color: state.isFocused ? "#5936CD" : "#1f2937", // text-cyan-600 e text-gray-800
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "0.5rem", // mt-2
      border: "1px solid #e5e7eb", // border-gray-300
      borderRadius: "0.5rem", // rounded-lg
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // shadow-lg
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937", // text-gray-800
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px", // Altura máxima da lista de opções
      overflowY: "auto",
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#22d3ee", // Cor personalizada da barra de rolagem
        borderRadius: "4px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "#f1f5f9", // Cor do fundo da barra de rolagem
      },
    }),
  };

  return (
    <div className="w-dvw h-dvh flex flex-col items-end fixed top-0 right-0 bottom-0 left-0 bg-black/20">
      <div
        className={`w-1/4 h-dvh p-6 rounded-l-lg bg-slate-50 transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full flex flex-row items-center justify-between mb-8">
          <h3 className="font-bold text-lg">Adicionar lançamento</h3>
          <Button onClick={onClose} variant="smallButton">
            Fechar
          </Button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Input
            id="title"
            name="title"
            className="mb-3"
            type="text"
            label="Título"
            placeholder="Ex: Compra supermercado"
            onChange={formik.handleChange}
            value={formik.values.title}
            error={formik.errors.title}
          />
          <Input
            id="value"
            name="value"
            className="mb-3"
            type="number"
            label="Valor"
            placeholder="R$ (Use valores negativos para despesas)"
            onChange={formik.handleChange}
            value={formik.values.value}
            error={formik.errors.value}
          />
          <Input
            id="date"
            name="date"
            className="mb-3"
            type="date"
            label="Data"
            onChange={formik.handleChange}
            value={formik.values.date}
            error={formik.errors.date}
          />

          <div className="mb-8">
            <label htmlFor="category" className="block mb-2 font-bold">
              Categoria
            </label>
            <Select
              id="category"
              options={categoryOptions}
              placeholder="Selecione uma categoria"
              value={formik.values.category}
              onChange={(option) => formik.setFieldValue("category", option)}
              styles={customStyles}
            />
            {formik.errors.category && (
              <div className="text-red-500 text-sm">
                {formik.errors.category}
              </div>
            )}
          </div>

          <Button type="submit" className="mb-10">
            Adicionar
          </Button>
        </form>
      </div>
    </div>
  );
};
