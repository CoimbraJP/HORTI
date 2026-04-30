import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ── SVG Icons ─────────────────────────────────────────
const Icons = {
  Leaf: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.9.9 7.1A11 11 0 0 1 11 20" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Printer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 6,2 18,2 18,9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Package: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  ClipboardCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Inbox: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
};

// ── API Configuration ────────────────────────────────
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : '/api';

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
    return [];
  }
};

const fetchOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/orders`);
    return await res.json();
  } catch (e) {
    console.error("Erro ao carregar pedidos:", e);
    return [];
  }
};

const saveOrderAPI = async (order) => {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return await res.json();
  } catch (e) {
    console.error("Erro ao salvar pedido:", e);
  }
};

const updateOrderPrintedAPI = async (id, printed) => {
  try {
    await fetch(`${API_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ printed })
    });
  } catch (e) {
    console.error("Erro ao atualizar status de impressão:", e);
  }
};

const saveProductAPI = async (product) => {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return await res.json();
  } catch (e) {
    console.error("Erro ao salvar produto:", e);
  }
};

const deleteProductAPI = async (id) => {
  try {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.error("Erro ao deletar produto:", e);
  }
};

const formatCurrency = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getInitials = (name) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

// Helper to parse "DD/MM/YYYY, HH:mm:ss"
const parseOrderDate = (dateString) => {
  if (!dateString) return new Date(0);
  const [datePart, timePart] = dateString.split(', ');
  if (!datePart) return new Date(0);
  const [day, month, year] = datePart.split('/');
  return new Date(`${year}-${month}-${day}T${timePart || '00:00:00'}`);
};

// ╔══════════════════════════════════════════════════╗
// ║  CLIENT VIEW                                     ║
// ╚══════════════════════════════════════════════════╝
function ClientView({ products, onOrderSubmitted }) {

  const [cart, setCart] = useState({});
  const [clientData, setClientData] = useState({ name: '', document: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [fullOrder, setFullOrder] = useState(null);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalValue = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = products.find(p => p.id === +id);
    return acc + (p ? p.price * qty : 0);
  }, 0);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return next === 0 ? (({ [id]: _, ...rest }) => rest)(prev) : { ...prev, [id]: next };
    });
  }, []);

  const handleSubmit = async () => {
    if (!clientData.name.trim() || !clientData.phone.trim()) { 
      alert('Por favor, preencha nome e telefone para continuar.'); 
      return; 
    }
    if (totalItems === 0) { alert('Escolha ao menos um produto para continuar.'); return; }

    const orderData = {
      client: { ...clientData },
      items: Object.entries(cart).map(([id, qty]) => ({
        ...products.find(p => p.id === +id),
        quantity: qty,
      })),
      timestamp: new Date().toLocaleString('pt-BR'),
      total: totalValue,
      status: 'pending',
      printed: false
    };

    const savedOrder = await saveOrderAPI(orderData);

    if (savedOrder) {
      setOrderId(savedOrder.id);
      setFullOrder(savedOrder);
      setSubmitted(true);
      onOrderSubmitted?.();
    }
  };

  if (submitted) {
    const waNumber = '5512982007553';
    const itemsList = Object.entries(cart).map(([id, qty]) => {
      const p = products.find(p => p.id === +id);
      return `• ${qty}x ${p.name}`;
    }).join('\n');

    const message =
      `${clientData.name}\n` +
      `${clientData.document ? clientData.document + '\n' : ''}` +
      `${clientData.phone}\n\n` +
      `Pedido #${orderId}\n` +
      `───────────────\n` +
      itemsList +
      `\n───────────────\n` +
      `Total: ${formatCurrency(totalValue)}`;

    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginTop: '24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Pedido Gerado!
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Seu pedido <strong style={{ color: 'var(--color-text)' }}>#{orderId}</strong> foi registrado com sucesso.
            </p>

            <div style={{
              background: 'var(--color-brand-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px',
            }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-brand-dark)', fontWeight: 600 }}>
                Número do Pedido
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-dark)' }}>
                #{orderId}
              </p>
            </div>

            <div style={{
              background: '#fffbeb',
              border: '1.5px solid #fcd34d',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              marginBottom: '20px',
              textAlign: 'left',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
              <p style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5, margin: 0 }}>
                <strong>Atenção:</strong> Para finalizar seu pedido, clique no botão verde abaixo, e <strong>envie a mensagem que já estará pronta</strong> no WhatsApp. Sem o envio, seu pedido não será confirmado.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary btn--full"
                style={{ background: '#25D366', borderColor: '#25D366', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.056c6.555 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Confirmar no WhatsApp
              </a>
              <button
                className="btn btn--ghost btn--full"
                onClick={() => { setCart({}); setClientData({ name: '', document: '', phone: '' }); setSubmitted(false); setOrderId(null); }}
              >
                Fazer novo pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingBottom: '0' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginTop: '24px' }}>
          <span className="page-header__tag">
            <Icons.Leaf />
            HORTI Pedidos
          </span>
          <h1 className="page-header__title">Monte seu<br />pedido</h1>
          <p className="page-header__subtitle">Escolha os produtos e a quantidade desejada</p>
        </div>

        {/* Client Data Form */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">Nome / Empresa</label>
              <input
                id="client-name"
                className="form-input"
                type="text"
                placeholder="Ex: João da Silva"
                value={clientData.name}
                onChange={e => setClientData({...clientData, name: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">CPF/CNPJ</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="000.000.000-00"
                  value={clientData.document}
                  onChange={e => setClientData({...clientData, document: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={clientData.phone}
                  onChange={e => setClientData({...clientData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <p className="section-title">
          <Icons.Package />
          Produtos Disponíveis
        </p>

        <div className="product-list" style={{ marginBottom: totalItems > 0 ? '100px' : '0' }}>
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`product-card ${(cart[product.id] || 0) > 0 ? 'product-card--active' : ''}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="product-icon">{product.icon}</div>

              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">{formatCurrency(product.price)}</div>
                <span className="product-category">{product.category}</span>
              </div>

              <div className="qty-stepper">
                <button
                  className="qty-btn qty-btn--minus"
                  onClick={() => updateQty(product.id, -1)}
                  aria-label="Diminuir quantidade"
                  disabled={(cart[product.id] || 0) === 0}
                >
                  <Icons.Minus />
                </button>
                <span className="qty-value">{cart[product.id] || 0}</span>
                <button
                  className="qty-btn qty-btn--plus"
                  onClick={() => updateQty(product.id, 1)}
                  aria-label="Aumentar quantidade"
                >
                  <Icons.Plus />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart */}
        {totalItems > 0 && (
          <div className="cart-float no-print" role="region" aria-label="Resumo do pedido">
            <div className="cart-float__info">
              <div className="cart-float__label">Total do pedido</div>
              <div className="cart-float__total">{formatCurrency(totalValue)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="cart-float__badge">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
              <button className="btn btn--primary" onClick={handleSubmit}>
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════╗
// ║  ADMIN / CD VIEW                                 ║
// ╚══════════════════════════════════════════════════╝
function AdminView({ orders, autoPrintEnabled, setAutoPrintEnabled, printOrder }) {
  const totalPending = orders.filter(o => !o.printed).length;
  const totalValue   = orders.reduce((a, o) => a + (o.total || 0), 0);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="page-header__tag">
              <Icons.Printer />
              Centro de Distribuição
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={setAutoPrintEnabled}
                className={`live-badge ${autoPrintEnabled ? '' : 'bg-slate-200 text-slate-500'}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {autoPrintEnabled ? (
                  <><span className="live-dot" /> Auto-Print Ligado</>
                ) : (
                  'Auto-Print Desligado'
                )}
              </button>
            </div>
          </div>
          <h1 className="page-header__title">Fila de<br />Pedidos</h1>
          <p className="page-header__subtitle">Impressão automática ativada para novos pedidos</p>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-card__value">{orders.length}</div>
            <div className="stat-card__label">Total Hoje</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--color-brand)' }}>{totalPending}</div>
            <div className="stat-card__label">A Imprimir</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ fontSize: '1rem' }}>
              {formatCurrency(totalValue)}
            </div>
            <div className="stat-card__label">Volume</div>
          </div>
        </div>

        {/* Order List */}
        <p className="section-title">
          <Icons.ClipboardCheck />
          Fila de Separação
        </p>

        {orders.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state__icon"><Icons.Inbox /></div>
              <div className="empty-state__title">Nenhum pedido ainda</div>
              <p className="empty-state__text">Aguardando pedidos para impressão automática...</p>
            </div>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className="order-card"
                style={{ animationDelay: `${idx * 60}ms`, opacity: order.printed ? 0.7 : 1 }}
              >
                <div className="order-card__header">
                  <span className="order-card__id">
                    # {order.id}
                  </span>
                  <span className={`order-card__badge ${order.printed ? 'bg-emerald-100 text-emerald-700' : ''}`} style={{ background: order.printed ? '#dcfce7' : '' }}>
                    {order.printed ? <Icons.ClipboardCheck /> : <Icons.Clock />}
                    {order.printed ? 'Impresso' : 'Pendente'}
                  </span>
                </div>

                <div className="order-card__client">
                  <div className="order-card__avatar">
                    {getInitials(order.client.name)}
                  </div>
                  <div className="order-card__client-info">
                    <div className="order-card__client-name">{order.client.name}</div>
                    <div className="order-card__client-time">{order.timestamp}</div>
                  </div>
                </div>

                <div className="order-card__items">
                  {order.items.map((item, i) => (
                    <span key={i} className="order-item-tag">
                      <span className="order-item-tag__qty">{item.quantity}</span>
                      {item.name}
                    </span>
                  ))}
                </div>

                <div className="divider" />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-xmuted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Valor</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                  <button
                    className={`btn ${order.printed ? 'btn--ghost' : 'btn--dark'}`}
                    onClick={() => printOrder(order)}
                  >
                    <Icons.Printer />
                    {order.printed ? 'Re-imprimir' : 'Imprimir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════╗
// ║  PRODUCTS VIEW (Old Manager)                     ║
// ╚══════════════════════════════════════════════════╝
function ProductsView({ products, setProducts }) {
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', icon: '📦' });

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Por favor, preencha o nome e o preço.');
      return;
    }
    const saved = await saveProductAPI({ ...newProduct, price: parseFloat(newProduct.price) });
    if (saved) {
      setProducts([...products, saved]);
      setNewProduct({ name: '', category: '', price: '', icon: '📦' });
    }
  };

  const removeProduct = async (id) => {
    await deleteProductAPI(id);
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="page-header__tag">
            <Icons.Package />
            Gestão de Estoque
          </span>
          <h1 className="page-header__title">Produtos &<br />Catálogo</h1>
          <p className="page-header__subtitle">Adicione ou remova itens da sua loja</p>
        </div>

        {/* Add Product Form */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Novo Produto</h3>
          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input 
                className="form-input" 
                placeholder="Ex: Saco de Batata 20kg"
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <input 
                  className="form-input" 
                  placeholder="Ex: Legumes"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preço (R$)</label>
                <input 
                  className="form-input" 
                  type="number" 
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
            </div>
            <button className="btn btn--primary btn--full" onClick={addProduct}>
              <Icons.Plus /> Cadastrar Produto
            </button>
          </div>
        </div>

        {/* Current Products */}
        <p className="section-title">
          <Icons.ClipboardCheck />
          Itens Atuais ({products.length})
        </p>
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-icon">{product.icon}</div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-price">{formatCurrency(product.price)}</div>
              </div>
              <button 
                className="qty-btn qty-btn--minus" 
                onClick={() => removeProduct(product.id)}
                style={{ background: '#fee2e2', borderColor: '#fecaca', color: '#ef4444' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════╗
// ║  DASHBOARD VIEW (New Gestão)                     ║
// ╚══════════════════════════════════════════════════╝
function DashboardView({ orders }) {
  
  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('pt-BR'); // ex: 29/04/2026
    
    let todaySales = 0;
    let weekSales = 0;
    let monthSales = 0;
    
    // For Chart (Last 7 days)
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        fullDate: d.toLocaleDateString('pt-BR'),
        total: 0
      };
    });

    // For Top Clients
    const clientMap = {};

    orders.forEach(order => {
      const oDate = parseOrderDate(order.timestamp);
      if (!oDate || isNaN(oDate)) return;
      
      const orderDayStr = oDate.toLocaleDateString('pt-BR');
      
      // Today
      if (orderDayStr === todayStr) {
        todaySales += order.total;
      }
      
      // Week (approx 7 days)
      const diffTime = Math.abs(now - oDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 7) {
        weekSales += order.total;
      }
      
      // Month
      if (oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear()) {
        monthSales += order.total;
      }

      // Chart Data
      const chartDay = last7Days.find(d => d.fullDate === orderDayStr);
      if (chartDay) {
        chartDay.total += order.total;
      }

      // Client Ranking
      const cName = order.client?.name?.toUpperCase() || 'DESCONHECIDO';
      if (!clientMap[cName]) clientMap[cName] = { name: cName, total: 0, orders: 0 };
      clientMap[cName].total += order.total;
      clientMap[cName].orders += 1;
    });

    const topClients = Object.values(clientMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { todaySales, weekSales, monthSales, chartData: last7Days, topClients };
  }, [orders]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="page-header__tag">
            <Icons.Chart />
            Relatórios
          </span>
          <h1 className="page-header__title">Gestão de<br />Vendas</h1>
          <p className="page-header__subtitle">Acompanhe os resultados da sua loja</p>
        </div>

        {/* Top Metrics */}
        <div className="stats-bar" style={{ marginBottom: '32px' }}>
          <div className="stat-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="stat-card__value" style={{ color: '#16a34a', fontSize: '1.25rem' }}>{formatCurrency(metrics.todaySales)}</div>
            <div className="stat-card__label">Hoje</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ fontSize: '1.1rem' }}>{formatCurrency(metrics.weekSales)}</div>
            <div className="stat-card__label">Últimos 7 dias</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ fontSize: '1.1rem' }}>{formatCurrency(metrics.monthSales)}</div>
            <div className="stat-card__label">Este Mês</div>
          </div>
        </div>

        {/* Chart */}
        <p className="section-title">
          <Icons.Chart />
          Faturamento Semanal
        </p>
        <div className="card" style={{ padding: '24px 16px', marginBottom: '32px', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                formatter={(value) => [formatCurrency(value), 'Faturamento']}
                labelStyle={{color: '#374151', fontWeight: 'bold'}}
              />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients */}
        <p className="section-title">
          <Icons.User />
          Melhores Clientes
        </p>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {metrics.topClients.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
              Nenhuma venda registrada ainda.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280' }}>Cliente</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', textAlign: 'center' }}>Pedidos</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topClients.map((client, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1f2937' }}>{client.name}</td>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#4b5563' }}>{client.orders}</td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>{formatCurrency(client.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════╗
// ║  ADMIN LAYOUT (Navigation wrapper)               ║
// ╚══════════════════════════════════════════════════╝
function AdminLayout({ autoPrintEnabled, printOrder, loadAllOrders }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // MONITOR DE IMPRESSÃO - Roda apenas enquanto estiver nas páginas administrativas
  useEffect(() => {
    const checkAndPrint = async () => {
      const currentOrders = await loadAllOrders();

      if (autoPrintEnabled) {
        const nextToPrint = [...currentOrders].reverse().find(o => !o.printed);
        if (nextToPrint) {
          printOrder(nextToPrint);
        }
      }
    };

    const interval = setInterval(checkAndPrint, 4000);
    return () => clearInterval(interval);
  }, [autoPrintEnabled, printOrder, loadAllOrders]);

  return (
    <>
      <nav className="navbar no-print" aria-label="Navegação administrativa">
        <div className="container">
          <div className="navbar__inner">
            <div className="navbar__logo">
              <div className="navbar__logo-icon">
                <Icons.Leaf />
              </div>
              <span className="navbar__logo-text">HORTI LOJA</span>
            </div>

            <div className="navbar__tabs" role="tablist">
              <button
                role="tab"
                aria-selected={currentPath === '/admin/cd' || currentPath === '/admin'}
                className={`tab-btn ${currentPath === '/admin/cd' || currentPath === '/admin' ? 'tab-btn--active' : ''}`}
                onClick={() => navigate('/admin/cd')}
              >
                <Icons.Printer />
                CD
              </button>
              <button
                role="tab"
                aria-selected={currentPath === '/admin/produtos'}
                className={`tab-btn ${currentPath === '/admin/produtos' ? 'tab-btn--active' : ''}`}
                onClick={() => navigate('/admin/produtos')}
              >
                <Icons.Package />
                Produtos
              </button>
              <button
                role="tab"
                aria-selected={currentPath === '/admin/gestao'}
                className={`tab-btn ${currentPath === '/admin/gestao' ? 'tab-btn--active' : ''}`}
                onClick={() => navigate('/admin/gestao')}
              >
                <Icons.Chart />
                Gestão
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Rotas filhas serão renderizadas no nível superior (no App) mas o visual encaixa aqui */}
    </>
  );
}

// ╔══════════════════════════════════════════════════╗
// ║  APP ROOT                                        ║
// ╚══════════════════════════════════════════════════╝
export default function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(() => {
    return localStorage.getItem('autoPrint') === 'true';
  });

  const toggleAutoPrint = () => {
    setAutoPrintEnabled(prev => {
      const next = !prev;
      localStorage.setItem('autoPrint', next);
      return next;
    });
  };

  const loadAllOrders = useCallback(async () => {
    const data = await fetchOrders();
    setOrders(data);
    return data;
  }, []);

  const printOrder = useCallback(async (order) => {
    // Mark as printed immediately to avoid loops
    await updateOrderPrintedAPI(order.id, true);
    await loadAllOrders();

    // Create hidden iframe for silent printing
    let iframe = document.getElementById('print-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td>
          <span class="check-box"></span>
          <span class="item-name">${item.name}</span>
        </td>
        <td class="item-qty">${item.quantity}</td>
      </tr>`).join('');

    const docContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Pedido #${order.id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 320px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 14px; }
    .header h2 { font-size: 18px; font-weight: 900; letter-spacing: 1px; }
    .header p  { font-size: 11px; color: #555; margin-top: 4px; }
    .order-id  { font-size: 28px; font-weight: 900; color: #16a34a; margin: 4px 0; }
    .client-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 12px; margin-bottom: 14px; }
    .client-box strong { font-size: 13px; color: #15803d; display: block; margin-bottom: 2px; }
    .client-box span { font-size: 15px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    thead th { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #6b7280; padding: 6px 0; border-bottom: 1px solid #e5e7eb; text-align: left; }
    thead th:last-child { text-align: right; }
    tbody tr { border-bottom: 1px dashed #d1d5db; }
    tbody td { padding: 10px 0; vertical-align: middle; }
    .check-box { width: 20px; height: 20px; border: 2px solid #000; display: inline-block; border-radius: 4px; vertical-align: middle; margin-right: 6px; }
    .item-name { font-size: 13px; font-weight: 600; }
    .item-qty  { font-size: 14px; font-weight: 800; text-align: right; }
    .footer { margin-top: 18px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px dashed #d1d5db; padding-top: 12px; }
    .total-row { margin-top: 12px; display: flex; justify-content: space-between; font-weight: 800; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🌿 HORTI</h2>
    <div class="order-id">#${order.id}</div>
    <p>${order.timestamp}</p>
  </div>
  <div class="client-box">
    <strong>Cliente</strong>
    <span>${order.client.name}</span>
    <div style="font-size: 11px; color: #666; margin-top: 4px;">
      ${order.client.document ? 'Doc: ' + order.client.document + '<br>' : ''}
      Tel: ${order.client.phone}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Produto</th>
        <th>Qtd</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>
  <div class="total-row">
    <span>Total</span>
    <span>${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
  </div>
  <div class="footer">
    Centro de Distribuição HORTI<br>
    Separado por: _______________
  </div>
</body>
</html>`;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(docContent);
    doc.close();

    // Give it a moment to load and then print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 500);
  }, [loadAllOrders]);

  useEffect(() => {
    const load = async () => {
      const pData = await fetchProducts();
      setProducts(pData);
      await loadAllOrders();
    };
    load();
  }, []);


  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Rota do Cliente */}
          <Route path="/" element={<ClientView products={products} />} />

          {/* Rotas Administrativas da Loja */}
          <Route path="/admin/*" element={
            <>
              <AdminLayout 
                autoPrintEnabled={autoPrintEnabled} 
                printOrder={printOrder} 
                loadAllOrders={loadAllOrders} 
              />
              <Routes>
                <Route path="/" element={<Navigate to="cd" replace />} />
                <Route path="cd" element={
                  <AdminView 
                    orders={orders} 
                    autoPrintEnabled={autoPrintEnabled} 
                    setAutoPrintEnabled={toggleAutoPrint} 
                    printOrder={printOrder} 
                  />
                } />
                <Route path="produtos" element={<ProductsView products={products} setProducts={setProducts} />} />
                <Route path="gestao" element={<DashboardView orders={orders} />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
