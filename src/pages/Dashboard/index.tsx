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
  ProvidersList,
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

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

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
        renderItem={({ item }) => <UserName>{item.name}</UserName>}
      />
    </Container>
  );
};

export default Dashboard;
