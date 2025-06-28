"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, Calendar, FileText, Plus, Settings, Users, Package, Edit, Trash2, CheckCircle, AlertCircle, Database, User } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';
import { type ProductToEdit } from "../App";

interface Product {
  id: number;
  name: string;
  category: string;
  type: "mapa" | "custom";
  brand?: string;
  lastSearchDate: string;
  status: "active" | "inactive";
}

interface ProductsMonitoredProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
  onEditProduct: (product: ProductToEdit) => void;
}

export function ProductsMonitored({ onLogout, onNavigateToSection, activeSection, onEditProduct }: ProductsMonitoredProps) {
  // Mock data expandido - em produção viria de API
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "ROUNDUP WG - Glifosato 720g/kg",
      category: "Herbicida",
      type: "mapa",
      brand: "Bayer",
      lastSearchDate: "16/06/2025 08:00",
      status: "active"
    },
    {
      id: 2,
      name: "AMISTAR - Azoxistrobina 250g/L",
      category: "Fungicida",
      type: "mapa", 
      brand: "Syngenta",
      lastSearchDate: "16/06/2025 08:00",
      status: "active"
    },
    {
      id: 3,
      name: "Inseticida Especial Importado XYZ",
      category: "Inseticida",
      type: "custom",
      brand: "Fabricante Personalizado",
      lastSearchDate: "15/06/2025 20:00",
      status: "inactive"
    },
    {
      id: 4,
      name: "VELUM PRIME - Fluopyram 500g/L",
      category: "Nematicida",
      type: "mapa",
      brand: "Bayer",
      lastSearchDate: "16/06/2025 07:30",
      status: "active"
    },
    {
      id: 5,
      name: "Adjuvante Personalizado ABC",
      category: "Adjuvante",
      type: "custom",
      lastSearchDate: "15/06/2025 18:45",
      status: "active"
    }
  ]);

  const [successMessage, setSuccessMessage] = useState("");

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  const handleAddProduct = () => {
    onNavigateToSection("add-product");
  };

  const handleEditProductClick = (product: Product) => {
    const productToEdit: ProductToEdit = {
      id: product.id,
      name: product.name,
      category: product.category,
      type: product.type,
      brand: product.brand
    };
    
    console.log("Preparando produto para edição:", productToEdit);
    onEditProduct(productToEdit);
  };

  const handleRemoveProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    
    if (!window.confirm(`Tem certeza que deseja remover "${product?.name}"?`)) {
      return;
    }
    
    // Remove o produto da lista
    setProducts(prev => prev.filter(product => product.id !== productId));
    
    // Exibe mensagem de sucesso
    setSuccessMessage("Produto removido com sucesso");
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleToggleStatus = (productId: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === "active" ? "inactive" : "active" as "active" | "inactive" }
        : product
    ));
    
    const product = products.find(p => p.id === productId);
    const newStatus = product?.status === "active" ? "inativo" : "ativo";
    setSuccessMessage(`Produto ${newStatus} com sucesso`);
    
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Herbicida":
        return "bg-green-100 text-green-800 border-0";
      case "Fungicida":
        return "bg-blue-100 text-blue-800 border-0";
      case "Inseticida":
        return "bg-orange-100 text-orange-800 border-0";
      case "Acaricida":
        return "bg-purple-100 text-purple-800 border-0";
      case "Nematicida":
        return "bg-red-100 text-red-800 border-0";
      case "Adjuvante":
        return "bg-gray-100 text-gray-800 border-0";
      case "Biológico":
        return "bg-emerald-100 text-emerald-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  const getTypeIcon = (type: "mapa" | "custom") => {
    return type === "mapa" ? (
      <Database className="w-3 h-3" />
    ) : (
      <User className="w-3 h-3" />
    );
  };

  const getTypeLabel = (type: "mapa" | "custom") => {
    return type === "mapa" ? "MAPA" : "Personalizado";
  };

  const getTypeColor = (type: "mapa" | "custom") => {
    return type === "mapa" 
      ? "bg-blue-50 text-blue-700 border-blue-200" 
      : "bg-orange-50 text-orange-700 border-orange-200";
  };

  const activeProducts = products.filter(p => p.status === "active").length;
  const inactiveProducts = products.filter(p => p.status === "inactive").length;
  const mapaProducts = products.filter(p => p.type === "mapa").length;
  const customProducts = products.filter(p => p.type === "custom").length;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="border-r border-borda-sutil bg-branco-puro">
          <div className="flex justify-center items-center p-6 border-b border-borda-sutil">
            <ImageWithFallback
              src={logoImage}
              alt="MonitorAgro Logo"
              className="h-14 w-auto"
            />
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-cinza-secundario text-xs uppercase tracking-wider px-3 py-2">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-3">
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onNavigateToSection(item.id)}
                        isActive={activeSection === item.id}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-verde-claro text-verde-folha"
                            : "text-cinza-texto hover:bg-cinza-claro"
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>


        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-branco-puro border-b border-borda-sutil px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h1 className="text-cinza-texto">Produtos Monitorados</h1>
                  <p className="text-sm text-cinza-secundario">
                    Gerencie os produtos que estão sendo monitorados
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleAddProduct}
                className="bg-verde-folha hover:bg-verde-folha/90 text-[rgba(30,58,46,1)] shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Mensagem de sucesso */}
            {successMessage && (
              <div className="mb-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Cards de resumo */}
            {products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Total de Produtos
                    </CardTitle>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{products.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Produtos Ativos
                    </CardTitle>
                    <div className="p-2 bg-verde-claro rounded-lg">
                      <CheckCircle className="h-4 w-4 text-verde-folha" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{activeProducts}</div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Produtos MAPA
                    </CardTitle>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Database className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{mapaProducts}</div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Produtos Personalizados
                    </CardTitle>
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{customProducts}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabela de produtos */}
            <Card className="bg-branco-puro border-borda-sutil shadow-sm">
              <CardHeader>
                <CardTitle className="text-cinza-texto">Lista de Produtos</CardTitle>
                <CardDescription className="text-cinza-secundario">
                  {products.length > 0
                    ? `${products.length} produto${products.length !== 1 ? 's' : ''} cadastrado${products.length !== 1 ? 's' : ''}`
                    : "Nenhum produto cadastrado"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="rounded-lg border border-borda-sutil">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cinza-claro/50">
                          <TableHead className="text-cinza-texto font-medium">Nome do Produto</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Categoria</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Tipo</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Última Busca</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Status</TableHead>
                          <TableHead className="text-cinza-texto font-medium text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="hover:bg-cinza-claro/30 transition-colors">
                            <TableCell className="font-medium text-cinza-texto">
                              <div className="space-y-1">
                                <div>{product.name}</div>
                                {product.brand && (
                                  <div className="text-xs text-cinza-secundario">
                                    {product.brand}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={getCategoryColor(product.category)}
                              >
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getTypeColor(product.type)}
                              >
                                {getTypeIcon(product.type)}
                                <span className="ml-1">{getTypeLabel(product.type)}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-cinza-secundario text-sm">
                              {product.lastSearchDate}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={product.status === "active" ? "default" : "secondary"}
                                className={
                                  product.status === "active" 
                                    ? "bg-verde-claro text-verde-folha border-0" 
                                    : "bg-gray-100 text-gray-600 border-0"
                                }
                              >
                                {product.status === "active" ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(product.id)}
                                  className="h-8 px-2 text-xs text-cinza-secundario hover:text-verde-folha hover:bg-verde-claro"
                                  title={product.status === "active" ? "Desativar produto" : "Ativar produto"}
                                >
                                  {product.status === "active" ? "Desativar" : "Ativar"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProductClick(product)}
                                  className="h-8 w-8 p-0 text-cinza-secundario hover:text-verde-folha hover:bg-verde-claro"
                                  title="Editar produto"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="h-8 w-8 p-0 text-cinza-secundario hover:text-red-600 hover:bg-red-50"
                                  title="Remover produto"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-cinza-claro rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-cinza-secundario" />
                      </div>
                    </div>
                    <h3 className="text-cinza-texto mb-2">Adicione os produtos que deseja monitorar</h3>
                    <p className="text-sm text-cinza-secundario mb-6">
                      Comece cadastrando produtos para acompanhar seus preços automaticamente
                    </p>
                    <Button 
                      onClick={handleAddProduct}
                      className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Produto
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}