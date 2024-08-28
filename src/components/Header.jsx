import { Button, HStack, Heading, Image, useColorMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React from 'react';
import img from '../assets/img.png';

const Header = () => {
  const { colorMode } = useColorMode();
  return (
    <HStack
      bgColor={colorMode === 'light' ? '#e6e6ea' : '#051923'}
      p={'4'}
      shadow={'base'}
      boxShadow={'full'}
      pos={'sticky'}
      top={'0'}
      w={'full'}
      zIndex={'10'}
    >
      <HStack w={'full'}>
        <Link to="/">
          <HStack
            transition={'all 0.3s'}
            css={{
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Image src={img} alt="Logo" boxSize={'40px'} />
            <Heading
              fontWeight={'400'}
              size={'lg'}
              color={colorMode === 'dark' ? 'white' : 'black'}
              paddingLeft={'0px'}
            >
              CryptoVerse
            </Heading>
          </HStack>
        </Link>
      </HStack>
      <HStack paddingRight={'12'}>
        <Button
          variant={'unstyled'}
          color={colorMode === 'dark' ? 'white' : 'black'}
          paddingRight={'5'}
          transition={'all 0.3s'}
          css={{
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Link to="/">Home</Link>
        </Button>
        <Button
          variant={'unstyled'}
          color={colorMode === 'dark' ? 'white' : 'black'}
          paddingRight={'5'}
          transition={'all 0.3s'}
          css={{
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Link to="/exchanges">Exchanges</Link>
        </Button>
        <Button
          variant={'unstyled'}
          color={colorMode === 'dark' ? 'white' : 'black'}
          paddingRight={'5'}
          transition={'all 0.3s'}
          css={{
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Link to="/coins">Coins</Link>
        </Button>
      </HStack>
    </HStack>
  );
};

export default Header;
