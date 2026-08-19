const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Base de dados mockada com os produtos da Clean Skin
let products = [
  {
    id: 1,
    name: "Sérum Facial Vitamina C Glow",
    category: "seruns",
    categoryName: "Sérum",
    price: 291.90
  },
  {
    id: 2,
    name: "Sérum Facial Fat Water",
    category: "seruns",
    categoryName: "Sérum",
    price: 129.90
  },
  {
    id: 3,
    name: "Hidratante Instant Reset",
    category: "hidratantes",
    categoryName: "Hidratante",
    price: 377.00
  },
  {
    id: 4,
    name: "Hidratante Facial Hydration Face",
    category: "hidratantes",
    categoryName: "Hidratante",
    price: 259.00
  },
  {
    id: 5,
    name: "Protetor Solar Facial FPS 30",
    category: "protecao",
    categoryName: "Proteção Solar",
    price: 313.00
  },
  {
    id: 6,
    name: "Protetor Solar Facial Hydra Vizor",
    category: "protecao",
    categoryName: "Proteção Solar",
    price: 313.00
  },
  {
    id: 7,
    name: "Gel de Limpeza Cherry Dub Cleanser",
    category: "limpeza",
    categoryName: "Limpeza",
    price: 280.00
  },
  {
    id: 8,
    name: "Gel de Limpeza Remove-it-All",
    category: "limpeza",
    categoryName: "Limpeza",
    price: 118.00
  }
];

// 1. GET /api/products - Lista todos os produtos ou filtra por categoria/busca
app.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'todos') {
    result = result.filter(p => p.category === category.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.categoryName.toLowerCase().includes(term)
    );
  }

  res.json({
    total: result.length,
    data: result
  });
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à nossa API de Produtos!' });
});


// 2. GET /api/products - Busca os produtos 
app.get('/products', (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  res.json(product);
});

// 3. POST /api/products - Cadastra novo produto
app.post('/products', (req, res) => {
  const { name, category, categoryName, price, image } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: "Campos 'name', 'category' e 'price' são obrigatórios." });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    category,
    categoryName: categoryName || category,
    price: Number(price),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Inicialização do Servidor
// Configurar o servidor pra escutar na porta 3002
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
