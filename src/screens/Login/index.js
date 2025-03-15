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

  const { handleSubmit, values, handleChange, errors, touched } = useFormik({
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
      <div
        className="w-1/4 h-auto flex flex-col items-center justify-center rounded-3xl bg-slate-50
        max-2xl:w-2/5 max-2xl:py-12 max-2xl:px-6
        max-xl:w-1/2 max-xl:py-12 max-xl:px-6
        max-lg:w-2/3 max-lg:py-12 max-lg:px-8
        max-md:w-2/3 max-md:py-12 max-md:px-2 
        max-sm:w-11/12 max-sm:py-8 max-sm:px-4"
      >
        <div className="w-full h-full p-6 flex flex-col items-center justify-center">
          <img
            className="w-24 h-auto mb-10 max-lg:w-28 max-lg:mb-8 max-md:w-24 max-md:mb-6 max-sm:w-20 max-sm:mb-4"
            src="/images/logo.png"
            alt="logo"
          />
          <h3 className="w-full text-lg font-bold mb-4 max-2xl:text-xl max-2xl:mb-6 max-xl:text-xl max-xl:mb-6 max-lg:text-xl max-lg:mb-6 max-md:text-lg max-md:mb-4 max-sm:text-base max-sm:mb-3">
            Bem vindo!
          </h3>
          <p className="text-sm font-medium text-gray-500 mb-4 max-2xl:text-base max-2xl:mb-6 max-xl:text-base max-xl:mb-6 max-lg:text-base max-lg:mb-6 max-md:text-sm max-md:mb-4 max-sm:text-xs max-sm:mb-2">
            Digite seu e-mail abaixo para ter acesso à aplicação financeira
            Wallet, e ter uma melhor controle dos seus gastos mensais.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <Input
              error={touched.email ? errors.email : null}
              onChange={handleChange}
              id="email"
              value={values.email}
              name="email"
              type="email"
              label="E-mail"
              placeholder="email@exemplo.com"
            />

            <Button
              disabled={mutation.isLoading}
              type="submit"
              className="mt-6 mb-12 max-2xl:mt-6 max-2xl:mb-10 max-xl:mt-6 max-xl:mb-10 max-lg:mt-6 max-lg:mb-10 max-md:mt-6 max-md:mb-8 max-sm:mt-4 max-sm:mb-6"
            >
              {mutation.isLoading ? "Carregando..." : "Acessar"}
            </Button>
            <a
              href="/signup"
              className="flex justify-center text-sm font-semibold cursor-pointer underline 
              max-2xl:text-base max-xl:text-base max-lg:text-base max-md:text-sm max-sm:text-xs"
            >
              Não tem conta? Faça seu cadastro aqui.
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};
