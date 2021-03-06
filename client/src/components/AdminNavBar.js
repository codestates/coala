/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Divider } from 'antd';
import { XLView, LView, MView, SView, CoalaGreen } from '../config';
import { getfilterContentsAPI, getContentsAPI } from '../api/content';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { LOAD_CONTENTS_SUCCESS } from '../reducer/content';
import { useNavigate } from 'react-router';

const Menu = styled.div`
  margin: auto;
  ul {
    padding: 0;
    margin-bottom: 0px;
  }
  li {
    position: relative;
    list-style: none;
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    margin-right: 0.5rem;
    margin-left: 1rem;
    cursor: pointer;
    transition: 0.1s ease-in;
    p:hover {
      color: ${CoalaGreen};
    }
  }

  // 반응형
  @media screen and (min-width: ${XLView}px) {
    & {
      width: 1375px;
    }
  }
  @media screen and (max-width: ${LView}px) {
    & {
      width: 1024px;
    }
  }
  @media screen and (max-width: ${MView}px) {
    & {
      width: 90%;
    }
  }
  @media screen and (max-width: ${SView}px) {
    & {
      width: 100%;
    }
  }
`;
const DividerCustom = styled(Divider)`
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;

function AdminNavBar({ handleChoose }) {
  const [MenuList, setMenuList] = useState(false);
  const [done, setDone] = useState(null);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { data: contentsData } = useQuery('contents', getContentsAPI, {
    enabled: done === null,
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 0, // 실페시 재실행 여부
  });

  const { data: filterDoneContents } = useQuery(
    ['filterDoneContents', done],
    () => getfilterContentsAPI({ done }),
    {
      enabled: done !== null,
      refetchOnWindowFocus: false,
    },
  );

  const handleUser = () => {
    navigator('/admin');
  };

  const handlePost = () => {
    navigator('/admin/post');
  };

  useEffect(() => {
    if (contentsData) {
      dispatch({
        type: LOAD_CONTENTS_SUCCESS,
        data: contentsData.data.data,
      });
    }
  }, [contentsData]);

  return (
    <Menu>
      <ul>
        <li onClick={handleUser}>
          <p>모든유저</p>
        </li>
        <li onClick={handlePost}>
          <p>모든게시글</p>
        </li>
      </ul>
      <DividerCustom />
    </Menu>
  );
}

export default AdminNavBar;
