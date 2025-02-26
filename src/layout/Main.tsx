import Header from "./header/Header";
import Navigation from "./header/nav/Navigation";

type MainProps = {
    children?: React.ReactNode;
}

function Main({ children }: MainProps) {
    return <div className="w-full">
        <Header />
        <Navigation />
        <main className="p-2">
            {children}
        </main>
        {/* <Footer /> */}
    </div>
}

export default Main;