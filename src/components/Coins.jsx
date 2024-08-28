import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../index';
import { Container, HStack, Button, Radio, RadioGroup } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import CoinCard from './CoinCard';
import {
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState('bdt');
  const [totalElement, setTotalElement] = useState(10026);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [pageNumberLimit, setPageNumberLimit] = useState(6);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  let totalPage = Math.ceil(totalElement / itemsPerPage);
  const pages = [];
  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }
  const handlePageClick = event => {
    setCurrentPage(Number(event.target.id));
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
    setMaxPageNumberLimit(6);
    setMinPageNumberLimit(0);
  };

  const handleLastPageClick = () => {
    setCurrentPage(totalPage);
    setMaxPageNumberLimit(totalPage, () => {
      console.log(maxPageNumberLimit);
    });
    setMinPageNumberLimit(totalPage - 6);
    console.log(minPageNumberLimit);
  };

  const handleNextPageClick = () => {
    if (currentPage !== totalPage) {
      setCurrentPage(currentPage + 1);
      if (currentPage + 1 > maxPageNumberLimit) {
        if (maxPageNumberLimit + pageNumberLimit > totalPage) {
          setMaxPageNumberLimit(totalPage);
          setMinPageNumberLimit(totalPage - pageNumberLimit);
        } else {
          setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
      }
    } else {
      setCurrentPage(1);
      setMaxPageNumberLimit(pageNumberLimit);
      setMinPageNumberLimit(0);
    }
  };

  const handlePreviousPageClick = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      if ((currentPage - 1) % pageNumberLimit === 0) {
        if (minPageNumberLimit - pageNumberLimit < 1) {
          setMaxPageNumberLimit(pageNumberLimit);
          setMinPageNumberLimit(0);
        } else {
          setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
      }
    } else {
      setCurrentPage(totalPage);
      setMaxPageNumberLimit(totalPage);
      setMinPageNumberLimit(totalPage - pageNumberLimit);
    }
  };
  const handleNextSixPageClick = () => {
    if (maxPageNumberLimit + pageNumberLimit > totalPage) {
      setMaxPageNumberLimit(totalPage);
      setMinPageNumberLimit(totalPage - pageNumberLimit);
      setCurrentPage(totalPage - pageNumberLimit + 1);
    } else {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      setCurrentPage(minPageNumberLimit + pageNumberLimit + 1);
    }
  };

  const handlePreviousSixPageClick = () => {
    if (minPageNumberLimit - pageNumberLimit < 1) {
      setMaxPageNumberLimit(pageNumberLimit);
      setMinPageNumberLimit(0);
      setCurrentPage(1);
    } else {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      setCurrentPage(minPageNumberLimit - pageNumberLimit + 1);
    }
  };

  let pageDecrementBtn = null;
  if (minPageNumberLimit !== 0) {
    pageDecrementBtn = (
      <Button
        variant={'outline'}
        onClick={handlePreviousSixPageClick}
        colorScheme="blue"
        h={'40px'}
        w={'40px'}
      >
        <BsThreeDots />
      </Button>
    );
  } else {
    pageDecrementBtn = null;
  }

  let pageIncrementBtn = null;
  if (maxPageNumberLimit !== Math.ceil(totalElement / itemsPerPage)) {
    pageIncrementBtn = (
      <Button
        variant={'outline'}
        onClick={handleNextSixPageClick}
        colorScheme="blue"
        h={'40px'}
        w={'40px'}
      >
        <BsThreeDots />
      </Button>
    );
  } else {
    pageIncrementBtn = null;
  }

  const renderPageNumbers = pages.map(number => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <Button
          onClick={handlePageClick}
          key={number}
          id={number}
          colorScheme="blue"
          variant={currentPage === number ? 'solid' : 'outline'}
          h={'40px'}
          w={'40px'}
        >
          {number}
        </Button>
      );
    } else {
      return null;
    }
  });

  const currencySymbol =
    currency === 'bdt'
      ? '৳'
      : currency === 'eur'
      ? '€'
      : currency === 'usd'
      ? '$'
      : '';

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${currentPage}`
        );
        setLoading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setCoins(data);
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
    fetchCoins();
  }, [currency, currentPage]);
  if (error) {
    return <ErrorComponent message={'Error While Fetching Coins'} />;
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
          <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {coins.map(i => (
              <CoinCard
                key={i.id}
                name={i.name}
                symbol={i.symbol}
                img={i.image}
                price={i.current_price}
                currencySymbol={currencySymbol}
                id={i.id}
              />
            ))}
          </HStack>
        </>
      )}
      <HStack wrap={'wrap'} m={'10'} justifyContent={'center'}>
        <Button
          variant={'outline'}
          onClick={handleFirstPageClick}
          colorScheme="blue"
          h={'40px'}
          w={'40px'}
        >
          <AiOutlineDoubleLeft />
        </Button>
        <Button
          variant={'outline'}
          onClick={handlePreviousPageClick}
          colorScheme="blue"
          h={'40px'}
          w={'40px'}
        >
          <AiOutlineLeft />
        </Button>
        {pageDecrementBtn}
        {renderPageNumbers}
        {pageIncrementBtn}
        <Button
          variant={'outline'}
          onClick={handleNextPageClick}
          colorScheme="blue"
          h={'40px'}
          w={'40px'}
        >
          <AiOutlineRight />
        </Button>
        <Button
          variant={'outline'}
          onClick={handleLastPageClick}
          colorScheme="blue"
          h={'40px'}
          w={'40px'}
        >
          <AiOutlineDoubleRight />
        </Button>
      </HStack>
    </Container>
  );
};

export default Coins;
