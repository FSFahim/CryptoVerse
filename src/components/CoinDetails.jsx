import {
  Container,
  HStack,
  Radio,
  RadioGroup,
  VStack,
  Text,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  useColorMode,
  Progress,
  Box,
  Button,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Chart from './Chart';
import ErrorComponent from './ErrorComponent';
import axios from 'axios';
import { server } from '../index';
import { useParams } from 'react-router-dom';

const CoinDetails = () => {
  const [coin, setCoin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('bdt');
  const [days, setDays] = useState('24h');
  const [chartArray, setChartArray] = useState([]);
  const { colorMode } = useColorMode();
  const params = useParams();
  const currencySymbol =
    currency === 'bdt'
      ? '৳'
      : currency === 'eur'
      ? '€'
      : currency === 'usd'
      ? '$'
      : '';

  const btns = ['24h', '7d', '15d', '30d', '60d', '200d', '365d', 'max'];

  const switchCharset = key => {
    switch (key) {
      case '24h':
        setDays('24h');
        break;
      case '7d':
        setDays('7d');
        break;
      case '15d':
        setDays('15d');
        break;
      case '30d':
        setDays('30d');
        break;
      case '60d':
        setDays('60d');
        break;
      case '200d':
        setDays('200d');
        break;
      case '365d':
        setDays('365d');
        break;
      case 'max':
        setDays('max');
        break;
      default:
        setDays('24h');
        break;
    }
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        setLoading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );
        setChartArray(chartData.prices);
        setCoin(data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setTimeout(() => {
          setLoading(false);
          setError(true);
        }, 1000);
      }
    };
    fetchCoin();
  }, [params.id, currency, days]);
  if (error) {
    return <ErrorComponent message={'Error While Fetching Coin'} />;
  }
  return (
    <Container maxW={'container.xl'}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency} p={'8'}>
            <HStack spacing={'4'}>
              <Radio value={'bdt'}>BDT</Radio>
              <Radio value={'eur'}>EUR</Radio>
              <Radio value={'usd'}>USD</Radio>
            </HStack>
          </RadioGroup>
          <VStack spacing={'4'} p={'16'} alignItems={'flex-start'}>
            <Image
              src={coin.image.large}
              w={'16'}
              h={'16'}
              objectFit={'contain'}
            />

            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h_in_currency[
                      currency
                    ] > 0
                      ? 'increase'
                      : 'decrease'
                  }
                />
                {
                  coin.market_data.price_change_percentage_24h_in_currency[
                    currency
                  ]
                }
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={'2xl'}
              bgColor={colorMode === 'light' ? '#e6e6ea' : '#051923'}
            >{`#${coin.market_cap_rank}`}</Badge>
            <CustomBar
              high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
            />
            <Box w={'full'} p={'4'}>
              <Item
                title={'Max Supply'}
                value={
                  coin.market_data.max_supply
                    ? coin.market_data.max_supply
                    : 'NA'
                }
              />
              <Item
                title={'Circulating Supply'}
                value={
                  coin.market_data.circulating_supply
                    ? coin.market_data.circulating_supply
                    : 'NA'
                }
              />
              <Item
                title={'Market Cap'}
                value={
                  coin.market_data.market_cap[currency]
                    ? `${currencySymbol} ${coin.market_data.market_cap[currency]}`
                    : 'NA'
                }
              />
              <Item
                title={'All Time High'}
                value={
                  coin.market_data.ath[currency]
                    ? `${currencySymbol} ${coin.market_data.ath[currency]}`
                    : 'NA'
                }
              />
              <Item
                title={'All Time Low'}
                value={
                  coin.market_data.atl[currency]
                    ? `${currencySymbol} ${coin.market_data.atl[currency]}`
                    : 'NA'
                }
              />
            </Box>
            <Box borderWidth={1} w={'full'}>
              <Chart currency={currencySymbol} days={days} arr={chartArray} />
            </Box>
            <HStack p={'4'} wrap={'wrap'}>
              {btns.map(i => (
                <Button key={i} onClick={() => switchCharset(i)}>
                  {i}
                </Button>
              ))}
            </HStack>
            <Text fontSize={'small'} alignSelf="center" opacity={0.7}>
              Last Updated On{' '}
              {Date(coin.market_data.last_updated).split('G')[0]}
            </Text>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>
      {title}
    </Text>
    <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>
      {value}
    </Text>
  </HStack>
);

const CustomBar = ({ high, low }) => {
  return (
    <VStack w={'full'}>
      <Progress value={50} colorScheme="teal" w={'full'} />
      <HStack justifyContent={'space-between'} w={'full'}>
        <Badge children={low} colorScheme="red" />
        <Text fontSize={'sm'}>24h Range</Text>
        <Badge children={high} colorScheme="green" />
      </HStack>
    </VStack>
  );
};

export default CoinDetails;
