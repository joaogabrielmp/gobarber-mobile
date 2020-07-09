import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { Provider } from '../Dashboard';

import {
  BackButton,
  Container,
  Header,
  HeaderTitle,
  UserAvatar,
  UserInitials,
  UserInitialsContainer,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const nameInitials = useMemo(() => {
    return user.name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }, [user.name]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        {user.avatar_url ? (
          <UserAvatar source={{ uri: user.avatar_url }} />
        ) : (
          <UserInitialsContainer>
            <UserInitials>{nameInitials}</UserInitials>
          </UserInitialsContainer>
        )}
      </Header>
    </Container>
  );
};

export default CreateAppointment;
