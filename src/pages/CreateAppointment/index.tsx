import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { Provider } from '../Dashboard';

import {
  BackButton,
  Container,
  Content,
  Header,
  HeaderTitle,
  ProviderAvatar,
  ProviderContainer,
  ProviderInitials,
  ProviderInitialsContainer,
  ProviderName,
  ProvidersList,
  ProvidersListContainer,
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
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  useEffect(() => {
    api.get<Provider[]>('providers').then(response => {
      setProviders(
        response.data.map(provider =>
          provider.avatar_url
            ? provider
            : {
                ...provider,
                nameInitials: provider.name
                  .split(' ')
                  .map(name => name.charAt(0).toUpperCase())
                  .join('')
                  .substring(0, 2),
              },
        ),
      );
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

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

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                {provider.avatar_url ? (
                  <ProviderAvatar
                    selected={provider.id === selectedProvider}
                    source={{ uri: provider.avatar_url }}
                  />
                ) : (
                  <ProviderInitialsContainer
                    selected={provider.id === selectedProvider}
                  >
                    <ProviderInitials>{provider.nameInitials}</ProviderInitials>
                  </ProviderInitialsContainer>
                )}
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
