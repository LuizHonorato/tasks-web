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
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAuth } from '../../hooks/auth';
import { useState } from 'react';
import { AxiosError } from 'axios';
  
const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const signInValidationSchema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().min(6, 'Mínimo de 6 dígitos'),
    });

    const { errors, touched, handleChange, handleSubmit, values } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: signInValidationSchema,
        onSubmit: async (values) => {
            try {
                await signIn({
                    email: values.email,
                    password: values.password
                });

                setIsLoading(false);
    
                navigate('/tasks');
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
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} overflow='hidden'>
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                    <Heading size={{ base: 'xs', md: 'lg' }}>Entrar</Heading>
                    <Text color="fg.muted">
                        Ainda não tem uma conta? <Link href="/signup" color='blue.500'>Inscreva-se</Link>
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

export default SignIn;