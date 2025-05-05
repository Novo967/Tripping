// Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

// סגנונות בסיסיים
const StyledButton = styled.button`
  padding: 8px 20px;
  border-radius: 2px;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 18px;

  ${({ styleType }) =>
    styleType === 'btn--primary' &&
    css`
      background-color: #ffffff;
      color: #242424;
      border: 1px solid #ffffff;
    `}

  ${({ styleType }) =>
    styleType === 'btn--outline' &&
    css`
      background-color: transparent;
      color: #ffffff;
      border: 1px solid #ffffff;
      transition: all 0.3s ease-out;
    `}

  ${({ size }) =>
    size === 'btn--large' &&
    css`
      padding: 12px 26px;
      font-size: 20px;
    `}

  &:hover {
    background: #ffffff;
    color: #242424;
    transition: 250ms;
  }
`;

const MobileWrapper = styled(Link)`
  text-decoration: none;
`;

export const Button = ({ children, type, onclick, buttonStyle, buttonSize }) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <MobileWrapper to='/sign-up'>
      <StyledButton
        type={type}
        onClick={onclick}
        styleType={checkButtonStyle}
        size={checkButtonSize}
      >
        {children}
      </StyledButton>
    </MobileWrapper>
  );
};
