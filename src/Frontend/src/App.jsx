import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">

       <Layers/>

       <SectionCatalogo/>
       
       <LoginCard/>

       <SectionCadastro/>

       <SectionPedidoStatus/>

        </div>
    </>
  )
}



export default App
