import React, { useState, useEffect } from 'react';

import { httpServices } from '../services/httpService';
import useOnScreen from '../hooks/useOnScreen';
import useInfintyScroll from '../hooks/useInfintyScroll';

export default function App() {
  const [posts, setPosts] = useState([]);

  const {
    data: infinitData,
    loading: isInfintyScrollLoading,
    hasMore: infintyScrollHasMore,
    lastElementRef,
    setPageNumber,
  } = useInfintyScroll({
    orgArray: posts,
    itemsPerPage: 20,
  });

  const {
    data: onScreenData,
    isItemsLoading,
    elementRef,
    hasMore: onScreenHasMore,
  } = useOnScreen({
    orgArray: posts,
    itemsPerPage: 20,
  });

  const getAllPosts = async () => {
    const { data: items } = await httpServices.get(`${httpServices.baseUrl}/posts`);

    await setPosts(items);
    setPageNumber(1);
  };

  useEffect(() => {
    getAllPosts();

    // eslint-disable-next-line
  }, []);

  return (
    <main className="wrapper">
      <div>
        <div className="info">
          <h3>useOnScreen</h3>
          <p>Items: {onScreenData.length}</p>
        </div>

        <ul className="container">
          {onScreenData?.map((post, index) => {
            return (
              <li className="item" key={index}>
                {post.title}
              </li>
            );
          })}
        </ul>

        {isItemsLoading && onScreenHasMore && <p>Loading.......</p>}
        {onScreenHasMore && <p ref={elementRef}>Has more</p>}
      </div>

      <div>
        <div className="info">
          <h3>useInfintyScroll</h3>
          <p>Items: {infinitData.length}</p>
        </div>

        <ul className="container">
          {infinitData?.map((post, index) => {
            return (
              <li
                className="item"
                key={index}
                ref={
                  infinitData.length === index + 1 && infintyScrollHasMore ? lastElementRef : null
                }
              >
                {post.title}
              </li>
            );
          })}
        </ul>

        {isInfintyScrollLoading && infintyScrollHasMore && <p>Loading...</p>}
        {infintyScrollHasMore && <p>Has more</p>}
      </div>
    </main>
  );
}

/*import React, { useState, useEffect } from 'react';

import { httpServices } from '../services/httpService';
import useInfintyScroll from '../hooks/useInfintyScroll';

export default function App() {
  const [posts, setPosts] = useState([]);
  const { data, loading, lastElementRef, setPageNumber } = useInfintyScroll(posts, 20);

  const getAllPosts = async () => {
    const { data: items } = await httpServices.get(`${httpServices.baseUrl}/posts`);

    setPosts(items);
    setPageNumber(1);
  };

  useEffect(() => {
    getAllPosts();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <p style={{ position: 'fixed' }}>Items: {data.length}</p>

      <ul className="container">
        {data?.map((post, index) => {
          return (
            <li
              className="item"
              key={index}
              ref={data.length === index + 1 ? lastElementRef : null}
            >
              {post.title}
            </li>
          );
        })}
      </ul>

      {loading && <p>Loading...</p>}
      {hasMore && <p>Has more</p>}
    </>
  );
}
*/
