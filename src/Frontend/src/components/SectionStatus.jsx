import HeaderLogin from "./Header/HeaderLogin";
import FooterCatalogo from "./FooterCatalogo";
import { ClockCircle } from 'reicon-react';
import { CheckCircle } from 'reicon-react';

export default function SectionStatus() {
    return (
        <main className="flex flex-col gap-7 min-h-screen bg-olive-50">
            <HeaderLogin />
            
            
            <div className="flex flex-col gap-3 mt-0 justify-center items-center w-full h-135 ">
                <div className="flex justify-center w-[90%] h-[90%] bg-emerald-50 shadow rounded-2xl">
                    <CheckCircle size={100} />
                </div>

                <div className="flex justify-center items-center gap-3 w-[90%] h-10">
                    <p>Status:</p>
                    <div className="flex gap-3 text-orange-400">
                        <ClockCircle size={24} />
                        <p>Aguardando confirmação</p>
                    </div>
                </div>

                <div className="flex flex-col gap-5 w-[90%]">
                    
                    <div className="flex justify-center items-center w-full h-10 bg-pink-500 rounded-lg">
                        <div>

                            <p>Não sei oq</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center w-full h-10 bg-pink-500 rounded-lg">
                        <div>

                            <p>Não sei oq</p>
                        </div>
                    </div>
                </div>
            </div>


            <FooterCatalogo />
        </main>
    );
}