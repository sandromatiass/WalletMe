import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';

interface InputProps extends TextInputProps {
  name: string;
}

const Input = ({ name, ...props }: InputProps) => {
  const [field, meta] = useField(name);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={field.onChange(name)}
        onBlur={field.onBlur(name)}
        value={field.value}
        {...props}
      />
      {meta.touched && meta.error && (
        <Text style={styles.errorText}>{meta.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '95%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#263138',
    color:  '#263138',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
});

export default Input;
