# 🧪​ QuimicStore - Back-end (API REST)

Documentação do serviço back-end do sistema **QuimicStore**, desenvolvido como **Trabalho de Conclusão de Curso (TCC).** o sistema provê uma API RESTful para gerenciamento de produtos, pedidos, usuários e pagamentos via pix estático.

## 🤖 Linguagem & Tecnologias Utilizadas

<div>
    <img
        align="left"
        alt="PHP"
        title="PHP"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg"
    />
    <img
        align="left"
        alt="Laravel"
        title="Laravel"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"
    />
    <img
        align="left"
        alt="Git"
        title="Git"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
    />
    <img
        align="left"
        alt="Git"
        title="Git"
        width="30px"
        style="padding-right: 10px;"
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg"
    />
</div>

<br>

## 📐 Arquitetura do projeto
Padrão arquitetural **MVC (Model-view-controller)** separando as responsabilidades do sistema em camadas interconectadas, onde cada papel do sistema gerencia seu próprio fluxo, evitando que o sistema não vire uma mistura de código conforme o projeto cresce, facilitando o gerenciamento, manutenção, correção de erros e demais gerenciamentos, pois cada parte tem seu próprio papel. 

## 📋 Requisitos do sistema
- **PHP:** >= 8.2
- **Composer:** >= Instalado (Versão recente)
- **Banco de dados:** >= MySQL 8.0+

## ⬇️ Instalação
### 1. Clonar o repositório

```bash =
git clone https://github.com/seu-usuario/quimicstore-backend.git
cd src/Backend
```

### 2. Instalar depedências do PHP

```bash
composer install
```

### 3. Configurar Arquivo de ambiente
- Crie uma cópia do arquivo .env.example
```bash
cp .env.example .env
```

- Ajuste as configurações do banco de dados no .env gerado
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=sua_porta
DB_DATABASE=quimicstore
DB_USERNAME=root
DB_PASSWORD=sua_senha
```
### 4. Gerar chave da aplicação e executar as migrações
```bash
php artisan key:generate
php artisan migrate
```

### 5. Iniciar servidor
```bash
php artisan serve
```
- A API estará disponível em [http://127.0.0.1:8000](http://127.0.0.1:8000) .

## 🔓 Rotas Públicas
> Não exigem autenticação prévia (sem cabeçalho `Authorization`).

| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/cadastrar-conta` | `LoginController@store` | Cadastro de novos usuários. |
| `POST` | `/login` | `LoginController@login` | Autenticação e geração do Bearer Token. |
| `POST` | `/esqueceu-senha` | `LoginController@esqueceuSenha` | Solicitação de recuperação de senha. |
| `POST` | `/resetar-senha` | `LoginController@resetarSenha` | Redefinição de senha de acesso. |
| `GET` | `/comentario/{produtoId}` | `AvaliacaoController@index` | Listar comentários e avaliações de um produto. |
| `GET` | `/categorias` | `CategoriaController@index` | Listar todas as categorias cadastradas. |
| `GET` | `/categorias/{id}` | `CategoriaController@show` | Exibir detalhes de uma categoria específica. |

---

## 🔒 Rotas Protegidas (`middleware: auth:sanctum`)
> Exigem o envio do cabeçalho `Authorization: Bearer {token}`.

### 👤 Usuários
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `GET` | `/mostrar-usuarios` | `LoginController@index` | Listar todos os usuários cadastrados. |
| `GET` | `/ver-usuario/{id}` | `LoginController@show` | Visualizar informações do perfil de um usuário. |
| `PUT` | `/atualizar-informacoes/{id}/usuario` | `LoginController@update` | Atualizar dados cadastrais de um usuário. |
| `DELETE` | `/excluir/{id}/usuario` | `LoginController@destroy` | Deletar a conta de um usuário do sistema. |

### 🧪 Produtos
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/registrar-produto` | `ProdutosController@store` | Cadastrar um novo produto no catálogo. |
| `GET` | `/mostrar-produtos` | `ProdutosController@index` | Listar todos os produtos do catálogo. |
| `GET` | `/mostrar-produto/{id}/produto` | `ProdutosController@show` | Visualizar detalhes de um produto específico. |
| `PUT` | `/atualizar-produto/{id}/produto` | `ProdutosController@update` | Editar informações de um produto existente. |
| `DELETE` | `/excluir-produto/{id}/produto` | `ProdutosController@destroy` | Deletar um produto do banco de dados. |

### 🛒 Pedidos
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/registrar-pedido` | `PedidosController@store` | Criar e registrar um novo pedido. |
| `GET` | `/mostrar-pedidos` | `PedidosController@index` | Listar todos os pedidos registrados no sistema. |
| `GET` | `/mostrar-pedido/{usuario_id}/usuario` | `PedidosController@show` | Consultar o histórico de pedidos de um usuário. |
| `PUT` | `/atualizar-pedido/{id}/pedido` | `PedidosController@update` | Atualizar itens ou informações de um pedido. |
| `POST` | `/finalizar-pedido/{id}/pedido` | `PedidosController@fecharPedido` | Encerrar/Finalizar um pedido ativo. |
| `DELETE` | `/excluir-pedido/{id}/pedido` | `PedidosController@destroy` | Cancelar e excluir um pedido. |

### 💬 Avaliações e Comentários
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/registrar-comentario/{reqProdutoID}` | `AvaliacaoController@store` | Cadastrar uma avaliação/comentário para um produto. |
| `PUT` | `/atualizar-avaliacao/{avaliacaoId}` | `AvaliacaoController@update` | Editar uma avaliação enviada anteriormente. |
| `DELETE` | `/excluir-comentario/{avaliacaoId}` | `AvaliacaoController@destroy` | Deletar uma avaliação ou comentário. |

### 🏷️ Categorias
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/registrar-categoria` | `CategoriaController@store` | Cadastrar uma nova categoria. |
| `PUT` | `/categorias/{id}/atualizar` | `CategoriaController@update` | Atualizar dados de uma categoria existente. |
| `DELETE` | `/categorias/{id}/deletar` | `CategoriaController@destroy` | Remover uma categoria do banco de dados. |

### ⏳ Lista de Espera
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/lista-espera` | `ListaEsperaController@store` | Entrar na fila de espera para um produto esgotado. |
| `GET` | `/meus-pedidos/lista-espera` | `ListaEsperaController@minhaFila` | Consultar a posição atual do usuário na fila. |
| `GET` | `/produtos/{produtoID}/lista-espera` | `ListaEsperaController@produtoIndex` | Visualizar a fila do produto (Acesso exclusivo para perfil `professor`). |
| `DELETE` | `/lista-espera/{id}` | `ListaEsperaController@destroy` | Sair/Remover entrada da fila de espera. |

### 💳 Pagamentos (Pix)
| Método | Endpoint | Controller & Ação | Descrição |
| :---: | :--- | :--- | :--- |
| `POST` | `/pagamentos/pix` | `PagamentoController@gerarPix` | Gerar código copia e cola Pix e imagem QR Code SVG Base64. |
| `PUT` | `/pagamentos/{id}/status` | `PagamentoController@aprovarPagamento` | Aprovar/Cancelar pagamento e atualizar pedido (Acesso exclusivo para perfil `professor`). |