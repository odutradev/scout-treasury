import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Alert } from '@mui/material';
import { Lock } from '@mui/icons-material';

import PinInput from '@components/pinInput';
import useAuthStore from '@stores/auth';
import { validatePin } from '@utils/constants/pins';
import { Container, Card, LogoContainer } from './styles';

const SignIn = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handlePinComplete = async (pin: string) => {
    setLoading(true);
    setError(false);

    await new Promise(resolve => setTimeout(resolve, 300));

    const role = validatePin(pin);

    if (role) {
      login(role);
      navigate('/home');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <LogoContainer>
          <Lock sx={{ fontSize: 40, color: 'white' }} />
        </LogoContainer>

        <Typography variant="h4" fontWeight={700} textAlign="center">
          AsCaixa
        </Typography>

        <Typography variant="body1" color="text.secondary" textAlign="center">
          Digite seu PIN de 5 dígitos para acessar
        </Typography>

        <PinInput 
          onComplete={handlePinComplete}
          error={error}
          disabled={loading}
        />

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>
            PIN inválido. Tente novamente.
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default SignIn;