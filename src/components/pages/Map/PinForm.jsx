import React, { useState } from 'react';
import styled from 'styled-components';

// צבע כתום מאופיין של האתר
const primaryColor = '#feb47b';  
const hoverColor = '#ff8c42'; // כתום חזק יותר
const errorColor = '#e63946'; // צבע אדום יפה

// Overlay
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

// Form Container
const FormContainer = styled.div`
  background: #fff;
  padding: 40px 30px;
  border-radius: 20px;
  width: 380px;
  max-width: 90%;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Field Styling
const Field = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

// Label
const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #333;
`;

// Inputs, Select, Textarea
const sharedStyles = `
  padding: 12px;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  font-size: 14px;
  color: #000;  // הוספה של צבע טקסט שחור
  background-color: #fafafa;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 5px ${primaryColor};
    outline: none;
  }
`;


const Input = styled.input`${sharedStyles}`;
const Select = styled.select`${sharedStyles}`;
const Textarea = styled.textarea`
  ${sharedStyles}
  resize: vertical;
`;

// Error Message
const ErrorMessage = styled.div`
  color: ${errorColor};
  margin-bottom: 16px;
  font-size: 13px;
  text-align: center;
`;

// Button Group
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
`;

// Buttons
const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
  color: #fff;

  background-color: ${({ cancel }) => (cancel ? '#ccc' : primaryColor)};

  &:hover {
    background-color: ${({ cancel }) => (cancel ? '#b3b3b3' : hoverColor)};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
