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
      title: Yup.string(2, "Digite no mínimo 2 caracteres.").required(
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "2px solid #22d3ee",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#22d3ee",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "0.5rem",
      cursor: "pointer",
      borderRadius: "0.375rem",
      backgroundColor: state.isFocused ? "#f1f5f9" : "#ffffff",
      color: state.isFocused ? "#5936CD" : "#1f2937",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "0.5rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: "#22d3ee",
        borderRadius: "4px",
      },
      "::-webkit-scrollbar-track": {
        backgroundColor: "#f1f5f9",
      },
    }),
  };

  return (
    <div className="w-screen h-screen fixed top-0 right-0 bottom-0 left-0 bg-black/20 flex flex-col items-end z-20">
      <div
        className={`w-1/3 h-full p-6 bg-slate-50 transform transition-transform duration-300 overflow-y-auto

          2xl:w-1/3 
          xl:w-1/2 
          lg:w-2/3 
          max-lg:w-3/4
          max-md:w-4/5
          max-sm:w-full 
          max-sm:p-4
          ${isVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="w-full flex flex-row items-center justify-between mb-8   max-sm:gap-4">
          <h3 className="font-bold text-lg max-sm:text-base">
            Adicionar lançamento
          </h3>
          <Button
            onClick={onClose}
            variant="smallButton"
            className="max-sm:w-full"
          >
            Fechar
          </Button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 max-sm:space-y-4"
        >
          <Input
            id="title"
            name="title"
            type="text"
            label="Título"
            placeholder="Ex: Compra supermercado"
            onChange={formik.handleChange}
            value={formik.values.title}
            error={formik.submitCount > 0 ? formik.errors.title : undefined}
            className="w-full"
          />
          <Input
            id="value"
            name="value"
            type="number"
            label="Valor"
            placeholder="R$ (Use valores negativos para despesas)"
            onChange={formik.handleChange}
            value={formik.values.value}
            error={formik.submitCount > 0 ? formik.errors.value : undefined}
            className="w-full"
          />
          <Input
            id="date"
            name="date"
            type="date"
            label="Data"
            onChange={formik.handleChange}
            value={formik.values.date}
            error={formik.submitCount > 0 ? formik.errors.date : undefined}
            className="w-full"
          />
          <div className="space-y-2">
            <label htmlFor="category" className="block font-bold">
              Categoria
            </label>
            <Select
              id="category"
              options={categoryOptions}
              placeholder="Selecione uma categoria"
              value={formik.values.category}
              onChange={(option) => formik.setFieldValue("category", option)}
              styles={customStyles}
              isSearchable={false}
              className="w-full"
            />
            {formik.errors.category && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm">
                {formik.errors.category}
              </div>
            )}
          </div>
          <Button type="submit" className="max-sm:w-full">
            Adicionar
          </Button>
        </form>
      </div>
    </div>
  );
};
