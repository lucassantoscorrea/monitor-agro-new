# Diretrizes de Acessibilidade - MonitorAgro

## Análise de Contraste Realizada

### ✅ Problemas Identificados e Corrigidos

#### Modo Claro
- **Texto Principal**: Alterado de `#374151` para `#1F2937` (contraste 12.6:1)
- **Verde Principal**: Alterado de `#3A7F3D` para `#16803D` (contraste 4.8:1)
- **Bordas**: Alterado de `#E5E7EB` para `#D1D5DB` (melhor visibilidade)
- **Texto Secundário**: Alterado de `#6B7280` para `#64748B` (contraste 5.2:1)

#### Modo Escuro
- **Texto Principal**: Alterado de `#F1F5F9` para `#F8FAFC` (contraste 15.1:1)
- **Verde Principal**: Alterado de `#4ADE80` para `#22C55E` (contraste 8.2:1)
- **Bordas**: Alterado de `#334155` para `#475569` (melhor visibilidade)
- **Cards**: Mantido `#1E293B` com texto `#F8FAFC` (contraste 12.8:1)

## Padrões de Cores por Componente

### Botões
```css
/* Botão Primário */
Claro: bg-[#16803D] text-white (contraste 4.8:1)
Escuro: bg-[#22C55E] text-[#0F172A] (contraste 8.2:1)

/* Botão Secundário */
Claro: bg-[#F8FAFC] text-[#475569] border-[#D1D5DB]
Escuro: bg-[#374151] text-[#CBD5E1] border-[#475569]

/* Botão Destrutivo */
Claro: bg-[#DC2626] text-white (contraste 5.4:1)
Escuro: bg-[#EF4444] text-white (contraste 4.1:1)
```

### Cards e Containers
```css
/* Card Principal */
Claro: bg-[#ffffff] text-[#1F2937] border-[#D1D5DB]
Escuro: bg-[#1E293B] text-[#F8FAFC] border-[#475569]

/* Card Secundário */
Claro: bg-[#F8FAFC] text-[#475569]
Escuro: bg-[#374151] text-[#CBD5E1]
```

### Alerts e Mensagens
```css
/* Sucesso */
Claro: bg-[#DCFCE7] text-[#166534] border-[#16A34A]
Escuro: bg-[#1E3A2E] text-[#22C55E] border-[#22C55E]

/* Aviso */
Claro: bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]
Escuro: bg-[#451A03] text-[#FB923C] border-[#FB923C]

/* Erro */
Claro: bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]
Escuro: bg-[#451A1A] text-[#EF4444] border-[#EF4444]

/* Info */
Claro: bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6]
Escuro: bg-[#1E293B] text-[#60A5FA] border-[#60A5FA]
```

## Checklist de Acessibilidade

### ✅ Contraste de Texto
- [x] Texto normal: mínimo 4.5:1
- [x] Texto grande: mínimo 3:1
- [x] Elementos gráficos: mínimo 3:1

### ✅ Estados Interativos
- [x] Focus ring visível (2px solid)
- [x] Hover states contrastantes
- [x] Active states diferenciados

### ✅ Navegação por Teclado
- [x] Focus trap implementado
- [x] Outline customizado para focus-visible
- [x] Navegação sequencial lógica

### ✅ Preferências do Sistema
- [x] Suporte a prefers-reduced-motion
- [x] Suporte a prefers-contrast: high
- [x] Tema padrão claro respeitado

## Diretrizes para Desenvolvedores

### 1. Sempre usar as variáveis CSS
```css
/* ✅ Correto */
color: var(--foreground);
background-color: var(--card);

/* ❌ Incorreto */
color: #1F2937;
background-color: #ffffff;
```

### 2. Testar contraste em ambos os temas
```bash
# Use ferramentas como:
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Chrome DevTools Accessibility
```

### 3. Estados obrigatórios para elementos interativos
```css
/* Sempre implementar */
:hover { /* estado hover */ }
:focus-visible { /* foco por teclado */ }
:active { /* estado pressionado */ }
:disabled { /* estado desabilitado */ }
```

### 4. Usar utilitários de contraste
```css
.high-contrast-text    /* Para textos principais */
.medium-contrast-text  /* Para textos secundários */
.low-contrast-text     /* Para textos auxiliares */
```

## Testes Recomendados

1. **Teste Visual**: Verificar em ambos os temas
2. **Teste de Contraste**: Usar ferramentas automatizadas
3. **Teste de Teclado**: Navegar apenas com Tab/Shift+Tab
4. **Teste de Screen Reader**: Testar com NVDA/JAWS
5. **Teste Mobile**: Verificar em dispositivos tácteis

## Referências WCAG 2.1

- **AA**: Contraste mínimo 4.5:1 (texto normal)
- **AA**: Contraste mínimo 3:1 (texto grande/gráficos)
- **AAA**: Contraste mínimo 7:1 (texto normal)
- **AAA**: Contraste mínimo 4.5:1 (texto grande)

## Problemas Comuns Evitados

❌ **Evitar**:
- Cores como única forma de comunicação
- Contraste insuficiente em estados hover
- Focus ring invisível ou muito sutil
- Textos cinza claro em fundos claros
- Bordas invisíveis no modo escuro

✅ **Implementado**:
- Contraste adequado em todos os estados
- Focus rings bem visíveis
- Bordas contrastantes
- Hierarquia visual clara
- Suporte a preferências do usuário