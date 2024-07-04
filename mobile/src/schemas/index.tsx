import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup
    .string()
    .email("Digite um email válido")
    .required('Email é obrigatório'),
  password: Yup
    .string()
    .min(8, ({ min }) => `A senha deve conter no minimo ${min} caracteres`)
    .required('Senha é obrigatoria'),
});

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória')
});