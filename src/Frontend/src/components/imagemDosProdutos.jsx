import { useEffect, useRef } from "react";
import { resolverImagem } from "./CardCatalogo";

const MAXIMO_IMAGENS = 6;
const TAMANHO_MAXIMO = 2 * 1024 * 1024;
const TIPOS = ["image/png", "image/jpeg", "image/webp"];

// Busca as imagens que já estão salvas no produto
export function imagensDoProduto(produto) {
    if (produto.imagens?.length > 0) {
        return produto.imagens.map((img) => ({
            chave: `existente-${img.id}`,
            tipo: "existente",
            id: img.id,
            url: resolverImagem(img.caminho),
        }));
    }

    if (produto.imagem) {
        return [{
            chave: "existente-capa",
            tipo: "existente",
            id: null,
            url: resolverImagem(produto.imagem),
        }];
    }

    return [];
}

export default function CampoImagens({ value, onChange, onErro }) {
    const { imagens, removidas } = value;
    const inputRef = useRef(null);

    // Limpa as imagens temporárias da memória
    useEffect(() => {
        return () => {
            imagens.forEach((img) => {
                if (img.tipo === "nova") {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, []);

    // Adiciona novas imagens
    function adicionar(arquivos) {
        onErro?.("");

        const novas = [];

        for (const arquivo of arquivos) {
            if (!TIPOS.includes(arquivo.type)) {
                onErro?.("Use imagens PNG, JPG ou WEBP.");
                continue;
            }

            if (arquivo.size > TAMANHO_MAXIMO) {
                onErro?.("Cada imagem pode ter no máximo 2 MB.");
                continue;
            }

            if (imagens.length + novas.length >= MAXIMO_IMAGENS) {
                onErro?.("Você pode adicionar no máximo 6 imagens.");
                break;
            }

            novas.push({
                chave: `nova-${Date.now()}-${novas.length}`,
                tipo: "nova",
                arquivo,
                url: URL.createObjectURL(arquivo),
            });
        }

        if (novas.length > 0) {
            onChange({
                imagens: [...imagens, ...novas],
                removidas,
            });
        }
    }

    // Remove uma imagem
    function remover(item) {
        if (item.tipo === "nova") {
            URL.revokeObjectURL(item.url);
        }

        const novasImagens = imagens.filter(
            (img) => img.chave !== item.chave
        );

        const novasRemovidas =
            item.tipo === "existente" && item.id !== null
                ? [...removidas, item.id]
                : removidas;

        onChange({
            imagens: novasImagens,
            removidas: novasRemovidas,
        });
    }

    // Troca a posição das imagens
    function mover(indice, direcao) {
        const copia = [...imagens];
        const [imagem] = copia.splice(indice, 1);

        copia.splice(indice + direcao, 0, imagem);

        onChange({ imagens: copia, removidas });
    }

    // Define uma imagem como capa
    function tornarCapa(indice) {
        mover(indice, -indice);
    }

    const cheio = imagens.length >= MAXIMO_IMAGENS;

    const estiloBotao =
        "flex-1 py-1 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30";

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
                Imagens do produto
            </label>

            {imagens.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-3">
                    {imagens.map((item, indice) => (
                        <div
                            key={item.chave}
                            className="relative overflow-hidden rounded-xl border bg-white"
                        >
                            <img
                                src={item.url}
                                alt=""
                                className="h-24 w-full object-cover"
                            />

                            {indice === 0 && (
                                <span className="absolute left-1 top-1 rounded-full bg-emerald-950 px-2 py-1 text-[10px] text-white">
                                    Capa
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => remover(item)}
                                className="absolute right-1 top-1 rounded-full bg-white px-2 text-red-600"
                            >
                                ×
                            </button>

                            <div className="flex divide-x border-t">
                                <button
                                    type="button"
                                    onClick={() => mover(indice, -1)}
                                    disabled={indice === 0}
                                    className={estiloBotao}
                                >
                                    ‹
                                </button>

                                <button
                                    type="button"
                                    onClick={() => tornarCapa(indice)}
                                    disabled={indice === 0}
                                    className={estiloBotao}
                                >
                                    Capa
                                </button>

                                <button
                                    type="button"
                                    onClick={() => mover(indice, 1)}
                                    disabled={indice === imagens.length - 1}
                                    className={estiloBotao}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    adicionar(Array.from(e.dataTransfer.files));
                }}
                className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-700 bg-emerald-50 px-4 py-5 text-center"
            >
                <p className="text-sm font-semibold text-emerald-950">
                    {cheio
                        ? "Limite de imagens atingido"
                        : "Selecione as imagens do produto"}
                </p>

                <p className="text-xs text-slate-500">
                    PNG, JPG ou WEBP • Máximo 2 MB cada
                </p>

                <p className="text-xs text-slate-500">
                    {imagens.length}/{MAXIMO_IMAGENS} imagens
                </p>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={cheio}
                    className="mt-3 rounded-lg bg-emerald-950 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                    Escolher imagens
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        adicionar(Array.from(e.target.files));
                        e.target.value = "";
                    }}
                />
            </div>
        </div>
    );
}