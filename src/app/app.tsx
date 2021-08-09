import React from "react";
import Hello from '@shared/hello';
import { hot } from 'react-hot-loader/root';

function App() {
  return (
    <div style={ { overflow: 'hidden' } }>
      <p>App working!</p>
      <Hello name="hungtcs" />
    </div>
  );
}

export default hot(App);
