import { useState, useEffect, useRef } from 'react';

export default function useOnScreen({
  orgArray,
  itemsPerPage = 70,
  options = { root: null, rootMargin: '0px', threshold: 1 },
}) {
  const elementRef = useRef();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  let indexOfFirstItem;
  let indexOfLastItem;
  let newItems = [];

  const pageNumbers = Array.from({ length: Math.ceil(orgArray.length / itemsPerPage) }).map(
    (x, i) => i + 1
  );

  const renderMoreItems = async (entities) => {
    //let top = entities[0].boundingClientRect.y;

    if (entities[0].isIntersecting) {
      setPage((prev) => prev + 1);

      setIsItemsLoading(true);
      indexOfLastItem = page * itemsPerPage;
      indexOfFirstItem = indexOfLastItem - itemsPerPage;

      newItems = await orgArray.slice(indexOfFirstItem, indexOfLastItem);

      await setData((prevItems) => [...prevItems, ...newItems]);

      setIsItemsLoading(false);
    }
    orgArray.length && setHasMore(orgArray.length !== data.length);
  };

  // Create an observer
  const observer = new IntersectionObserver(
    renderMoreItems, //callback
    options
  );

  useEffect(() => {
    //Observ the `ref`
    elementRef.current && observer.observe(elementRef?.current);

    // eslint-disable-next-line
    return () => elementRef?.current && observer.unobserve(elementRef?.current);

    // eslint-disable-next-line
  }, [page]);

  return { data, isItemsLoading, elementRef, hasMore, page, pageNumbers };
}
