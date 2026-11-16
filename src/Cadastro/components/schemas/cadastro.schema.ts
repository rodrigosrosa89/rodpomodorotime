import z from "zod";

export const cadastroRegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "O campo nome deve ser preenchido",
    }),

    email: z.email({ message: "Email inválido!" }).min(1, {
      message: "O campo e-mail deve ser preenchido",
    }),

    password: z
      .string()
      .min(8, { message: "Email necessita ter 8 caracteres" }),

    password_confirmation: z
      .string()
      .min(8, { message: "Email necessita ter 8 caracteres" }),

    phone: z
      .string()
      .min(1, {
        message: "Telefone é obrigatório",
      })
      .regex(/^(\d{2}) \d{5}-\d{4}$/, { message: "Telefone inválido" }),

    cpf: z
      .string()
      .min(1, { message: "CPF é obrigatório UAI!" })
      .regex(/^\d(3)\.\d{3}-\d{2}$/, { message: "Cpf inválido" }),

    zipcode: z
      .string()
      .min(1, { message: "Cep é obrigatório" })
      .regex(/^\d{5}-\d{3}/, "Cep inválido!"),

    city: z.string().min(1, { message: "Campo cidade é obrigatório" }),

    address: z.string().min(1, { message: "Campo rua é obrigatório" }),
  })
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      message: "As senhas devem coincidir",
      path: ["password_confirmation"],
    },
  );

export type CadastroRegister = z.infer<typeof cadastroRegisterSchema>;
