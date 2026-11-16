import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useHookFormMask, type UseFormRegister } from "use-mask-input";
import { Input } from "../../components/Input";
import styles from "./styles.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cadastroRegisterSchema,
  type CadastroRegister,
} from "./schemas/cadastro.schema";
import toast from "react-hot-toast";

export function FormCadastro(): React.ReactElement {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CadastroRegister>({
    resolver: zodResolver(cadastroRegisterSchema),
  });

  const registerWithMask = useHookFormMask(
    register as UseFormRegister<FieldValues>,
  );

  async function handleCepBlur(event: React.FocusEvent<HTMLInputElement>) {
    const cep = event.target.value;
    console.log("valor do cep: ", cep);

    const resultado = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

    if (resultado.ok) {
      const data = await resultado.json();
      console.log("Valor: ", data);
      setValue("city", data.city);
      setValue("address", data.street);
    }
  }

  async function onSubmit(data: FieldValues) {
    console.log("Formulário submeteu!");
    console.log("Data: ", data);

    const retornoFetch = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const resultData = await retornoFetch.json();

    if (!retornoFetch.ok) {
      console.log("Erro!");
      for (const field in resultData.errors) {
        setError(field as keyof CadastroRegister, {
          type: "manual",
          message: resultData.errors[field],
        });
      }
      toast.error("Ocorreu um erro ao submeter cadastro.");
    } else {
      console.log("resultado: ", resultData);
      toast.success("Cadastro realizado com sucesso!");
      reset();
    }

    console.log("Qual o resultado do POST? ", resultData);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="formCadastro">
        <div className={styles.campoCadastro}>
          <label htmlFor="name">Nome Completo</label>
          <Input
            id="name"
            type="text"
            title="Nome Completo"
            {...register("name")}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="name" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="email">E-mail</label>
          <Input {...register("email")} id="email" type="text" title="E-mail" />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="email" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="senha">Senha</label>
          <Input
            {...register("password")}
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            title="Senha"
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="password" />
          </p>

          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeIcon size={20} className="cursor-pointer text-slate-600" />
            ) : (
              <EyeOffIcon size={20} className="cursor-pointer text-slate-600" />
            )}
          </button>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <Input
            {...register("password_confirmation")}
            id="password_confirmation"
            type={isPasswordVisible ? "text" : "password"}
            title="Confirmar Senha"
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="password_confirmation" />
          </p>
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeIcon size={20} className="cursor-pointer text-slate-600" />
            ) : (
              <EyeOffIcon size={20} className="cursor-pointer text-slate-600" />
            )}
          </button>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="phone">Telefone Celular</label>
          <Input
            id="phone"
            type="text"
            title="Telefone Celular"
            {...registerWithMask("phone", "(99)99999-9999")}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="phone" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="cpf">CPF</label>
          <Input
            id="cpf"
            type="text"
            title="CPF"
            {...registerWithMask("cpf", "999.999.999-99")}
          />{" "}
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="cpf" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="cep">CEP</label>
          <Input
            id="zipcode"
            type="text"
            title="CPF"
            {...registerWithMask("zipcode", "99999-999", {
              onBlur: handleCepBlur,
            })}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="zipcode" />{" "}
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="address">Endereço</label>
          <Input
            id="address"
            type="text"
            title="Endereço"
            disabled
            {...register("address")}
          />
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="city">Cidade</label>
          <Input
            id="city"
            type="text"
            title="Cidade"
            disabled
            {...register("city")}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader /> : "Cadastrar"}
        </button>
      </form>
    </>
  );
}
