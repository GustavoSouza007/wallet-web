import { Button, Input } from "../../components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { registerCall } from "../../services/api/requests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const mutation = useMutation((newUser) => registerCall(newUser), {
    onError: (error) => {
      toast.error(
        error?.response?.data?.error
          ? "Usuário já existe"
          : "Por favor, tente novamente."
      );
    },
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      navigate("/");
    },
  });

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Nome deve conter ao menos 3 caracteres.")
        .required("Nome é obrigatório."),
      email: Yup.string()
        .email("E-mail inválido.")
        .required("E-mail é obrigatório."),
    }),
    onSubmit: (data) => {
      mutation.mutate(data);
    },
  });

  return (
    <div className="w-dvw h-dvh flex items-center justify-center bg-violet-700">
      <div className="w-1/4 h-auto flex flex-col items-center justify-center rounded-3xl bg-slate-50">
        <div className="w-full h-full p-6 flex flex-col items-center justify-center">
          <img
            className="w-24 h-auto mb-10"
            src="/images/logo.png"
            alt="logo"
          />
          <h3 className="w-full text-lg font-bold mb-4">Novo cadastro</h3>
          <p className="text-sm font-medium text-gray-500 mb-4">
            Insira seu nome e seu e-mail para ter acesso ao Wallet app e
            gerenciar suas finanças.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <Input
              error={errors.name}
              onChange={handleChange}
              value={values.name}
              id="name"
              className="mb-8"
              name="name"
              type="text"
              label="Nome"
              placeholder="Insira seu nome"
            />
            <Input
              error={errors.email}
              onChange={handleChange}
              value={values.email}
              id="email"
              className="mb-8"
              name="email"
              type="email"
              label="E-mail"
              placeholder="email@exemplo.com"
            />
            <Button
              disabled={mutation.isLoading}
              type="submit"
              className="mb-10"
            >
              {mutation.isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
            <a
              href="/"
              className="flex justify-center text-sm font-semibold cursor-pointer underline"
            >
              Já possui uma conta? Faça login aqui.
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};
