import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import SectionPedidoStatus from "./components/SectionPedidoStatus";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
       <Layers/>

       <SectionCatalogo/>
       
       <LoginCard/>

       <SectionPedidoStatus/>
        </div>
    </>
  )
}



export default App
