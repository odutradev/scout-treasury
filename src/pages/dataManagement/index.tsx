import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  CloudUpload,
  CloudDownload,
  DeleteForever,
  ArrowBack,
  Warning,
  Storage,
  Assessment,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

import Loading from '@components/loading';
import Errors from '@components/errors';
import {
  exportProject,
  importProject,
  deleteProject,
  getProjectStats,
  exportCollection,
  importCollection,
  deleteCollection
} from '@actions/dataManagement';
import useMountOnce from '@hooks/useMountOnce';
import useAction from '@hooks/useAction';

import {
  Container,
  HeaderContainer,
  StatsContainer,
  ActionCard,
  IconContainer,
  FileInputLabel
} from './styles';

import type { DataManagementProps, ConfirmDialogProps } from './types';
import type { ProjectStats } from '@actions/dataManagement/types';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'warning'
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
    <DialogTitle>
      <Box display="flex" alignItems="center" gap={1}>
        <Warning color={severity} />
        <Typography variant="h6">{title}</Typography>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Alert severity={severity} sx={{ mb: 2 }}>
        <AlertTitle>Atenção</AlertTitle>
        {message}
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="inherit">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} variant="contained" color={severity}>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

const DataManagement = ({}: DataManagementProps) => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
    severity?: 'warning' | 'error' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {},
    severity: 'warning'
  });
  const [selectedCollection, setSelectedCollection] = useState<string>('transaction-entries');

  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const collectionFileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProjectStats();

      if ('error' in result) {
        setError(result.error);
        return;
      }

      setStats(result);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useMountOnce(() => {
    loadStats();
  });

  const handleExportProject = async () => {
    await useAction({
      action: async () => {
        const result = await exportProject('json');

        if ('error' in result) {
          throw new Error(result.error);
        }

        const blob = new Blob([result], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'projeto-completo.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      },
      toastMessages: {
        pending: 'Exportando projeto...',
        success: 'Projeto exportado com sucesso!',
        error: 'Erro ao exportar projeto'
      }
    });
  };

  const handleExportCollection = async () => {
    await useAction({
      action: async () => {
        const result = await exportCollection(selectedCollection, 'json');

        if ('error' in result) {
          throw new Error(result.error);
        }

        const blob = new Blob([result], {
          type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedCollection}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      },
      toastMessages: {
        pending: 'Exportando coleção...',
        success: 'Coleção exportada com sucesso!',
        error: 'Erro ao exportar coleção'
      }
    });
  };

  const handleImportProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await useAction({
      action: async () => {
        const text = await file.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Arquivo JSON inválido');
        }

        const result = await importProject(data);

        if ('error' in result) {
          throw new Error(result.error);
        }

        await loadStats();
        return result;
      },
      callback: () => {
        if (projectFileInputRef.current) {
          projectFileInputRef.current.value = '';
        }
      },
      toastMessages: {
        pending: 'Importando projeto...',
        success: 'Projeto importado com sucesso!',
        error: 'Erro ao importar projeto'
      }
    });
  };

  const handleImportCollection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await useAction({
      action: async () => {
        const text = await file.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Arquivo JSON inválido');
        }

        if (!Array.isArray(data)) {
          throw new Error('O arquivo deve conter um array de objetos');
        }

        const result = await importCollection(selectedCollection, data);

        if ('error' in result) {
          throw new Error(result.error);
        }

        await loadStats();
        return result;
      },
      callback: () => {
        if (collectionFileInputRef.current) {
          collectionFileInputRef.current.value = '';
        }
      },
      toastMessages: {
        pending: 'Importando coleção...',
        success: 'Coleção importada com sucesso!',
        error: 'Erro ao importar coleção'
      }
    });
  };

  const handleDeleteProject = async () => {
    setConfirmDialog({ ...confirmDialog, open: false });

    await useAction({
      action: async () => {
        const result = await deleteProject();

        if ('error' in result) {
          throw new Error(result.error);
        }

        await loadStats();
        return result;
      },
      toastMessages: {
        pending: 'Deletando todos os dados...',
        success: 'Todos os dados foram deletados!',
        error: 'Erro ao deletar dados'
      }
    });
  };

  const handleDeleteCollection = async () => {
    setConfirmDialog({ ...confirmDialog, open: false });

    await useAction({
      action: async () => {
        const result = await deleteCollection(selectedCollection);

        if ('error' in result) {
          throw new Error(result.error);
        }

        await loadStats();
        return result;
      },
      toastMessages: {
        pending: 'Deletando coleção...',
        success: 'Coleção deletada com sucesso!',
        error: 'Erro ao deletar coleção'
      }
    });
  };

  const openDeleteProjectDialog = () => {
    setConfirmDialog({
      open: true,
      title: 'Deletar Todos os Dados',
      message: 'Esta ação é IRREVERSÍVEL! Todos os dados do projeto serão permanentemente deletados. Tem certeza?',
      action: handleDeleteProject,
      severity: 'error'
    });
  };

  const openDeleteCollectionDialog = () => {
    setConfirmDialog({
      open: true,
      title: 'Deletar Coleção',
      message: `Esta ação deletará todos os dados da coleção "${selectedCollection}". Tem certeza?`,
      action: handleDeleteCollection,
      severity: 'error'
    });
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return <Loading message="Carregando estatísticas" />;
  }

  if (error) {
    return <Errors title="Erro" message={error} />;
  }

  const collections = [
    { value: 'transaction-entries', label: 'Entradas' },
    { value: 'transaction-exits', label: 'Saídas' }
  ];

  return (
    <Container>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Gerenciamento de Dados
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Exportar, importar e gerenciar dados do projeto
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
        >
          Voltar
        </Button>
      </HeaderContainer>

      <StatsContainer elevation={2}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Storage color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Estatísticas do Projeto
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total de Transações
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Assessment color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  {stats?.totalTransactions || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Entradas
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp color="success" />
                <Typography variant="h5" fontWeight={600} color="success.main">
                  {stats?.totalEntries || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Saídas
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingDown color="error" />
                <Typography variant="h5" fontWeight={600} color="error.main">
                  {stats?.totalExits || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Coleções
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Storage color="primary" />
                <Typography variant="h5" fontWeight={600}>
                  {stats?.collectionsCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </StatsContainer>

      <Typography variant="h6" fontWeight={600} mb={2}>
        Ações Disponíveis
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard>
            <IconContainer sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CloudDownload fontSize="large" />
            </IconContainer>
            <Typography variant="h6" fontWeight={600}>
              Exportar Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Baixe todos os dados do projeto em formato JSON
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Button
              variant="contained"
              color="success"
              startIcon={<CloudDownload />}
              onClick={handleExportProject}
              fullWidth
            >
              Exportar Projeto Completo
            </Button>
          </ActionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard>
            <IconContainer sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CloudUpload fontSize="large" />
            </IconContainer>
            <Typography variant="h6" fontWeight={600}>
              Importar Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Importe dados de múltiplas coleções de um arquivo JSON
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Alert severity="info" sx={{ mb: 1 }}>
              O arquivo deve conter um objeto com as coleções
            </Alert>
            <input
              ref={projectFileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportProject}
              style={{ display: 'none' }}
              id="import-project-file"
            />
            <FileInputLabel
              htmlFor="import-project-file"
              style={{
                backgroundColor: '#0499C8',
                color: 'white'
              }}
            >
              <CloudUpload style={{ marginRight: '8px' }} />
              Selecionar Arquivo do Projeto
            </FileInputLabel>
          </ActionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard>
            <IconContainer sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <Storage fontSize="large" />
            </IconContainer>
            <Typography variant="h6" fontWeight={600}>
              Exportar Coleção
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Exporte apenas uma coleção específica em formato JSON
            </Typography>
            <Divider sx={{ my: 1 }} />
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Coleção</InputLabel>
              <Select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                label="Coleção"
              >
                {collections.map((col) => (
                  <MenuItem key={col.value} value={col.value}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="warning"
              startIcon={<CloudDownload />}
              onClick={handleExportCollection}
              fullWidth
            >
              Exportar Coleção
            </Button>
          </ActionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ActionCard>
            <IconContainer sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CloudUpload fontSize="large" />
            </IconContainer>
            <Typography variant="h6" fontWeight={600}>
              Importar Coleção
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Importe dados para uma coleção específica
            </Typography>
            <Divider sx={{ my: 1 }} />
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Coleção</InputLabel>
              <Select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                label="Coleção"
              >
                {collections.map((col) => (
                  <MenuItem key={col.value} value={col.value}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Alert severity="info" sx={{ mb: 1 }}>
              O arquivo deve conter um array de objetos
            </Alert>
            <input
              ref={collectionFileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportCollection}
              style={{ display: 'none' }}
              id="import-collection-file"
            />
            <FileInputLabel
              htmlFor="import-collection-file"
              style={{
                backgroundColor: '#0288d1',
                color: 'white'
              }}
            >
              <CloudUpload style={{ marginRight: '8px' }} />
              Selecionar Arquivo da Coleção
            </FileInputLabel>
          </ActionCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ActionCard>
            <IconContainer sx={{ bgcolor: 'error.main', color: 'white' }}>
              <DeleteForever fontSize="large" />
            </IconContainer>
            <Typography variant="h6" fontWeight={600}>
              Deletar Dados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delete uma coleção específica ou todos os dados do projeto
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Alert severity="error" sx={{ mb: 1 }}>
              <AlertTitle>Atenção</AlertTitle>
              Esta ação é permanente e irreversível!
            </Alert>
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Coleção</InputLabel>
              <Select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                label="Coleção"
              >
                {collections.map((col) => (
                  <MenuItem key={col.value} value={col.value}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForever />}
                onClick={openDeleteCollectionDialog}
                fullWidth
              >
                Deletar Coleção
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteForever />}
                onClick={openDeleteProjectDialog}
                fullWidth
              >
                Deletar Projeto Completo
              </Button>
            </Box>
          </ActionCard>
        </Grid>
      </Grid>

      <Box mt={3} p={2} bgcolor="background.paper" borderRadius={2}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          <strong>Dica:</strong> Sempre faça backup dos seus dados antes de realizar operações de importação ou exclusão.
        </Typography>
      </Box>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        confirmText="Sim, continuar"
        cancelText="Cancelar"
        severity={confirmDialog.severity}
      />
    </Container>
  );
};

export default DataManagement;