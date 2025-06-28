"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Plus, Settings, Users, Package, Clock, AlertCircle, Info, Palette } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface DashboardProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

export function Dashboard({ onLogout, onNavigateToSection, activeSection }: DashboardProps) {
  // Mock data - em produção viria de API
  const [monitoredProducts] = useState([
    { id: 1, name: "Herbicida Glifosato", lastPrice: "R$ 25,50/L" },
    { id: 2, name: "Fungicida Azoxistrobina", lastPrice: "R$ 142,00/L" },
  ]);

  const nextSearchDate = new Date();
  nextSearchDate.setHours(nextSearchDate.getHours() + 2);

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

  const handleVisualSettings = () => {
    onNavigateToSection("visual-settings");
  };

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
                  <h1 className="text-cinza-texto">Bem-vindo ao MonitorAgro</h1>
                  <p className="text-sm text-cinza-secundario">
                    Gerencie o monitoramento de preços dos seus produtos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleVisualSettings}
                  variant="outline"
                  size="sm"
                  className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro hover:text-verde-folha"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleAddProduct}
                  className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Aviso de próxima busca */}
            <div className="mb-6">
              <Card className="bg-blue-50/50 border-blue-200/50 shadow-sm bg-[rgba(255,255,255,0.5)]">
                <CardContent className="pt-4 bg-[rgba(228,228,228,1)] bg-[rgba(239,246,255,1)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Info className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm text-[rgba(6,70,154,1)]">
                      Próxima busca programada para{" "}
                      <span className="font-medium">
                        {nextSearchDate.toLocaleDateString("pt-BR")} às{" "}
                        {nextSearchDate.toLocaleTimeString("pt-BR", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-branco-puro border-borda-sutil shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigateToSection("products")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm text-cinza-secundario font-medium">
                    Produtos Monitorados
                  </CardTitle>
                  <div className="p-2 bg-verde-claro rounded-lg">
                    <Package className="h-4 w-4 text-verde-folha" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-cinza-texto">
                        {monitoredProducts.length}
                      </span>
                      <Badge variant="secondary" className="bg-verde-claro text-verde-folha border-0">
                        Ativos
                      </Badge>
                    </div>
                    <p className="text-xs text-cinza-secundario">
                      {monitoredProducts.length > 0 
                        ? "produtos sendo monitorados"
                        : "Nenhum produto monitorado ainda"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-branco-puro border-borda-sutil shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigateToSection("reports")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm text-cinza-secundario font-medium">
                    Último Relatório
                  </CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold text-cinza-texto">Hoje</div>
                    <p className="text-xs text-cinza-secundario">
                      {monitoredProducts.length > 0
                        ? "Gerado às 08:00"
                        : "Nenhum relatório disponível"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-branco-puro border-borda-sutil shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm text-cinza-secundario font-medium">
                    Próxima Busca
                  </CardTitle>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold text-cinza-texto">2h</div>
                    <p className="text-xs text-cinza-secundario">
                      Busca automática ativa
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de produtos monitorados */}
            <Card className="bg-branco-puro border-borda-sutil shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-cinza-texto">Produtos Monitorados</CardTitle>
                    <CardDescription className="text-cinza-secundario">
                      {monitoredProducts.length > 0
                        ? "Acompanhe os produtos que estão sendo monitorados"
                        : "Adicione produtos para começar o monitoramento"
                      }
                    </CardDescription>
                  </div>
                  {monitoredProducts.length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => onNavigateToSection("products")}
                      className="text-verde-folha border-verde-folha hover:bg-verde-claro"
                    >
                      Ver Todos
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {monitoredProducts.length > 0 ? (
                  <div className="space-y-3">
                    {monitoredProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border border-borda-sutil rounded-lg hover:bg-cinza-claro/50 transition-colors cursor-pointer"
                        onClick={() => onNavigateToSection("products")}
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-cinza-texto">{product.name}</p>
                          <p className="text-sm text-cinza-secundario">
                            Último preço encontrado: {product.lastPrice}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-verde-folha border-verde-folha bg-verde-claro/50">
                          Ativo
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-cinza-claro rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-cinza-secundario" />
                      </div>
                    </div>
                    <h3 className="text-cinza-texto mb-2">Nenhum produto monitorado ainda</h3>
                    <p className="text-sm text-cinza-secundario mb-6">
                      Comece adicionando produtos para monitorar seus preços automaticamente
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