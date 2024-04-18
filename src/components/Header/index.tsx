import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FiChevronDown } from "react-icons/fi";
import { useAuth } from '../../hooks/auth';

interface Props {
  children: React.ReactNode
}

const Links = ['Início']

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'/'}>
      {children}
    </Box>
  )
}

const Header = () => {
  const { user, signOut } = useAuth();  
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg='white' px={{ sm: 4, lg: 24 }}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            variant={'outline'}
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box fontSize={28} fontWeight={900}>TASKS</Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }} fontSize={{ base: 'sm', md: 'lg' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                variant={'outline'}
                as={Button}
                rounded={'full'}
                cursor={'pointer'}
                fontSize={{ base: 'sm', md: 'lg' }}
                fontWeight={500}
                minW={0}>
                <Flex alignItems={'center'} gap={2}>
                    {user.name}
                    <FiChevronDown />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={signOut}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default Header;