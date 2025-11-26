import { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Container, Input, ToggleButton } from './styles';

import type { PinInputProps } from './types';

const PinInput = ({ onComplete, error, disabled }: PinInputProps) => {
  const [pin, setPin] = useState<string[]>(Array(5).fill(''));
  const [showPin, setShowPin] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
      setPin(Array(5).fill(''));
      inputRefs.current[0]?.focus();
    }
  }, [error]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every(digit => digit !== '') && newPin.length === 5) {
      onComplete(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = [...pin];
    pastedData.split('').forEach((digit, index) => {
      if (index < 5) newPin[index] = digit;
    });
    setPin(newPin);

    const nextEmptyIndex = newPin.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    if (newPin.every(digit => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  return (
    <Container>
      {pin.map((digit, index) => (
        <Input
          key={index}
          inputRef={el => inputRefs.current[index] = el}
          type={showPin ? 'text' : 'password'}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          error={error}
          inputProps={{ maxLength: 1 }}
          inputMode="numeric"
        />
      ))}
      <ToggleButton>
        <IconButton 
          onClick={() => setShowPin(!showPin)}
          disabled={disabled}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          {showPin ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </ToggleButton>
    </Container>
  );
};

export default PinInput;