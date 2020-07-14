import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 30px 40px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 16px 0;
`;

export const ContainerIcon = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${Platform.OS === 'ios' ? 40 : 2}px;
`;

export const BackButton = styled.TouchableOpacity``;

export const SignOutButton = styled.TouchableOpacity``;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: ${Platform.OS === 'ios' ? 32 : 2}px;
  width: 100px;
  height: 100px;
  border-radius: 50px;

  background: #28262e;
  border: 3px #ff9000;
  padding: 3px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const UserAvatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 3px;
  border-color: #ff9000;
  padding: 3px;

  align-self: center;
`;

export const UserInitialsContainer = styled.View``;

export const UserInitials = styled.Text`
  font-size: 56px;
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;
