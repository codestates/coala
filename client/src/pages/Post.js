import '@toast-ui/editor/dist/toastui-editor.css';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-clojure';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import { Editor } from '@toast-ui/react-editor';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { SET_ERROR_MESSAGE } from '../reducer/modal';
import { CoalaGreen, language, colors, MView, SView } from '../config';
import { uploadFiles } from '../firebase';
import { editContentAPI, postContentAPI } from '../api/content';
import { POST_CONTENT_SUCCESS } from '../reducer/content';

const Container = styled.div`
  width: 95%;
  margin: auto;
  height: 100vh;
  form {
    height: 70%;
    width: 100%;
  }
  .title-input {
    border: none;
    width: 100%;
    height: 80px;
    font-size: 30px;
    font-weight: 700;
  }
  .title-input:focus {
    outline: none;
  }
  .selectStack {
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.1s ease-in;
    margin-bottom: 0;
  }
  .submin-container {
    margin-top: 1rem;
    font-size: 16px;
    font-weight: 700;
  }
  .submit-btn {
    width: 95px;
    height: 37px;
    color: white;
    background-color: ${CoalaGreen};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 1.5rem;
  }
  .backhome {
    border: none;
    background-color: transparent;
    display: inline-block;
    cursor: pointer;
    p {
      display: inline-block;
      transition: 0.1s ease-in;
    }
  }
  .backhome:hover {
    p {
      transform: translateX(10%);
    }
  }
  .tag {
    cursor: pointer;
  }
  .selected-tag {
    line-height: 30px;
    font-size: 19px;
    height: 30px;
    margin-bottom: 1rem;
  }
`;

function Post({ isEdit }) {
  const [tagsInfo, setTagsInfo] = useState([]);
  const [title, setTitle] = useState(isEdit ? isEdit.title : '');
  const [tag, setTag] = useState(
    isEdit ? { stack: isEdit.stack, color: 'gold' } : null,
  );
  const [innerWidth, setInnerWidth] = useState(MView);
  const [content, setContent] = useState(isEdit ? isEdit.content : '');
  const editorRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.user);

  const postContentMutation = useMutation(postContentAPI);
  const editContentMutation = useMutation(editContentAPI);

  // ????????? ????????? ???????????? ?????????????????? ????????? ??????
  if (!userInfo) {
    navigate('/');
  }

  const contentHandler = () => {
    setContent(editorRef.current.getInstance().getMarkdown() || '');
  };

  useEffect(() => {
    if (editContentMutation.isSuccess) {
      const { contentId } = editContentMutation.data.data.data;
      navigate(`/content/${contentId}`);
    } else if (editContentMutation.isError) {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '????????? ?????? ??????.',
      });
    }
  }, [editContentMutation.status]);

  useEffect(() => {
    if (postContentMutation.isSuccess) {
      const { id } = postContentMutation.data.data.data;
      dispatch({
        type: POST_CONTENT_SUCCESS,
        data: postContentMutation.data.data.data,
      });
      navigate(`/content/${id}`);
    } else if (postContentMutation.isError) {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '????????? ?????? ??????.',
      });
    }
  }, [postContentMutation.status]);

  const handleSubmit = e => {
    e.preventDefault();
    if (title && tag && editorRef.current) {
      const des = JSON.stringify(
        editorRef.current.getInstance().getHTML(),
      ).replace(/<[^>]*>?/g, '');
      // ????????? ???????????? ???????????? ??????.
      let tumb = JSON.stringify(
        editorRef.current.getInstance().getHTML(),
      ).split(`<img src=`);
      if (tumb.length > 1) {
        tumb = tumb[1]
          .split(' ')[0]
          .substring(2, tumb[1].split(' ')[0].length - 2);
      } else {
        tumb = null;
      }
      let description = des.substring(1, des.length - 1);
      if (des.length > 150) {
        description = `${des.substring(1, 150)}...`;
      }
      const contentInfo = {
        userId: userInfo.id,
        title,
        stack: tag.stack,
        content: editorRef.current.getInstance().getMarkdown(),
        thumbnail: tumb,
        description,
      };
      if (isEdit) {
        const editBody = {
          ...contentInfo,
          postId: isEdit.id,
        };
        setContent(editorRef.current.getInstance().getMarkdown());
        editContentMutation.mutate(editBody);
      } else {
        postContentMutation.mutate(contentInfo);
      }
    } else {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '???????????? ???????????????.',
      });
    }
  };
  const handleResize = () => {
    setInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook('addImageBlobHook');
      editorRef.current
        .getInstance()
        .addHook('addImageBlobHook', (blob, callback) => {
          // ????????? ?????????????????? ?????????
          // callback(data.location, 'imageURL') ??? ???????????? ????????? ???????????? URL????????? ?????? ![](??????) ???????????? ???????????? ????????? ???????????????.
          uploadFiles(blob).then(imgPath => {
            callback(imgPath, 'imageURL');
          });
        });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ????????? ????????? ???????????? ???????????? ?????? ???????????? ???????????????????????? ??????.
  useEffect(() => {
    setTagsInfo(
      language.map(stack => {
        const randomColorIdx = Math.floor(Math.random() * colors.length);
        return { stack, color: colors[randomColorIdx] };
      }),
    );
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <input
          className="title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="????????? ???????????????"
        />
        {tag ? (
          <Tag
            closable
            onClose={() => setTag(null)}
            className="selected-tag"
            color={tag.color}
          >
            {tag.stack}
          </Tag>
        ) : null}
        {tag ? null : <p className="selectStack">????????? ????????? ??????????????????</p>}
        {tag ? null : (
          <div className="stacks">
            {tagsInfo.map(stackInfo => (
              <Tag
                onClick={() =>
                  setTag({ stack: stackInfo.stack, color: stackInfo.color })
                }
                className="tag"
                color={stackInfo.color}
                key={stackInfo.stack}
              >
                {stackInfo.stack}
              </Tag>
            ))}
          </div>
        )}

        <Editor
          plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
          height="100%"
          initialValue={content}
          previewStyle={innerWidth < SView ? 'tab' : 'vertical'}
          initialEditType="markdown"
          onChange={contentHandler}
          ref={editorRef}
        />
        <div className="submin-container">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="backhome"
          >
            <LeftOutlined />
            <p>?????????</p>
          </button>
          {isEdit ? (
            <button className="submit-btn" type="submit">
              ????????????
            </button>
          ) : (
            <button className="submit-btn" type="submit">
              ????????????
            </button>
          )}
        </div>
      </form>
    </Container>
  );
}

export default Post;
