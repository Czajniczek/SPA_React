import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'
import SearchBar from "./components/searchBar"
import BooksPage from "./components/booksPage"
import ClientsPage from "./components/clientsPage"
import OrdersPage from "./components/ordersPage"
import BookEdit from "./components/bookEdit"

function App() {
  return (
    <div>
      <div>
        <BrowserRouter>
          <div>
            <SearchBar />
          </div>
          <Route exact path="/" component={BooksPage} />
          <Route exact path="/Clients" component={ClientsPage} />
          <Route exact path="/Orders" component={OrdersPage} />
          <Route path="/BookEdit"
            render={(props) => <BookEdit {...props} />} />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
