import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { loginValidationSchema } from '../../schemas';

import Input from '../../components/Input';
import { AuthContext } from '../../contexts/AuthContext';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

export default function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function handleLogin(
    values: {
      email: string; 
      password: string
    }, 
      setSubmitting: (isSubmitting: boolean) => void
    ) {
      try {
        await signIn(values);
      } catch {
        console.log('erro ao fazer login!!');
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
        initialValues={{email: '', password: ''}}
        validationSchema={loginValidationSchema}
        onSubmit={(values, {setSubmitting}) => {
          if (!values.email || !values.password) {
            setSubmitting(false);
            return;
          }
          setSubmitting(true);
          handleLogin(values, setSubmitting); 
        }}
      >
        {({ handleSubmit }) => (
          <View style={styles.inputContainer}>
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
                <ActivityIndicator size={25} color='#91E2A8'/>
              ) : (
                <Text style={styles.buttonText}>Acessar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text>Não tem cadastro? <Text style={styles.signupText}>Cadastre-se</Text></Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff'
  },
  logo: {
    marginBottom: 18,
    width: '70%',
    height: 150
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
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  signupText: {
    marginTop: 20,
    color: '#91E2A8',
    fontWeight: 'bold'
  }
});
