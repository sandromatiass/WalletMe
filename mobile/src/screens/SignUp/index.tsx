import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { signupValidationSchema } from '../../schemas';

import Input from '../../components/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

export default function SignUp() {
  const { signUp, loadingAuth } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function handleSignUp(
    values: {
      name: string;
      email: string;
      password: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) {
    try {
      await signUp(values);
    } catch (error) {
      console.log('Erro ao fazer cadastro:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/wallet.png')}
      />
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={signupValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!values.name || !values.email || !values.password) {
            setSubmitting(false);
            return;
          }
          setSubmitting(true);
          handleSignUp(values, setSubmitting);
        }}
      >
        {({ handleSubmit }) => (
          <View style={styles.inputContainer}>
            <Input
              name="name"
              placeholder="Digite seu nome"
              placeholderTextColor="#9E9E9E"
            />
            <Input
              name="email"
              placeholder="Digite seu email"
              placeholderTextColor="#9E9E9E"
            />
            <Input
              name="password"
              placeholder="Digite sua senha"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
              {loadingAuth ? (
                <ActivityIndicator size={25} color='#91E2A8' />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.loginPrompt}>
              Já tem cadastro?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signupText}>Faça login</Text>
              </TouchableOpacity>
            </Text>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    marginBottom: 18,
    width: '70%',
    height: 150,
  },
  inputContainer: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 14,
  },
  button: {
    width: '95%',
    height: 40,
    backgroundColor: '#91E2A8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 16,
    color: '#9E9E9E',
  },
  signupText: {
    color: '#91E2A8',
    fontWeight: 'bold',
  },
});
