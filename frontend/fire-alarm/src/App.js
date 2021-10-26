import './App.css';
import { render } from 'react-dom';
import Logo from './components/Logo'
import Canvas from './components/Canvas'


function App() {
  return (
    <div className='container'>
      <Logo/>
      <hr />
      <Canvas/>
      <hr />
      <pre>asd</pre>
    </div>
  );
}

export default App;
