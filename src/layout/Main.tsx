import { Outlet } from "react-router";
import Header from "./header/Header";
import Navigation from "./header/nav/Navigation";

function Main() {
    return <div className="w-full">
        <Header />
        <Navigation />
        <main className="p-2">
            <Outlet/>
        </main>
        {/* <Footer /> */}
    </div>
}

export default Main;