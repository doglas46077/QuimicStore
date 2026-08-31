function Comunicados() {
    return(
        <section className="mt-8">
            <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg bg-violet-500"><img src="https://api.layers.digital/v1/media/app/layers-comunicados/icon" alt="" /></span>
            <div>
            <h2 className="text-base font-bold text-[#434e5b]">Comunicados</h2>
            <p className="text-sm text-[#434e5b]">Confira as últimas atualizações</p>
            </div>
            </div>

            <div className="mt-3 flex gap-4">
                <div className="w-72 rounded-lg border border-gray-200 p-4">
                    <p className="text-sm font-bold  text-[#434e5b]">Execução do Hino Nacional Brasileiro...</p>
                    <p className="mt-2 text-sm text-gray-600">Boa tarde! Informamos que, na próxima segunda-feira, dia 17 de agosto, será realizada na praça em frente ao laboratório</p>
                    <p className="mt-3 text-xs text-gray-400">13 de agosto de 2026</p>
                </div>

                <div className="w-72 rounded-lg border border-gray-200 p-4">
                    <p className="text-sm font-bold uppercase text-[#434e5b]">Aproveitamento de estudo</p>
                    <p className="mt-2 text-sm text-gray-600">Confira as informações sobre o aproveitamento de estudos deste semestre</p>
                    <p className="mt-3 text-xs text-gray-400">11 de agosto de 2026</p>
                </div>

                <div className="w-72 rounded-lg border border-gray-200 p-4">
                    <p className="text-sm font-bold uppercase text-[#434e5b]">Cardápio de refeições</p>
                    <p className="mt-2 text-sm text-gray-600">É com grande satisfação que compartilhamos o cardápio das refeições dos Alunos!</p>
                    <p className="mt-3 text-xs text-gray-400">7 de agosto de 2026</p>
                </div>
            </div>
        </section>
    )
}

export default Comunicados