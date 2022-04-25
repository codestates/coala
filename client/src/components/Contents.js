import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Content from './Content';
import { XLView, LView, MView, SView } from '../config';

const ContentsContainer = styled.div`
  // 반응형
  margin: auto;
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
function Contents() {
  const { mainContents } = useSelector(state => state.content);

  return (
    <ContentsContainer>
      {mainContents.map(content => (
        <Content key={content.id} contentInfo={content} />
      ))}
    </ContentsContainer>
  );
}

export default Contents;
