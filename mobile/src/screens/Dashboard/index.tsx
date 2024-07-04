import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import ModalForm from '../../components/ModalForm';
import ModalView from '../../components/ModalView';

type TransactionType = {
  id: string;
  type: 'ganho' | 'gasto';
  value: number;
  name: string;
  date: string;
  description: string;
};

const initialTransactions: TransactionType[] = [];

const Dashboard = () => {
  const { user, signOut } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'ganho' | 'gasto' | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAddGanho = () => {
    setModalType('ganho');
    setModalVisible(true);
  };

  const handleAddGasto = () => {
    setModalType('gasto');
    setModalVisible(true);
  };

  const handleSave = (data: { value: string; date: string; name: string; description: string; type: 'ganho' | 'gasto' }) => {
    const numericValue = parseFloat(data.value.replace(',', '.'));

    const newTransaction: TransactionType = {
      id: Math.random().toString(),
      ...data,
      value: numericValue,
    };

    setTransactions([...transactions, newTransaction]);

    if (data.type === 'ganho') {
      setSaldo(prevSaldo => prevSaldo + numericValue);
    } else if (data.type === 'gasto') {
      setGastos(prevGastos => prevGastos + numericValue);
      setSaldo(prevSaldo => prevSaldo - numericValue);
    }

    setModalVisible(false);
  };

  const handleDeleteTransaction = (id: string, value: number, type: 'ganho' | 'gasto') => {
    Alert.alert(
      'Excluir Transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            let updatedSaldo = saldo;
            let updatedGastos = gastos;

            if (type === 'ganho') {
              updatedSaldo -= value;
              updatedGastos -= value;
            } else if (type === 'gasto') {
              updatedGastos -= value;
              updatedSaldo += value; 
            }

            updatedSaldo = Math.max(updatedSaldo, 0);

            setSaldo(updatedSaldo);
            setGastos(updatedGastos);

            const updatedTransactions = transactions.filter((item) => item.id !== id);
            setTransactions(updatedTransactions);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderTransactionItem = ({ item }: { item: TransactionType }) => {
    const formattedValue = formatNumber(item.value);

    return (
      <TouchableOpacity onPress={() => handleTransactionPress(item)} style={[styles.transactionItem, { backgroundColor: item.type === 'ganho' ? '#C8E6C9' : '#FFCDD2' }]}>
        <Text style={styles.transactionValue}>R$ {formattedValue}</Text>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTransaction(item.id, item.value, item.type)}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleTransactionPress = (transaction: TransactionType) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{user.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dashboard}>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceSection}>
            <Text style={styles.saldoTitle}>Saldo</Text>
            <Text style={styles.saldoValue}>R$ {formatNumber(saldo)}</Text>
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.gastosTitle}>Gastos</Text>
            <Text style={styles.gastosValue}>R$ {formatNumber(gastos)}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGanho}>
            <Text style={styles.addButtonText}>Adicionar Ganhos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.expenseButton} onPress={handleAddGasto}>
            <Text style={styles.expenseButtonText}>Adicionar Gastos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          style={styles.transactionsList}
        />
      </View>
      <ModalForm
        visible={modalVisible && modalType !== null && modalType === 'ganho'}
        onClose={() => {
          setModalType(null);
          setModalVisible(false);
        }}
        onSave={handleSave}
        type="ganho"
      />
      <ModalForm
        visible={modalVisible && modalType !== null && modalType === 'gasto'}
        onClose={() => {
          setModalType(null);
          setModalVisible(false);
        }}
        onSave={handleSave}
        type="gasto"
      />
      {selectedTransaction && (
        <ModalView
          visible={modalVisible && modalType === null}
          onClose={() => setModalVisible(false)}
          title={selectedTransaction.name}
          value={`R$ ${formatNumber(selectedTransaction.value)}`}
          date={selectedTransaction.date}
          description={selectedTransaction.description}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f7fb',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263138',
  },
  logoutButton: {
    backgroundColor: '#91E2A8',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dashboard: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  balanceSection: {
    alignItems: 'center',
  },
  saldoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  saldoValue: {
    fontSize: 20,
    color: '#91E2A8',
    marginVertical: 10,
  },
  gastosTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  gastosValue: {
    fontSize: 20,
    color: '#BE1010',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-around',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#91E2A8',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expenseButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  expenseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  transactionsList: {
    width: '95%',
    marginTop: 20,
  },
  transactionItem: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  transactionName: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    padding: 7.5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
