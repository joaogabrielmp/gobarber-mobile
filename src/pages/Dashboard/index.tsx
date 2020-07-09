import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  ProfileButton,
  ProviderAvatar,
  ProviderContainer,
  ProviderInfo,
  ProviderInitials,
  ProviderInitialsContainer,
  ProviderMeta,
  ProviderMetaText,
  ProviderName,
  ProvidersList,
  ProvidersListTitle,
  SignOutButton,
  UserAvatar,
  UserInitials,
  UserInitialsContainer,
  UserName,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
  nameInitials?: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  const nameInitials = useMemo(() => {
    return user.name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }, [user.name]);

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

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem-vindo (a), {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          {user.avatar_url ? (
            <UserAvatar source={{ uri: user.avatar_url }} />
          ) : (
            <UserInitialsContainer>
              <UserInitials>{nameInitials}</UserInitials>
            </UserInitialsContainer>
          )}
        </ProfileButton>

        <SignOutButton onPress={handleSignOut}>
          <Icon name="log-out" color="#ff9000" size={20} />
        </SignOutButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListFooterComponent={<View style={{ marginBottom: 32 }} />}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => {
              navigateToCreateAppointment(provider.id);
            }}
          >
            {provider.avatar_url ? (
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
            ) : (
              <ProviderInitialsContainer>
                <ProviderInitials>{provider.nameInitials}</ProviderInitials>
              </ProviderInitialsContainer>
            )}

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
