import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { CoalaGreen, CoalaGrey, language } from '../config';

const Container = styled.div`
  position: absolute;
  -webkit-box-shadow: 2px 1px 17px -3px rgba(0, 0, 0, 0.42);
  box-shadow: 2px 1px 17px -3px rgba(0, 0, 0, 0.42);
  height: 460px;
  overflow-y: scroll;
  width: 200px;
  top: 40px;
  right: -70px;
  background-color: #ffffff;
  z-index: 1000;
  ul {
    list-style: none;
    padding: 0px;
    margin: 0;
    li {
      line-height: 3rem;
      font-size: 16px;
      font-weight: 500;
      height: 48px;
      width: 100%;
      margin: 0;
      padding-left: 16px;
      transition: 0.3s ease-in;
      cursor: pointer;
    }
    li:hover {
      background-color: ${CoalaGrey};
      color: ${CoalaGreen};
    }
  }
`;
function StackMore() {
  const navigator = useNavigate();
  const handleStackContents = (e, stack) => {
    e.stopPropagation(); // 버블링 방지.
    navigator(`/stack/${stack}`);
  };

  return (
    <Container>
      <ul>
        {language.map(stack => (
          <li onClick={e => handleStackContents(e, stack)} key={stack}>
            {stack}
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default StackMore;
