import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { Input } from "../../components/Input";
import styles from "./styles.module.css";

export function FormCadastroReactHookForm(): React.ReactElement {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();

  const registerWithMask = useHookFormMask(register);

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
        setError(field, { type: "manual", message: resultData.errors[field] });
      }
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
            {...register("name", {
              required: "Este campo é obrigatório!",
              maxLength: {
                value: 255,
                message: "Erro!",
              },
            })}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="name" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="email">E-mail</label>
          <Input
            {...register("email", { required: "Email é obrigatório UAI!" })}
            id="email"
            type="text"
            title="E-mail"
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="email" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="senha">Senha</label>
          <Input
            {...register("senha", { required: "Senha é obrigatória!" })}
            id="senha"
            type={isPasswordVisible ? "text" : "password"}
            title="Senha"
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="senha" />
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
            {...register("confirmacaoSenha", {
              required: "Confirme da senha é obrigatória!",
              validate(value, formValues) {
                console.log("confirmar senha: ", value);
                if (value === formValues.senha) return true;
                return "As senhas devem ser iguais UAI!";
              },
            })}
            id="confirmacaoSenha"
            type={isPasswordVisible ? "text" : "password"}
            title="Confirmar Senha"
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="confirmacaoSenha" />
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
          <label htmlFor="telefoneCelular">Telefone Celular</label>
          <Input
            id="telefoneCelular"
            type="text"
            title="Telefone Celular"
            {...registerWithMask("telefoneCelular", "(99)99999-9999", {
              required: "Telefone é obrigatória!",
            })}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="telefoneCelular" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="cpf">CPF</label>
          <Input
            id="cpf"
            type="text"
            title="CPF"
            {...registerWithMask("cpf", "999.999.999-99", {
              required: "CPF é MT obrigatório!",
            })}
          />{" "}
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="cpf" />
          </p>
        </div>

        <div className={styles.campoCadastro}>
          <label htmlFor="cep">CEP</label>
          <Input
            id="cep"
            type="text"
            title="CPF"
            {...registerWithMask("cep", "99999-999", {
              required: "Cep obrigatório!",
              pattern: {
                value: /^\d{5}-\d{3}/,
                message: "Cep inválido",
              },
              onBlur: handleCepBlur,
            })}
          />
          <p className={styles.erroCampoForm}>
            <ErrorMessage errors={errors} name="cep" />{" "}
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
          <label htmlFor="cidade">Cidade</label>
          <Input
            id="cidade"
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
