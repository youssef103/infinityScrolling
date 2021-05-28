import { useEffect, useState, useCallback, useRef } from 'react';

export default function useInfintyScroll({
  orgArray = [],
  itemsPerPage = 70,
  options = { root: null, rootMargin: '0px', threshold: [1, 0] },
}) {
  const observer = useRef();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  let indexOfFirstItem;
  let indexOfLastItem;
  let newItems = [];

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entities) => {
        if (entities[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const renderMoreItems = async () => {
    setLoading(true);
    indexOfLastItem = pageNumber * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;

    newItems = await orgArray.slice(indexOfFirstItem, indexOfLastItem);
    setTimeout(() => {
      setData((prev) => [...prev, ...newItems]);

      setLoading(false);
      orgArray.length && setHasMore(orgArray.length !== data.length);
    }, 200);
  };

  useEffect(() => {
    renderMoreItems();

    // eslint-disable-next-line
  }, [pageNumber]);

  return { loading, data, hasMore, lastElementRef, setPageNumber };
}
