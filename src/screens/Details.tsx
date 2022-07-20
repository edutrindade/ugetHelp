import { useState, useEffect } from 'react';
import { HStack, Text, VStack, ScrollView, Box, useTheme } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderDTO';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from "phosphor-react-native";

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { dateFormat } from '../utils/firestoreDateFormat';

import { Alert } from 'react-native';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    title: string;
    description: string;
    solution: string;
    closed: string;
}

export function Details() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const route = useRoute();
    const { orderId } = route.params as RouteParams;

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Atenção', 'Por favor, informe a solução do problema.');
        }

        firestore()
            .collection('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                Alert.alert('Sucesso', 'O chamado foi finalizado com sucesso.');
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert('Erro', 'Ocorreu um erro ao finalizar o chamado.');
                console.log(error);
            });
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const { title, description, status, solution, created_at, closed_at } = doc.data();

                    const closed = closed_at ? dateFormat(closed_at) : null;

                    setOrder({
                        id: doc.id,
                        title,
                        description,
                        status,
                        solution,
                        when: dateFormat(created_at),
                        closed,
                    })
                }
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title="Chamado" />
            </Box>
            <HStack bg="gray.500" justifyContent="center" p={4}>
                {order.status === 'closed' ?
                    <CircleWavyCheck size={22} color={colors.green[300]} />
                    : <Hourglass size={22} color={colors.yellow[500]} />
                }
                <Text
                    color={order.status === 'closed' ? colors.green[300] : colors.yellow[500]}
                    fontSize="sm"
                    textTransform="uppercase"
                    ml={2}
                >
                    {order.status === 'closed' ? 'Finalizado' : 'Em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="Abertura de chamado"
                    description={order.title}
                    icon={DesktopTower}
                />

                <CardDetails
                    title="Descrição do problema"
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />

                <CardDetails
                    title="Solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    {order.status === 'open' && (
                        <Input
                            placeholder='Descrição da solução'
                            onChangeText={setSolution}
                            h={24}
                            textAlignVertical="top"
                            multiline
                        />
                    )}
                </CardDetails>
            </ScrollView>

            {order.status === 'open' && (
                <Button title="Encerrar chamado" m={5} onPress={handleOrderClose} />
            )}
        </VStack>
    );
}