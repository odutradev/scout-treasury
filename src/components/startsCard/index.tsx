import { CardContent, Typography, Box, Tooltip } from '@mui/material';

import { Container } from './styles';

import type { StatsCardProps } from './types';

const StatsCard = ({ title, value, valueColor, icon: Icon, iconColor, tooltipContent }: StatsCardProps) => {
  const cardContent = (
    <Container>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" component="div" color={valueColor}>
              {value}
            </Typography>
          </Box>
          <Icon color={iconColor} />
        </Box>
      </CardContent>
    </Container>
  );

  if (tooltipContent) {
    return (
      <Tooltip 
        title={tooltipContent} 
        arrow 
        placement="bottom"
        enterDelay={300}
        leaveDelay={200}
      >
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};

export default StatsCard;