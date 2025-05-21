import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components for form
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const Field = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 4px;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => (props.cancel ? '#ccc' : '#4caf50')};
  color: #fff;
`;

/**
 * Props:
 * visible: boolean
 * onSave: ({ type, date, message }) => void
 * onCancel: () => void
 */
export default function PinForm({ visible, onSave, onCancel }) {
  const [type, setType] = useState('אחר');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // date validation: must be today or future
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
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

        {error && <div style={{ color: 'red', marginBottom: '8px' }}>{error}</div>}

        <ButtonGroup>
          <Button cancel onClick={onCancel}>ביטול</Button>
          <Button onClick={handleSubmit}>שמור</Button>
        </ButtonGroup>
      </FormContainer>
    </Overlay>
  );
}
