// Button.jsx
import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

// סגנונות בסיסיים
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  padding: 12px 28px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: none;
  text-align: center;
  white-space: nowrap;

  ${({ size }) =>
    size === 'btn--large' &&
    css`
      padding: 14px 36px;
      font-size: 20px;
    `}

  ${({ buttonStyle }) =>
    buttonStyle === 'btn--primary' &&
    css`
      background: #feb47b;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

      &:hover {
        background: #feb47b;
        transform: translateY(-2px);
      }
    `}

  ${({ buttonStyle }) =>
    buttonStyle === 'btn--outline' &&
    css`
      background: transparent;
      border: 2px solid #fff;
      color: #fff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
    `}

    i {
    margin-left: 8px;
    display: inline-block;
  }
`;

const ButtonWrapper = styled(Link)`
  text-decoration: none;
`;

export const Button = ({ children, type, onclick, buttonStyle, buttonSize, to }) => {
  const validStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const validSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const handleClick = (e) => {
    if (onclick) onclick(e);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // גלילה לראש הדף
  };

  return (
    <ButtonWrapper to={to} onClick={handleClick}>
      <StyledButton
        type={type}
        buttonStyle={validStyle}
        size={validSize}
      >
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};