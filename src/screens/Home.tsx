import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { HStack, IconButton, VStack, useTheme, Image, Heading, Text, FlatList, Center } from 'native-base';
import { SignOut, ChatTeardropText, SimCard } from 'phosphor-react-native';

import Logo from '../assets/logo_secondary.png';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';

import { dateFormat } from '../utils/firestoreDateFormat';

export function Home() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');

    const [orders, setOrders] = useState<OrderProps[]>([]);

    const { colors } = useTheme();

    function handleNewOrder() {
        navigation.navigate('new');
    }

    function handleOpenDetails(orderId: string) {
        navigation.navigate('details', { orderId });
    }

    function handleLogout() {
        auth()
            .signOut()
            .catch((error) => {
                console.log('Error signing out: ', error);
                return Alert.alert('Erro', 'Não foi possível sair.');
            });
    }

    useEffect(() => {
        setIsLoading(true);
        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot((snapshot) => {
                const data = snapshot.docs.map(doc => {
                    const { title, description, status, created_at } = doc.data();

                    return {
                        id: doc.id,
                        title,
                        description,
                        status,
                        when: dateFormat(created_at)
                    }
                });

                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;

    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                h="24"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.600"
                pt={10}
                pb={4}
                px={6}
            >

                <Image source={Logo} resizeMode="contain" size="xl" alt='logo' />

                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={handleLogout}
                />
            </HStack>

            <VStack flex={1} px={7}>
                {/* Cabeçalho */}
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center" pb={6}>
                    <Heading color="gray.100">
                        Meus chamados
                    </Heading>

                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>

                {/* Filtro */}
                <HStack space={3} mb={8}>
                    <Filter
                        title="em andamento"
                        type="open"
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />
                    <Filter
                        title="finalizados"
                        type="closed"
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>

                {/* Chamados */}
                {isLoading ? (
                    <Loading />
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center pt={20}>
                                <ChatTeardropText color={colors.gray[300]} size={28} />
                                <Text color={colors.gray[300]} fontSize="lg" mt={6} textAlign="center">
                                    Você não possui chamados {'\n'}
                                    {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                                </Text>
                            </Center>
                        )}
                    />
                )}

                {/* Nova solicitação */}
                <Button title="Novo chamado" mt={6} onPress={handleNewOrder} />
            </VStack>
        </VStack>
    );
}