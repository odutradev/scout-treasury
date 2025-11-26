import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import { AccountBalance, Logout, Visibility, Edit, Storage } from '@mui/icons-material';

import useAuthStore from '@stores/auth';
import { Container, Card, ButtonContainer, RoleBadge } from './styles';

const Home = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuthStore();

  const handleNavigateCashManagement = () => {
    navigate('/cash-management');
  };

  const handleNavigateDataManagement = () => {
    navigate('/data-management');
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getRoleLabel = () => {
    return isAdmin() ? 'Administrador' : 'Visualizador';
  };

  const getRoleDescription = () => {
    return isAdmin() 
      ? 'Você tem acesso completo ao sistema'
      : 'Você pode visualizar transações';
  };

  return (
    <Container>
      <Card>
        <AccountBalance sx={{ fontSize: 64, color: 'primary.main' }} />
        
        <Typography variant="h4" fontWeight={700} textAlign="center">
          AsCaixa
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <RoleBadge>
            {getRoleLabel()}
          </RoleBadge>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {getRoleDescription()}
          </Typography>
        </Box>

        <ButtonContainer>
          <Button
            variant="contained"
            size="large"
            startIcon={isAdmin() ? <Edit /> : <Visibility />}
            onClick={handleNavigateCashManagement}
            fullWidth
          >
            Acessar Caixa
          </Button>

          {isAdmin() && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<Storage />}
              onClick={handleNavigateDataManagement}
              color="primary"
              fullWidth
            >
              Gerenciar Dados
            </Button>
          )}

          <Button
            variant="outlined"
            size="large"
            startIcon={<Logout />}
            onClick={handleLogout}
            color="error"
            fullWidth
          >
            Sair
          </Button>
        </ButtonContainer>
      </Card>
    </Container>
  );
};

export default Home;