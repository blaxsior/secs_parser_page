import { Route, Routes } from "react-router"
import Main from "./layout/Main"
import MainPage from "./page/main/MainPage"
import EditItemPage from "./page/edit_item/EditItemPage"

function App() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route index element={<MainPage />} />
        <Route path="item-to-secs" element={<EditItemPage />} />
      </Route>
    </Routes>
  )
}

export default App
