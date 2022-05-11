import React, { useState, useEffect } from 'react';
import { Card, Avatar, Divider, Tag } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { SView, MView } from '../config';
import { likeAPI, unLikeAPI } from '../api/content';
import LocalStorageHook from './LocalCustum';
import { CONTENT_LIKE_REQUEST } from '../reducer/content';

const CardContainer = styled(Card)`
  width: 270px;
  height: 350px;
  cursor: pointer;
  transition: 0.2s ease-in;
  margin: 1rem 2rem 1rem 2rem;
  &:hover {
    transform: scale(1.03, 1.03);
  }
  .heart-icon {
    position: absolute;
    right: 0.5rem;
    bottom: 0;
  }
  .ant-card-body {
    padding: 0 !important;
  }
  .thumbnail {
    height: 140px;
  }
  .content-text {
    padding: 5px;
    height: 150px;
    overflow-y: hidden;
  }
  .content-state {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
  .divider {
    margin-bottom: 9px;
    margin-top: 3px;
  }
  .stack-tag {
    position: absolute;
    right: -0.4rem;
    top: 0;
  }
  .solved-tag {
    position: absolute;
    right: -0.5rem;
    top: 0.3rem;
  }
  .filled-icon {
    color: red;
    cursor: pointer;
    /* pointer-events: none; */
  }
  .outline-icon {
    cursor: pointer;
    /* pointer-events: none; */
  }
  @media screen and (max-width: ${MView}px) {
    & {
      width: 320px;
      height: 410px;
    }
  }
  @media screen and (max-width: ${SView}px) {
    & {
      width: 380px;
      height: 450px;
    }
  }
`;

const { Meta } = Card;

function Content({ contentInfo }) {
  const { thumbnail, updatedAt, stack, title, description, likers, done } =
    contentInfo;
  const { profile, username } = contentInfo.userInfo;
  const [like, setlike] = useState(LocalStorageHook('unlike', false));
  const [totalLike, setTotalLike] = useState(likers.length);
  // const [like, setlike] = useState(false);
  const customUpdate = updatedAt.split(' ')[0];
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user);
  const likeMutation = useMutation(likeAPI);
  const unLikeMutation = useMutation(unLikeAPI);
  const dispatch = useDispatch();
  // console.log('contentinfo입니다', contentInfo);
  const handleLike = e => {
    e.stopPropagation();
    if (!like) {
      likeMutation.mutate({
        postId: contentInfo.id,
        userId: userInfo.id,
      });
      console.log(likeMutation.data.data.data);
      // dispatch({
      //   type: CONTENT_LIKE_REQUEST,
      //   data: contentInfo.data,
      // });
      setlike(LocalStorageHook('like', true));
    } else if (like) {
      unLikeMutation.mutate({
        postId: contentInfo.id,
        userId: userInfo.id,
      });
      setlike(LocalStorageHook('unlike', false));
    }
  };
  useEffect(() => {
    if (likeMutation.isSuccess) {
      const likeInfo = likeMutation(contentInfo.id);
      console.log(likeInfo);
      // dispatch({
      //   type: CONTENT_LIKE_REQUEST,
      //   data: contentInfo.data,
      // });
    }
  }, likeMutation.status);
  const handleDetail = () => {
    navigate(`/content/${contentInfo.id}`);
  };
  return (
    <CardContainer
      onClick={handleDetail}
      cover={
        thumbnail ? (
          <img className="thumbnail" alt="example" src={thumbnail} />
        ) : null
      }
    >
      <Tag className="stack-tag" color="green">
        {stack}
      </Tag>
      <div className="content-info">
        <div className="content-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="content-state">
          <Divider className="divider" />
          <Meta
            avatar={<Avatar src={profile} />}
            title={username}
            description={customUpdate}
          />
          <Tag className="solved-tag" color={done ? 'gold' : 'blue'}>
            {done ? 'solved' : 'resolving'}
          </Tag>
          <div className="heart-icon" onClick={handleLike}>
            {!like ? (
              <HeartOutlined className="outline-icon" />
            ) : (
              <HeartFilled className="filled-icon" />
            )}
            {totalLike}
          </div>
        </div>
      </div>
    </CardContainer>
  );
}

export default Content;
