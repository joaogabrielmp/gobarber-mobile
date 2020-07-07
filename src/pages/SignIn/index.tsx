import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';

import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  CreateAccountButton,
  CreateAccountButtonText,
  ForgotPassword,
  ForgotPasswordText,
  Title,
} from './styles';

interface ISignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [isHidden, setIsHidden] = useState(false);
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);

  const keyboardDidShow = useCallback((): void => setIsHidden(true), []);

  const keyboardDidHide = useCallback((): void => setIsHidden(false), []);

  const handleSignIn = useCallback(async (data: ISignInFormData) => {
    try {
      console.log(data);

      // formRef.current?.setErrors({});
      // const schema = Yup.object().shape({
      //   email: Yup.string()
      //     .email('Digite um e-mail válido')
      //     .required('E-mail obrigatório'),
      //   password: Yup.string().required('Senha obrigatória'),
      // });
      // await schema.validate(data, {
      //   abortEarly: false,
      // });
      // await signIn({
      //   email: data.email,
      //   password: data.password,
      // });
    } catch (err) {
      // if (err instanceof Yup.ValidationError) {
      //   const errors = getValidationErrors(err);
      //   formRef.current?.setErrors(errors);
      //   return;
      // }
      // Alert.alert(
      //   'Erro na autenticação',
      //   'Ocorreu um erro ao fazer login, cheque as credenciais',
      // );
    }
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, [keyboardDidHide, keyboardDidShow]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        />
        <Container>
          <Image source={logoImg} />

          <View>
            <Title>Faça seu logon</Title>
          </View>

          <Form ref={formRef} onSubmit={handleSignIn}>
            <Input name="email" icon="mail" placeholder="E-mail" />

            <Input name="password" icon="lock" placeholder="Senha" />

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Entrar
            </Button>
          </Form>

          <ForgotPassword onPress={() => {}}>
            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
          </ForgotPassword>
        </Container>
        <ScrollView />
      </KeyboardAvoidingView>

      {!isHidden && (
        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
          <Icon name="log-in" size={20} color="#ff9000" />
          <CreateAccountButtonText>Criar um conta</CreateAccountButtonText>
        </CreateAccountButton>
      )}
    </>
  );
};

export default SignIn;
