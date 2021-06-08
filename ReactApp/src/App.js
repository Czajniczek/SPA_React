import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import MainPage from "./components/mainPage"

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={MainPage} />
    </BrowserRouter>
  );
}

export default App;
