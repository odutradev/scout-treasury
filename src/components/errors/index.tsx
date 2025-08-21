import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Container, float, floatingIcons} from './styles';

import type { ErrorProps } from './types';

const Errors = ({ message = 'Algo deu errado', title = 'Oops!' }: ErrorProps) => {
  const handleToHome = () => navigate('/');
  const navigate = useNavigate();

  return (
    <Container>
      {floatingIcons.map((icon, idx) => (
        <Box
          key={idx}
          sx={{
            position: 'absolute',
            top: icon.top,
            right: icon.right,
            bottom: icon.bottom,
            left: icon.left,
            opacity: 0.1,
            fontSize: icon.size,
            zIndex: 0,
            animation: `${float} 3.5s ease-in-out ${icon.delay} infinite`,
          }}
        >
          <CancelPresentationIcon fontSize="inherit" />
        </Box>
      ))}

      <Typography variant="h1" sx={{ mt: 2, fontWeight: 900, position: 'relative', zIndex: 1 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
        {message}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleToHome} sx={{ position: 'relative', zIndex: 1 }}>
        Voltar para a Página Inicial
      </Button>
    </Container>
  );
};

export default Errors;