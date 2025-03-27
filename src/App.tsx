import { useState } from 'react'
import Header from './components/Header'
import Produtos from './containers/Produtos'
import { GlobalStyle } from './styles'
import { Provider } from 'react-redux'
import { store, RootState } from './store'

import { useDispatch, useSelector } from 'react-redux'
import { adicionar } from './store/reducers/carrinho'
import { useGetProdutosQuery } from './services/api'

export type Produto = {
  id: number
  nome: string
  preco: number
  imagem: string
}

function App() {
  const { data: produtos = [], isLoading, error } = useGetProdutosQuery()
  const [favoritos, setFavoritos] = useState<Produto[]>([])
  const dispatch = useDispatch()

  const itensNoCarrinho = useSelector(
    (state: RootState) => state.carrinho.itens
  )

  function favoritar(produto: Produto) {
    if (favoritos.find((p) => p.id === produto.id)) {
      setFavoritos(favoritos.filter((p) => p.id !== produto.id))
    } else {
      setFavoritos([...favoritos, produto])
    }
  }

  function adicionarAoCarrinho(produto: Produto) {
    dispatch(adicionar(produto))
  }

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar produtos</p>

  return (
    <Provider store={store}>
      <GlobalStyle />
      <div className="container">
        <Header favoritos={favoritos} itensNoCarrinho={itensNoCarrinho} />
        <Produtos
          produtos={produtos}
          favoritos={favoritos}
          favoritar={favoritar}
          adicionarAoCarrinho={adicionarAoCarrinho}
        />
      </div>
    </Provider>
  )
}

export default App
