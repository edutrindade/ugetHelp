import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
    title: string;
}

export function Button({ title, ...rest }: Props) {
    return (
        <ButtonNativeBase
            bg="yellow.500"
            h={14}
            fontSize="sm"
            rounded="sm"
            _pressed={{ bg: 'yellow.700' }}
            {...rest}>
            <Heading color="black" fontSize="md">{title}</Heading>
        </ButtonNativeBase>
    );
}