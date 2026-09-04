import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import Layers from "./components/Layers";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCarrinho from "./components/SectionCarrinho";
import SectionCadastro from "./components/SectionCadastro";

function App() {
    return (
        <>
        <div className="bg-olive-50 font-bold">
      {/*
       <Layers/>
*/}
       <SectionCatalogo/>
       
       <LoginCard/>

       <SectionCadastro/>

       <SectionPedidoStatus/>

       <SectionCarrinho/>
        </div>
    </>
  )
}



export default App
