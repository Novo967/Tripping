import React, { useState } from 'react';
import styled from 'styled-components';

// צבע כתום מאופיין של האתר
const primaryColor = '#feb47b';  // אתה יכול להחליף כאן לגוון הכתום שלך

// Overlay
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

// Form Container
const FormContainer = styled.div`
  background: #fff;
  padding: 32px 24px;
  border-radius: 16px;
  width: 340px;
  max-width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  font-family: 'Helvetica Neue', Arial, sans-serif;
`;

// Field Styling
const Field = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

// Label
const Label = styled.label`
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

// Inputs and Textarea
const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${primaryColor};
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${primaryColor};
    outline: none;
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    border-color: ${primaryColor};
    outline: none;
  }
`;

// Error Message
const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 12px;
  font-size: 13px;
  text-align: center;
`;

// Button Group
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

// Buttons
const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
  color: #fff;

  background-color: ${({ cancel }) => (cancel ? '#ccc' : primaryColor)};

  &:hover {
    background-color: ${({ cancel }) => (cancel ? '#b3b3b3' : '#e65c28')};
    transform: translateY(-2px);
  }
`;

export default function PinForm({ visible, onSave, onCancel }) {
  const [type, setType] = useState('אחר');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selected.getTime())) {
      setError('יש לבחור תאריך חוקי');
      return;
    }

    if (selected < today) {
      setError('התאריך חייב להיות היום או בעתיד');
      return;
    }

    setError('');
    onSave({ type, date, message });
  };

  if (!visible) return null;

  return (
    <Overlay>
      <FormContainer>
        <Field>
          <Label>מהות הסיכה</Label>
          <Select value={type} onChange={e => setType(e.target.value)}>
            <option value="מסיבה">מסיבה</option>
            <option value="אטרקציה">אטרקציה</option>
            <option value="טיול">טיול</option>
            <option value="אחר">אחר</option>
          </Select>
        </Field>

        <Field>
          <Label>תאריך האירוע</Label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </Field>

        <Field>
          <Label>הודעה</Label>
          <Textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} />
        </Field>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button cancel onClick={onCancel}>ביטול</Button>
          <Button onClick={handleSubmit}>שמור</Button>
        </ButtonGroup>
      </FormContainer>
    </Overlay>
  );
}
