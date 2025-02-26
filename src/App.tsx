import Main from "./layout/Main"
import MainPage from "./page/main/MainPage"
import EditItemPage from "./page/edit_item/EditItemPage"
import Route from "./component/router/Route"

function App() {
  return (
    <Main>
      <Route path="/" element={<MainPage />} />
      <Route path="/item-to-secs" element={<EditItemPage />} />
    </Main>

  )
}

export default App
