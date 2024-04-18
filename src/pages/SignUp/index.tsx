import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
  
const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const signUpValidationSchema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
        confirmPassword: Yup
            .string()
            .oneOf([Yup.ref("password"), undefined], "Senhas precisam ser iguais"),
    });

    const { errors, touched, handleChange, handleSubmit, values } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: signUpValidationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                await signUp({
                    name: values.name,
                    email: values.email,
                    password: values.password
                });

                setIsLoading(false);

                toast({
                    title: 'Conta criada',
                    description: "Seja bem-vindo ao nosso portal.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                });

                navigate('/');
            } catch (error) {
                setIsLoading(false);

                if (error instanceof AxiosError) {
                    toast({
                        title: 'Ocorreu um erro',
                        description: error.response?.data.error,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: 'top-right'
                    });

                    return;
                }

                toast({
                    title: 'Ocorreu um erro',
                    description: 'Algo inesperado ocorreu. Tente novamente.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
        }
    });

    return (
        <Container maxW="lg" py={{ base: '12', md: '20' }} px={{ base: '0', sm: '8' }} overflow='hidden'>
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                    <Heading size={{ base: 'xs', md: 'lg' }}>Criar conta</Heading>
                    <Text color="fg.muted">
                        Já tem uma conta? <Link href="/" color='blue.500'>Entrar</Link>
                    </Text>
                    </Stack>
                </Stack>
                <Box
                    py={{ base: '0', sm: '8' }}
                    px={{ base: '4', sm: '10' }}
                    bg={{ base: 'transparent', sm: 'bg.surface' }}
                    boxShadow={{ base: 'none', sm: 'md' }}
                    borderRadius={{ base: 'none', sm: 'xl' }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl>
                                    <FormLabel htmlFor="name">Nome</FormLabel>
                                    <Input id="name" type="text" onChange={handleChange} value={values.name} />
                                    {errors.name && touched.name ? (
                                        <Text color='red.500' fontSize={{ base: 'sm' }}>{errors.name}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="email">E-mail</FormLabel>
                                    <Input id="email" type="email" onChange={handleChange} value={values.email} />
                                    {errors.email && touched.email ? (
                                        <Text color='red.500' fontSize={{ base: 'sm' }}>{errors.email}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password">Senha</FormLabel>
                                    <Input id="password" type="password" onChange={handleChange} value={values.password} />
                                    {errors.password && touched.password ? (
                                        <Text color='red.500' fontSize={{ base: 'sm' }}>{errors.password}</Text>
                                    ) : null}
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="confirmPassword">Confirmar senha</FormLabel>
                                    <Input id="confirmPassword" type="password" onChange={handleChange} value={values.confirmPassword} />
                                    {errors.confirmPassword && touched.confirmPassword ? (
                                        <Text color='red.500' fontSize={{ base: 'sm' }}>{errors.confirmPassword}</Text>
                                    ) : null}
                                </FormControl>
                            </Stack>
                            <Stack spacing="6">
                                <Button isLoading={isLoading} type='submit' background='blue.500' _hover={{ background: 'blue.400' }} color='white'>Entrar</Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    );
}

export default SignUp;