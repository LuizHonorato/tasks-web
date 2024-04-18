import { 
    TableContainer,
    Table, 
    Thead, 
    Tr, 
    Th, 
    Tbody, 
    Td, 
    Box, 
    Flex, 
    Button, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay,
    Text,
    useDisclosure,
    Input,
    InputGroup,
} 
from "@chakra-ui/react";
import Header from "../../components/Header";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { MetaData, PaginatedTasks, Task } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/getCookie";
import Pagination from "../../components/Pagination";

const TasksList = () => {
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [paginationData, setPaginationData] = useState<MetaData|null>(null);
    const [searchTerm, setSearchTerm] = useState<string|null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task|null>(null);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleGetTasksList = useCallback(async (page: number) => {
        const endpoint = searchTerm 
                            ? `/api/tasks?page=${page}&name=${searchTerm}&per_page=10&column=created_at&order=desc` 
                            : `/api/tasks?page=${page}&per_page=10&column=created_at&order=desc`;
        const { data } = await api.get<PaginatedTasks>(endpoint);

        setTasksList(data.data);
        setPaginationData(data.meta);
    }, [searchTerm]);

    useEffect(() => {
        handleGetTasksList(1);
    }, [handleGetTasksList]);

    const handleNavigateToCreatePage = useCallback(() => {
        navigate('/tasks/form', {
            state: { task: null, isEdit: false }
        });
    }, [navigate]);

    const handleNavigateToEditPage = useCallback((task: Task) => {
        navigate('/tasks/form', {
            state: { task, isEdit: true }
        });
    }, [navigate]);

    const openModalToDeleteTask = useCallback((task: Task) => {
        setTaskToDelete(task);
        onOpen();
    }, [onOpen]);

    const closeModalToDeleteTask = useCallback(() => {
        setTaskToDelete(null);
        onClose();
    }, [onClose]);

    const handleDeleteTask = useCallback(async (id: number) => {
        await api.delete(`/api/tasks/${id}`, {
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
            }
        });
        onClose();
        handleGetTasksList(Number(paginationData?.current_page));
    }, [onClose, handleGetTasksList, paginationData]);

    return (
        <>
            <Header />
            <Box px={{ sm: 4, lg: 24 }} marginTop={20}>
                <Flex justifyContent={'space-between'}>
                    <InputGroup size='md' maxW={'50%'}>
                        <Input
                            pr='4.5rem'
                            type={'text'}
                            placeholder='Buscar tarefas'
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </InputGroup>
                    <Box onClick={handleNavigateToCreatePage} as={'button'} py={2} px={4} fontWeight={500} borderRadius={5} background='blue.500' _hover={{ background: 'blue.400' }} color='white'>
                        Nova tarefa
                    </Box>
                </Flex>
                <TableContainer marginTop={8}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Nome</Th>
                                <Th>Data de entrega</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                tasksList?.map(task => (
                                    <Tr key={task.id}>
                                        <Td>{task.id}</Td>
                                        <Td>{task.name}</Td>
                                        <Td>{task.delivered_at ? new Intl.DateTimeFormat("pt-BR").format(new Date(task.delivered_at)) : '-'}</Td>
                                        <Td>
                                            <Flex alignItems={'center'} gap={2}>
                                                <FiEdit cursor={'pointer'} onClick={() => handleNavigateToEditPage(task)} color="blue" size={22} />
                                                <FiTrash2 cursor={'pointer'}  onClick={() => openModalToDeleteTask(task)} color="red" size={22} />
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                <Pagination 
                    isFirstPage={paginationData?.is_first_page}
                    isLastPage={paginationData?.is_last_page}
                    nextPage={paginationData?.next_page}
                    previousPage={paginationData?.previous_page}
                    currentPage={paginationData?.current_page} 
                    totalPages={paginationData?.total} 
                    onPageChange={(page: number) => handleGetTasksList(page)}
                />
            </Box>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Excluir tarefa</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Tem certeza de que deseja excluir essa tarefa?</Text>
                    <Text fontWeight={500}>{taskToDelete?.name}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={() => handleDeleteTask(Number(taskToDelete?.id))}>
                        Excluir
                    </Button>
                    <Button onClick={closeModalToDeleteTask} variant='ghost'>Cancelar</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default TasksList;