import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

import { Container, PinDigit } from './styles';

import type { PinInputProps } from './types';

const PinInput = ({ onComplete, error = false, disabled = false }: PinInputProps) => {
  const [values, setValues] = useState<string[]>(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
      setValues(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [error]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v !== '') && newValues.join('').length === 5) {
      onComplete(newValues.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newValues = [...values];
    pastedData.split('').forEach((char, i) => {
      if (i < 5) newValues[i] = char;
    });
    
    setValues(newValues);

    const nextEmptyIndex = newValues.findIndex(v => v === '');
    const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    if (newValues.every(v => v !== '')) {
      onComplete(newValues.join(''));
    }
  };

  return (
    <Container>
      {values.map((value, index) => (
        <PinDigit
          key={index}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          inputRef={(el) => { inputRefs.current[index] = el; }}
          inputProps={{
            maxLength: 1,
            inputMode: 'numeric',
            pattern: '[0-9]*',
            autoComplete: 'off'
          }}
          disabled={disabled}
          error={error}
          autoFocus={index === 0}
        />
      ))}
    </Container>
  );
};

export default PinInput;