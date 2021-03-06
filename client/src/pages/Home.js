import React, { useEffect, useState } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Contents from '../components/Contents';
import { getContentsAPI, getMoreContentsAPI } from '../api/content';
import { LOAD_CONTENTS_SUCCESS, LOAD_MORE_CONTENTS } from '../reducer/content';
import LoadingContents from '../components/LoadingContents';

function Home() {
  let throttle = false;
  const { mainContents, isloadMainContents } = useSelector(
    state => state.content,
  );
  const dispatch = useDispatch();
  const {
    isLoading,
    isError,
    data: contentsData,
    error,
  } = useQuery('maincontents', getContentsAPI, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 0, // 실페시 재실행 여부
    enabled: !isloadMainContents,
  });

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['mainContents'],
    ({ pageParam = mainContents[0].id + 1 }) => getMoreContentsAPI(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      enabled: mainContents.length > 0,
    },
  );

  // console.log('data:', data);
  // console.log('hasNextpage:', hasNextPage);

  useEffect(() => {
    const handleScroll = async () => {
      if (!throttle) {
        if (
          hasNextPage &&
          window.scrollY + document.documentElement.clientHeight >
            document.documentElement.scrollHeight - 100
        ) {
          throttle = true;
          const answer = await fetchNextPage();
          const newData = [];
          answer.data.pages.forEach(page => newData.push(...page.items));
          dispatch({
            type: LOAD_MORE_CONTENTS,
            data: newData,
          });
          throttle = false;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mainContents, hasNextPage]);

  useEffect(() => {
    if (contentsData && !isloadMainContents) {
      dispatch({
        type: LOAD_CONTENTS_SUCCESS,
        data: contentsData.data.data,
      });
    }
  }, [contentsData, isloadMainContents]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <NavBar />
        <LoadingContents />
      </div>
    );
  }
  return (
    <div>
      <Header />
      <NavBar />
      <Contents mainContents={mainContents} />
    </div>
  );
}

export default Home;
