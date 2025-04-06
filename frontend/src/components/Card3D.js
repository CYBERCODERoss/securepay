import React, { useState, useRef, useEffect } from 'react';
import { Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Paper)(({ theme, elevation, isHovering, perspective, tiltStrength }) => {
  // Calculate actual elevation
  const actualElevation = elevation || 2;
  const hoverElevation = isHovering ? actualElevation + 6 : actualElevation;
  
  return {
    position: 'relative',
    transition: 'all 0.25s ease-out',
    transformStyle: 'preserve-3d',
    transform: isHovering ? 'scale(1.02)' : 'scale(1)',
    willChange: 'transform, box-shadow',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[hoverElevation],
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
      opacity: isHovering ? 1 : 0,
      transition: 'opacity 0.3s ease',
      zIndex: 2,
      pointerEvents: 'none',
      borderRadius: 'inherit'
    },
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.1) 100%)',
      opacity: isHovering ? 1 : 0,
      transition: 'opacity 0.3s ease',
      zIndex: 2,
      pointerEvents: 'none',
      borderRadius: 'inherit'
    }
  };
});

const CardContent = styled(Box)(({ theme, rotateX, rotateY, perspective, tiltStrength }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  transition: 'transform 0.15s ease-out',
  transform: `perspective(${perspective}px) rotateX(${rotateX * tiltStrength}deg) rotateY(${rotateY * tiltStrength}deg)`,
  transformStyle: 'preserve-3d',
  zIndex: 1
}));

const Card3D = ({
  children,
  elevation = 2,
  perspective = 1000, 
  tiltStrength = 3,
  disabled = false,
  hoverEffect = true,
  sx = {},
  ...props
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (disabled || !hoverEffect || !cardRef.current) return;
    
    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Convert to rotation values (-1 to 1, then scale by tilt strength)
    const rotateY = mouseX / (cardRect.width / 2);
    const rotateX = -mouseY / (cardRect.height / 2);
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (!disabled && hoverEffect) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && hoverEffect) {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
    }
  };

  // Reset rotation when component unmounts or is disabled
  useEffect(() => {
    if (disabled) {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
    }
  }, [disabled]);

  return (
    <StyledCard
      ref={cardRef}
      elevation={elevation}
      isHovering={isHovering}
      perspective={perspective}
      tiltStrength={tiltStrength}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={sx}
      {...props}
    >
      <CardContent
        rotateX={rotation.x}
        rotateY={rotation.y}
        perspective={perspective}
        tiltStrength={tiltStrength}
      >
        {children}
      </CardContent>
    </StyledCard>
  );
};

export default Card3D;