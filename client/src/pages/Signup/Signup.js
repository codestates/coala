import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import {
  CheckCircleOutlined,
  CheckCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { signupAPI } from '../../api/user';
import { strongPassword } from './validator';
import { SET_ERROR_MESSAGE, SET_SUCCESS_MESSAGE } from '../../reducer/modal';
import { Terms1, Terms2, Terms3, Terms4 } from './terms';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    userName: '',
    email: '',
    password: '',
    passwordChecked: '',
  });
  const [isAccept, setIsAccept] = useState(false);
  const signupMutation = useMutation(signupAPI);
  const [isAllCheck, setAllCheck] = useState(false);
  const [termsCheck, setTurmsCheck] = useState(false);
  const [privercyCheck, setPrivercyCheck] = useState(false);
  const [locationCheck, setLocationCheck] = useState(false);
  const [promotionCheck, setPromotionCheck] = useState(false);
  const [errUserName, setErrUserName] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [errPasswordChecked, setErrPasswordChecked] = useState('');
  const dispatch = useDispatch();
  const isValidEmail = emailVal =>
    emailVal.includes('@') && emailVal.includes('.');

  function allcheckHandler() {
    if (!isAllCheck) {
      setTurmsCheck(true);
      setPrivercyCheck(true);
      setLocationCheck(true);
      setPromotionCheck(true);
    } else {
      setTurmsCheck(false);
      setPrivercyCheck(false);
      setLocationCheck(false);
      setPromotionCheck(false);
    }
  }

  useEffect(() => {
    if (
      termsCheck === true &&
      privercyCheck === true &&
      locationCheck === true &&
      promotionCheck === true
    ) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [termsCheck, privercyCheck, locationCheck, promotionCheck]);
  useEffect(() => {
    const {
      userName,
      email: curEmail,
      password: curpassword,
      passwordChecked,
    } = signupInfo;

    if (!userName) {
      setErrUserName('????????? ??????????????????.');
    } else {
      setErrUserName('');
    }
    if (!curEmail || !isValidEmail(curEmail)) {
      setErrEmail('@, . ??????????????????');
    } else {
      setErrEmail('');
    }
    if (!curpassword || !strongPassword(curpassword)) {
      setErrPassword('????????????8???????????? ??? ???????????????????????? ?????????????????????.');
    } else {
      setErrPassword('');
    }
    if (curpassword !== passwordChecked) {
      setErrPasswordChecked('??????????????? ???????????? ?????????.');
    } else {
      setErrPasswordChecked('');
    }
  }, [signupInfo]);

  const handleInputValue = (key, e) => {
    // console.log(signupInfo.email);
    setSignupInfo({ ...signupInfo, [key]: e.target.value });
  };

  const handleAccept = () => {
    if (termsCheck && privercyCheck) {
      setIsAccept(true);
    } else {
      setAllCheck(false);
      dispatch({ type: SET_ERROR_MESSAGE, data: '??????????????? ??????????????????' });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!errUserName && !errPassword && !errPasswordChecked && !errEmail) {
      signupMutation.mutate({
        email: signupInfo.email,
        username: signupInfo.userName,
        password: signupInfo.password,
      });
    } else {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: '???????????? ????????? ????????? ?????????.',
      });
    }
  };

  useEffect(() => {
    if (signupMutation.isSuccess) {
      dispatch({
        type: SET_SUCCESS_MESSAGE,
        data: '???????????? ??????.',
      });
    } else if (signupMutation.isError) {
      dispatch({
        type: SET_ERROR_MESSAGE,
        data: signupMutation.error.response.data.message,
      });
    }
  }, [signupMutation.status]);

  return (
    <>
      {/* {signupMutation.isError ? <div>??????</div> : null} */}
      {isAccept ? (
        <SignupDiv>
          <SignLogo to="/">Coala</SignLogo>
          <form onSubmit={handleSubmit}>
            <div className="InputBox">
              <div className="InputTitle">??????</div>
              <input
                className="InputName"
                type="text"
                name="inputName"
                placeholder="????????? ???????????????."
                onChange={e => handleInputValue('userName', e)}
              />
            </div>
            {errUserName ? (
              <span className="errmessage failureNameMessage ">
                {errUserName}
              </span>
            ) : (
              <span className="errmessage failureNameMessage hidden">
                ???????????????.
              </span>
            )}
            <div className="InputBox">
              <div className="InputTitle">?????????</div>
              <input
                className="InputEmail"
                type="text"
                name="inputEmail"
                placeholder="???????????? ???????????????."
                onChange={e => handleInputValue('email', e)}
              />
              <br />
              {errEmail ? (
                <span className="errmessage failureEmailMessage">
                  {errEmail}
                </span>
              ) : (
                <span className="errmessage failureEmailMessage hidden">
                  ??????
                </span>
              )}
            </div>
            <div className="InputBox">
              <div className="InputTitle">????????????</div>
              <input
                className="InputPassword"
                type="password"
                name="inputPassword"
                placeholder="??????????????? ???????????????."
                onChange={e => handleInputValue('password', e)}
              />
              <br />
              {errPassword ? (
                <span className="errmessage failurePasswordMessage">
                  {errPassword}
                </span>
              ) : (
                <span className="errmessage ailurePasswordMessage hidden">
                  ??????
                </span>
              )}
            </div>
            <div className="InputBox">
              <div className="InputTitle">???????????? ??????</div>
              <input
                className="InputPasswordChecked"
                type="password"
                name="inputPassword"
                placeholder="??????????????? ???????????????."
                onChange={e => handleInputValue('passwordChecked', e)}
              />
              <br />
              {errPasswordChecked ? (
                <span className="errmessage failureCheckMessage">
                  {errPasswordChecked}
                </span>
              ) : (
                <span className="errmessage failureCheckMessage hidden">
                  ??????
                </span>
              )}
            </div>
            <button type="submit" className="SignupBtn">
              {signupMutation.isLoading ? <LoadingOutlined /> : '????????????'}
            </button>
          </form>
        </SignupDiv>
      ) : (
        <AcceptDiv>
          <SignLogo to="/">Coala</SignLogo>
          <div className="termsBox">
            <div className="acceptCheckTitleBox">
              <CheckCircleOutlined
                onClick={() => allcheckHandler(isAllCheck)}
                className={!isAllCheck ? 'acceptIcon' : 'IconCheck'}
              />
              <div className="acceptTitle">
                ????????? ??????????????? ?????? ???????????????
              </div>
            </div>
          </div>
          <div className="termsBox">
            <div className="acceptCheckTitleBox">
              <CheckCircleOutlined
                className={!termsCheck ? 'acceptIcon' : 'IconCheck'}
                onClick={() => setTurmsCheck(!termsCheck)}
              />
              <div className="acceptTitle">????????? ????????????(??????)</div>
            </div>
            <div className="AcceptBox" type="text">
              <Terms1 />
            </div>
          </div>
          <div className="termsBox">
            <div className="acceptCheckTitleBox">
              <CheckCircleOutlined
                className={!privercyCheck ? 'acceptIcon' : 'IconCheck'}
                onClick={() => setPrivercyCheck(!privercyCheck)}
              />
              <div className="acceptTitle">???????????? ?????? ??? ??????(??????)</div>
            </div>
            <div className="AcceptBox" type="text">
              <Terms2 />
            </div>
          </div>
          <div className="termsBox">
            <div className="acceptCheckTitleBox">
              <CheckCircleOutlined
                className={!locationCheck ? 'acceptIcon' : 'IconCheck'}
                onClick={() => setLocationCheck(!locationCheck)}
              />
              <div className="acceptTitle">???????????? ?????? ?????? ??????(??????)</div>
            </div>
            <div className="AcceptBox" type="text">
              <Terms3 />
            </div>
          </div>
          <div className="termsBox">
            <div className="acceptCheckTitleBox">
              <CheckCircleOutlined
                className={!promotionCheck ? 'acceptIcon' : 'IconCheck'}
                onClick={() => setPromotionCheck(!promotionCheck)}
              />
              <div className="acceptTitle">???????????? ???????????? ??????(??????)</div>
            </div>
            <div className="AcceptBox" type="text">
              <Terms4 />
            </div>
          </div>
          <button type="button" className="accept-btn" onClick={handleAccept}>
            ??????
          </button>
        </AcceptDiv>
      )}{' '}
    </>
  );
}
// ????????? ??????
const SignLogo = styled(Link)`
  color: black;
  text-decoration-line: none;
  font-size: 50px;
  margin-top: 80px;
  margin-bottom: 20px;
  font-weight: 600;
  font-style: italic;
  text-align: center;
  cursor: pointer;
  transition: 2s;
`;
// ???????????? ??????
const SignupDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .InputBox {
    margin-top: 30px;
  }
  .InputTitle {
    text-align: left;
    font-size: 15px;
    font-weight: bold;
  }
  .SignupBtn {
    margin-top: 40px;
    border-radius: 10px;
    border: none;
    width: 350px;
    height: 55px;
    font-size: 20px;
    font-weight: bold;
    background-color: #555555;
    color: white;
    cursor: pointer;
    transition: 0.6s;
    :hover {
      transform: scale(0.98);
    }
  }
  .InputName,
  .InputPassword,
  .InputPasswordChecked,
  .InputEmail {
    margin-top: 5px;
    width: 350px;
    height: 45px;
    border-color: #999999;
    border-top: none;
    border-left: none;
    border-right: none;
    border-width: 1px;
  }
  .errmessage {
    color: red;
    font-size: 11px;
  }
`;

// ???????????? ??????
const AcceptDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 80px;
  .accept-btn {
    padding-top: 5px;
    text-align: center;
    margin-top: 45px;
    border-radius: 10px;
    border: none;
    width: 350px;
    height: 55px;
    font-size: 20px;
    font-weight: bold;
    background-color: #555555;
    color: white;
    cursor: pointer;
  }
  .termsBox {
    margin-top: 20px;
  }
  .AcceptBox {
    overflow: auto;
    margin-top: 1px;
    width: 350px;
    height: 100px;
    border: 1px solid grey;
    border-width: 1px;
  }
  .acceptTitle {
    margin-bottom: 10px;
    text-align: left;
    font-size: 17px;
    font-weight: bold;
  }
  .acceptCheckTitleBox {
    display: flex;
  }
  .acceptIcon {
    left: 5px;
    margin-top: 2px;
    margin-right: 5px;
    font-size: 20px;
    color: grey;
  }
  .IconCheck {
    left: 5px;
    margin-top: 2px;
    margin-right: 5px;
    font-size: 20px;
    color: green;
  }
`;

export default Signup;
