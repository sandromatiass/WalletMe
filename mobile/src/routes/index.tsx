import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import { AuthContext } from '../contexts/AuthContext';

const Routes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#f5f7fb',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size={60} color={'#BE1010'} />
      </View>
    );
  };

  return (
    isAuthenticated ? <AppRoutes /> : <AuthRoutes />
  );
};

export default Routes;
