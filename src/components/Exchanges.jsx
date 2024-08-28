import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../index';
import { Container, HStack, Button } from '@chakra-ui/react';
import Loader from './Loader';
import ErrorComponent from './ErrorComponent';
import {
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import ExchangeCard from './ExchangeCard';

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalElement, setTotalElement] = useState(601);
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
  if (maxPageNumberLimit !== totalPage) {
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
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(
          `${server}/exchanges?per_page=${itemsPerPage}&page=${currentPage}`
        );
        setLoading(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setExchanges(data);
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
    fetchExchanges();
  }, [itemsPerPage, currentPage]);
  if (error) {
    return <ErrorComponent message={'Error While Fetching Exchanges'} />;
  } else {
    return (
      <Container maxW={'container.xl'}>
        {loading ? (
          <Loader />
        ) : (
          <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {exchanges.map(i => (
              <ExchangeCard
                key={i.id}
                name={i.name}
                rank={i.trust_score_rank}
                img={i.image}
                url={i.url}
              />
            ))}
          </HStack>
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
  }
};

export default Exchanges;
