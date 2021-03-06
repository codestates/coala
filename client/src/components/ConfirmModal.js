import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { CoalaGreen } from '../config';
import { solvedContentAPI, deleteContentAPI } from '../api/content';
import { SET_ERROR_MESSAGE } from '../reducer/modal';
import {
  DELETE_CONTENT_SUCCESS,
  EDIT_CONTENT_REQUEST,
  SOLVED_CONTENT_SUCCESS,
} from '../reducer/content';

const Container = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 5, 12, 0.5);
  z-index: 100;
  justify-content: center;
  align-items: center;
  .confirm-box {
    position: relative;
    padding: 1rem;
    width: 400px;
    height: 200px;
    background-color: white;
    border-radius: 5px;
    .btn-box {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      button {
        width: 63px;
        height: 28px;
        margin-left: 1rem;
        cursor: pointer;
      }
      #cancel-btn {
        background-color: transparent;
      }
      #delete-btn {
        background-color: #e15f41;
        color: white;
        border: none;
      }
      #edit-btn {
        width: 67px;
        background-color: ${CoalaGreen};
        color: white;
        border: none;
      }
    }
  }
`;
function ConfirmModal({
  confirm,
  closeConfirm,
  contentId,
  refetch,
  contentData,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const solvedMutation = useMutation(() => solvedContentAPI(contentId));
  const deleteMutation = useMutation(() => deleteContentAPI(contentId));
  const handleClose = () => {
    closeConfirm('');
  };
  const handleSolved = () => {
    solvedMutation.mutate({});
  };
  const handleDelete = () => {
    deleteMutation.mutate({});
  };
  const handleEdit = () => {
    dispatch({
      type: EDIT_CONTENT_REQUEST,
      data: contentData,
    });
    navigate('/edit');
  };
  useEffect(() => {
    if (solvedMutation.isSuccess) {
      dispatch({
        type: SOLVED_CONTENT_SUCCESS,
        data: +contentId,
      });
      refetch();
      closeConfirm('');
    } else if (solvedMutation.isError) {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '?????? ??????.',
      });
    }
  }, [solvedMutation.status]);

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      dispatch({
        type: DELETE_CONTENT_SUCCESS,
        data: +contentId,
      });
      closeConfirm('');
      navigate('/');
    } else if (deleteMutation.isError) {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '????????? ?????? ??????.',
      });
    }
  }, [deleteMutation.status]);

  return (
    <Container>
      <div className="confirm-box">
        {confirm === 'delete' ? (
          <>
            {' '}
            <h2>????????? ??????</h2>
            <h3>????????? ?????????????????????????</h3>
            <div className="btn-box">
              <button onClick={handleClose} id="cancel-btn" type="button">
                ??????
              </button>
              <button onClick={handleDelete} id="delete-btn" type="button">
                ??????
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>????????????!</h2>
            <h3>
              ??? ?????? ??????????????? ?????? ?????? ??????????????? ???????????? ???????????????
              ?????????????
            </h3>
            <div className="btn-box">
              <button onClick={handleSolved} id="cancel-btn" type="button">
                ?????????
              </button>
              <button onClick={handleEdit} id="edit-btn" type="button">
                ????????????
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default ConfirmModal;
