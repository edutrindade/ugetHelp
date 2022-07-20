import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

type Props = StyledProps & {
    title: string;
}

export function Header({ title, ...rest }: Props) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    function handleGoBack() {
        navigation.goBack();
    }

    return (
        <HStack
            w="full"
            h="32"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={4}
            px={1}
        >
            <IconButton
                icon={<CaretLeft size={24} color={colors.gray[200]} />}
                onPress={handleGoBack}
            />

            <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-6}>
                {title}
            </Heading>
        </HStack>
    );
}