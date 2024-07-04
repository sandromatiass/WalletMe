import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface ModalFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { value: string; date: string; name: string; description: string; type: 'ganho' | 'gasto' }) => void;
  type: 'ganho' | 'gasto';
}

const ModalForm = ({ visible, onClose, onSave, type }: ModalFormProps) => {
  const [value, setValue] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSave = () => {
    const formattedValue = parseFloat(value.replace(',', '.'));

    const data = { value: formattedValue.toString(), date, name, description, type };
    onSave(data);
    onClose();
    clearForm(); 
  };

  const clearForm = () => {
    setValue('');
    setDate('');
    setName('');
    setDescription('');
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate.toISOString().split('T')[0]);
    hideDatePicker();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {type === 'ganho' ? 'Adicionar Ganho' : 'Adicionar Gasto'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{date ? date : 'Selecionar Data'}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.cotainerButton}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => { onClose(); clearForm(); }}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cotainerButton:{
    flexDirection: 'row',
    gap: 42,
  },
  datePickerButton: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerText: {
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ModalForm;
