import { Heading, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const CoinCard = ({ id, name, img, symbol, price, currencySymbol }) => {
  return (
    <Link to={`/coins/${id}`}>
      <VStack
        w={'52'}
        shadow={'lg'}
        borderRadius={'lg'}
        p={'8'}
        transition={'all 0.3s'}
        m={'4'}
        css={{
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Image
          src={img}
          h={'10'}
          w={'10'}
          objectFit={'contain'}
          alt="Exchange"
        />
        <Heading size={'md'} noOfLines={1}>
          {symbol}
        </Heading>
        <Text noOfLines={1}>{name}</Text>
        <Text noOfLines={1}>{price ? `${currencySymbol} ${price}` : 'NA'}</Text>
      </VStack>
    </Link>
  );
};

export default CoinCard;
