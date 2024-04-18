import { Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import Header from "../../components/Header";
import { FiArrowLeft } from "react-icons/fi";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import api from "../../services/api";
import { AxiosError } from "axios";
import { getCookie } from "../../utils/getCookie";

interface FormProps {
    id?: number;
    name: string;
    description?: string;
    completed?: boolean;
}

const TaskForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const { task, isEdit } = location.state;

    const saveTaskValidationSchema = Yup.object().shape({
        id: Yup.number(),
        name: Yup.string().required('Nome é obrigatório'),
        description: Yup.string(),
        completed: Yup.boolean(),
    });

    const { errors, touched, handleChange, handleSubmit, values } = useFormik<FormProps>({
        initialValues: {
            id: task && task.id ? task.id : undefined,
            name: task && task.name ? task.name : '',
            description: task && task.description ? task.description : '',
            completed: task && task.delivered_at ? true : false,
        },
        validationSchema: saveTaskValidationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                if (!isEdit) {
                    await api.post(`/api/tasks`, {
                        name: values.name,
                        description: values.description,
                        completed: values.completed,
                    }, {
                        headers: {
                            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                        }
                    });

                    setIsLoading(false);

                    navigate('/');
                } else {
                    await api.patch(`/api/tasks/${task?.id}`, {
                        id: values.id,
                        name: values.name,
                        description: values.description,
                        completed: values.completed,
                    }, {
                        headers: {
                            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                        }
                    });

                    setIsLoading(false);

                    navigate('/');
                }
            } catch (error) {
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

    const handleNavigateBack = useCallback(() => {
        navigate('/');
    }, [navigate]);

    return (
        <>
            <Header />
            <Box px={{ sm: 4, lg: 24 }} marginTop={20}>
                <Flex justifyContent={'flex-start'} alignItems={'center'} gap={4}>
                    <FiArrowLeft onClick={handleNavigateBack} size={36} />
                    <Heading>{ isEdit ? 'Editar tarefa' : 'Criar tarefa' }</Heading>
                </Flex>
            </Box>
            <Stack maxW={'50%'} px={{ base: 4, lg: 24 }} spacing="8" marginTop={12}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing="5">
                        <Input id="id" type="number" disabled hidden value={values.id} />
                        <FormControl>
                            <FormLabel htmlFor="name">Nome da tarefa</FormLabel>
                            <Input id="name" type="text" onChange={handleChange} value={values.name} />
                            {errors.name && touched.name ? (
                                <Text color='red.500' fontSize={{ base: 'sm' }}>{errors.name}</Text>
                            ) : null}
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="description">Descrição</FormLabel>
                            <Textarea id="description" rows={7} resize={'none'} onChange={handleChange} value={values.description} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="completed">Tarefa completa?</FormLabel>
                            <Checkbox id="completed" onChange={handleChange} defaultChecked={values.completed} value={values.completed ? 1 : 0} />
                        </FormControl>
                        <Stack spacing="6">
                            <Button isLoading={isLoading} type='submit' background='blue.500' _hover={{ background: 'blue.400' }} color='white'>Salvar</Button>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </>
    );
}

export default TaskForm;