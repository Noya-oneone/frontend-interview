# useHover

```javascript
import { useState, useCallback } from 'react';

function useHover() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const hoverProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return [isHovered, hoverProps];
}

export default useHover;
```