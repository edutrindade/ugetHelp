import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { VStack, Heading, Icon, useTheme, Image } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.png';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { colors } = useTheme();

    function handleSignIn() {
        if (!email && !password) {
            return Alert.alert('Erro', 'Preencha todos os campos.');
        }

        if (email && !password) {
            return Alert.alert('Erro', 'Informe a senha.');
        }

        if (!email && password) {
            return Alert.alert('Erro', 'Informe o e-mail.');
        }

        setIsLoading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                console.log(error);
                setIsLoading(false);

                console.log('code', error.code);

                if (error.code === 'auth/invalid-email') {
                    return Alert.alert('Erro', 'E-mail inválido.');
                }

                if (error.code === 'auth/wrong-password') {
                    return Alert.alert('Erro', 'E-mail ou senha inválida.');
                }

                if (error.code === 'auth/user-not-found') {
                    return Alert.alert('Erro', 'E-mail ou senha inválida.');
                }

                return Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
            });
    }

    return (
        <VStack flex={1} bg="gray.600" alignItems="center" px={8} pt={24}>
            <Image source={Logo} resizeMode="contain" size="xl" alt='logo' />

            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                placeholder="E-mail"
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                mb={4}
                onChangeText={setEmail}
            />

            <Input placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
                mb={8}
                onChangeText={setPassword}
            />

            <Button
                title="Entrar"
                w="full"
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    );
}