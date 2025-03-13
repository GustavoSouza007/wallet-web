import { Button, Input } from "../../components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../services/api/requests";
import { toast } from "react-toastify";
import { saveItem } from "../../services/storage";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const mutation = useMutation((data) => loginCall(data.email), {
    onError: (error) => {
      toast.error(
        error?.response?.data?.error
          ? "Falha ao realizar login."
          : "Por favor, tente novamente."
      );
    },
    onSuccess: (data) => {
      toast.success("Login com sucesso!");
      saveItem("@walletApp_email", data?.data?.email);
      saveItem("@walletApp_name", data?.data?.name);
      saveItem("@walletApp_id", data?.data?.id);
      navigate("/home");
    },
  });

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
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
          <h3 className="w-full text-lg font-bold mb-4">Bem vindo!</h3>
          <p className="text-sm font-medium text-gray-500 mb-4">
            Digite seu e-mail abaixo para ter acesso à aplicação financeira
            Wallet, e ter uma melhor controle dos seus gastos mensais.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <Input
              error={errors.email}
              onChange={handleChange}
              id="email"
              value={values.email}
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
              {mutation.isLoading ? "Carregando..." : "Acessar"}
            </Button>
            <a
              href="/signup"
              className="flex justify-center text-sm font-semibold cursor-pointer underline"
            >
              Não tem conta? Faça seu cadastro aqui.
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};
