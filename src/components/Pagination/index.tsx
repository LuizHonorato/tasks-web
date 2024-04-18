import { Button, ButtonGroup, Flex } from "@chakra-ui/react";

interface PaginationProps {
    isFirstPage?: boolean;
    isLastPage?: boolean;
    nextPage?: number;
    previousPage?: number;
    currentPage?: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ isFirstPage, isLastPage, currentPage, nextPage, previousPage, onPageChange }: PaginationProps) => {
  return (
    <Flex marginTop={6} justifyContent={'flex-end'}>
      <ButtonGroup spacing={2}>
        {!isFirstPage && (
          <Button onClick={() => onPageChange(Number(previousPage))}>&laquo; Anterior</Button>
        )}
        
        <Button disabled>{currentPage}</Button>

        {!isLastPage && (
          <Button onClick={() => onPageChange(Number(nextPage))}>Próximo &raquo;</Button>
        )}
      </ButtonGroup>
    </Flex>
  );
};

export default Pagination;