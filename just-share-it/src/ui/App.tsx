import { Outlet } from "react-router";
// import { Navbar } from "./components/Navbar";
// import { navMenu } from "./app-constants/nav-menu";
import "./App.css";
import { Settings } from "./components/Settings";

function App() {
  return (
    <div className="App">
      {/* <div>
        <Navbar items={navMenu} />
      </div> */}
      <div>
        <Settings />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
