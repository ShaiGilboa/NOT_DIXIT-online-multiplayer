import React, {
  useEffect,
  useState,
} from 'react';
import {
  useSelector,
} from 'react-redux'

import styled from 'styled-components';

const UserProfile = () => {
  const userProfile = useSelector(state=>state.currentUser.info)
  /*
    image
    email
    displayName
    w/l ratio
    amount of points gained
    amount of points given
    cards guessed right {
      id, title
    }
    cards titled successfully {
      id, title
    }
  */
  return (
    <Wrapper>
      <div>UserProfile</div>
    </Wrapper>
    );
}

export default UserProfile;

const Wrapper = styled.div`

`;