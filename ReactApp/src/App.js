//#region Imports
import { BrowserRouter, Route } from 'react-router-dom'
import SearchBar from "./components/searchBar"
import MainPage from "./components/mainPage"
import ClientsPage from "./components/clientsPage"
import OrdersPage from "./components/ordersPage"
// import ClientEdit from "./components/clientEdit"
// import BookAdd from "./components/bookAdd"
// import BookEdit from "./components/bookEdit"
//#endregion Imports

//#region Main function
function App() {
  return (
    <div>
      <BrowserRouter>
        <SearchBar />
        <Route exact path="/" component={MainPage} />
        <Route exact path="/Clients" component={ClientsPage} />
        <Route exact path="/Orders" component={OrdersPage} />
        {/* <Route path="/BookEdit" render={(props) => <BookEdit {...props} />} />
          <Route path="/BookAdd" render={(props) => <BookAdd {...props} />} />
          <Route path="/ClientEdit" render={(props) => <ClientEdit {...props} />} /> */}
      </BrowserRouter>
    </div>
  )
}
//#endregion Main function

export default App
