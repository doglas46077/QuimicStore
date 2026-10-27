import LoginCard from "./components/LoginCard"
import SectionCatalogo from "./components/SectionCatalogo";
import SectionPedidoStatus from "./components/SectionPedidoStatus";
import SectionCadastro from "./components/SectionCadastro";
import { Routes, Route } from "react-router-dom";
import SectionCarrinho from "./components/PrincipalCarrinho";
import SectionPerfil from "./components/SectionPerfil";
import SectionPedidoDetalhes from "./components/SectionPedidoDetalhes";
import ProtecaoRotas from "./components/ProtecaoRotas";
import TelaAdm from "./components/TelaAdm";
import ProductPage from "./components/ProductPage";
import SectionResumoCompra from "./components/SectionResumo";
import PagamentoPix from "./components/PaginaPagamento";
import SectionStatus from "./components/PagamentoConfirmado";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-olive-50 font-bold">
       <Routes>
      <Route path="/" element={<SectionCadastro />} />
      <Route path="/login" element={<LoginCard/>}/>
      <Route path="/catalogo" element={<ProtecaoRotas><SectionCatalogo/>  </ProtecaoRotas>}/>
      <Route path="/produto/:id" element={<ProtecaoRotas><ProductPage/></ProtecaoRotas>}/>
      <Route path="/carrinho" element={<ProtecaoRotas><SectionCarrinho/></ProtecaoRotas>}/>
      <Route path="/pedidos" element={<ProtecaoRotas><SectionPedidoStatus/></ProtecaoRotas> }/>
      <Route path="/perfil" element={<ProtecaoRotas><SectionPerfil/></ProtecaoRotas> }/>
      <Route path="/pedidoDetalhe" element={<ProtecaoRotas><SectionPedidoDetalhes/></ProtecaoRotas> }/>
      <Route path="/pedidoStatus" element={<ProtecaoRotas><SectionPedidoStatus/></ProtecaoRotas> }/>
      <Route path="/adm" element={<ProtecaoRotas><TelaAdm/></ProtecaoRotas>}/>
      <Route path="/resumo" element={<ProtecaoRotas><SectionResumoCompra/></ProtecaoRotas>}/>
      <Route path="/pagamento/:id" element={<ProtecaoRotas><PagamentoPix/></ProtecaoRotas>}/>
      <Route path="/pedido-realizado/:id" element={<ProtecaoRotas><SectionStatus/></ProtecaoRotas>}/>
        </Routes>
      
     </div>
    </>
  )
}



export default App
