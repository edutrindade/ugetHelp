import { useState } from 'react';
import { Alert } from 'react-native';
import { VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Register() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function handleNewOrderRegister() {
        if (!title || !description) {
            return Alert.alert('Registro', 'Preencha todos os campos.');
        }

        setIsLoading(true);

        firestore()
            .collection('orders')
            .add({
                title,
                description,
                status: 'open',
                created_at: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                Alert.alert("Sucesso", "Chamado registrado com sucesso.");
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert("Erro", "Erro ao registrar chamado.");
                console.log(error);
            })
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Novo chamado" />

            <Input
                placeholder="Título"
                mt={4}
                onChangeText={setTitle}
            />

            <Input
                placeholder="Descrição do problema"
                flex={1}
                multiline
                mt={5}
                textAlignVertical="top"
                onChangeText={setDescription}
            />

            <Button
                title="Cadastrar"
                isLoading={isLoading}
                onPress={handleNewOrderRegister}
                mt={6}
                mb={3}
            />

        </VStack>
    );
}