import { useState } from 'react';

import Animation from 'common/components/Animation';

import imageCompy from 'assets/images/compy.png';

function Playground() {
  const [test, setTest] = useState(false);

  return (
    <div style={{ textAlign: 'center' }}>
      <Animation>{test && <img src={imageCompy} alt="test" />}</Animation>
    </div>
  );
}

export default Playground;
