"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, Download, FileSpreadsheet, ArrowLeft, Loader2, AlertTriangle, CheckCircle, MapPin, Building2 } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface ProductResult {
  id: number;
  productName: string;
  price: string;
  supplier: string;
  address: string;
  hasResult: boolean;
}

interface ReportViewProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
  reportId: number;
  reportDate: string;
}

export function ReportView({ onLogout, onNavigateToSection, activeSection, reportId, reportDate }: ReportViewProps) {
  // Estados
  const [productResults, setProductResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<'excel' | 'pdf' | null>(null);
  const [incompleteResults, setIncompleteResults] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  // Mock data - simula dados do relatório específico
  const mockProductResults: ProductResult[] = [
    {
      id: 1,
      productName: "Herbicida Glifosato 480g/L",
      price: "R$ 28,50/L",
      supplier: "AgroTech Distribuidora",
      address: "Av. dos Agricultores, 1245 - Cuiabá/MT",
      hasResult: true
    },
    {
      id: 2,
      productName: "Fungicida Azoxistrobina 200g/L",
      price: "R$ 145,90/L",
      supplier: "Campo Verde Insumos",
      address: "Rod. BR-163, Km 45 - Rondonópolis/MT",
      hasResult: true
    },
    {
      id: 3,
      productName: "Inseticida Bifentrina 100g/L",
      price: "R$ 89,20/L",
      supplier: "Agronegócio MT",
      address: "Rua das Palmeiras, 892 - Sinop/MT",
      hasResult: true
    },
    {
      id: 4,
      productName: "Herbicida 2,4-D 670g/L",
      price: "-",
      supplier: "-",
      address: "-",
      hasResult: false
    },
    {
      id: 5,
      productName: "Acaricida Abamectina 18g/L",
      price: "R$ 312,40/L",
      supplier: "Distribuição Rural Sul",
      address: "Av. Fernando Corrêa, 2341 - Campo Grande/MS",
      hasResult: true
    },
    {
      id: 6,
      productName: "Fungicida Tebuconazole 200g/L",
      price: "-",
      supplier: "-",
      address: "-",
      hasResult: false
    }
  ];

  // Simula carregamento dos dados do relatório
  useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      
      try {
        // Simula delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setProductResults(mockProductResults);
        
        // Verifica se há produtos sem resultado
        const hasIncompleteResults = mockProductResults.some(product => !product.hasResult);
        setIncompleteResults(hasIncompleteResults);
        
      } catch (err) {
        console.error("Erro ao carregar dados do relatório:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, [reportId]);

  const handleBackToReports = () => {
    onNavigateToSection("reports");
  };

  const handleDownloadExcel = async () => {
    setIsDownloading('excel');
    try {
      // Simula geração do arquivo
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log("Download Excel do relatório:", reportId);
      
      // Simula download
      const link = document.createElement('a');
      link.download = `relatorio-${reportDate.replace(/\//g, '-')}.xlsx`;
      link.href = '#'; // Em produção seria a URL real do arquivo
      link.click();
      
    } catch (err) {
      console.error("Erro no download Excel:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading('pdf');
    try {
      // Simula geração do arquivo
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      console.log("Download PDF do relatório:", reportId);
      
      // Simula download
      const link = document.createElement('a');
      link.download = `relatorio-${reportDate.replace(/\//g, '-')}.pdf`;
      link.href = '#'; // Em produção seria a URL real do arquivo
      link.click();
      
    } catch (err) {
      console.error("Erro no download PDF:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  const getResultsStats = () => {
    const totalProducts = productResults.length;
    const successfulResults = productResults.filter(product => product.hasResult).length;
    const failedResults = totalProducts - successfulResults;
    
    return { totalProducts, successfulResults, failedResults };
  };

  const { totalProducts, successfulResults, failedResults } = getResultsStats();

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
                <Button
                  variant="ghost"
                  onClick={handleBackToReports}
                  className="text-cinza-secundario hover:text-cinza-texto hover:bg-cinza-claro p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h1 className="text-cinza-texto">Relatório de {reportDate}</h1>
                  <p className="text-sm text-cinza-secundario">
                    {isLoading 
                      ? "Carregando dados do relatório..."
                      : `${totalProducts} produtos pesquisados • ${successfulResults} resultados encontrados`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleDownloadExcel}
                  disabled={isLoading || isDownloading !== null}
                  variant="outline"
                  className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                >
                  {isDownloading === 'excel' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando Excel...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Baixar em Excel
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isLoading || isDownloading !== null}
                  className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm"
                >
                  {isDownloading === 'pdf' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar em PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Link de volta para relatórios */}
            <div className="mb-6">
              <Button
                variant="link"
                onClick={handleBackToReports}
                className="text-verde-folha hover:text-verde-folha/80 p-0 h-auto"
              >
                ← Voltar para Relatórios
              </Button>
            </div>

            {/* Aviso de relatório incompleto */}
            {incompleteResults && !isLoading && (
              <div className="mb-6">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Alguns produtos não retornaram resultados na busca realizada.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Cards de resumo */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <div className="text-2xl font-semibold text-cinza-texto">{totalProducts}</div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Resultados Encontrados
                    </CardTitle>
                    <div className="p-2 bg-verde-claro rounded-lg">
                      <CheckCircle className="h-4 w-4 text-verde-folha" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-cinza-texto">{successfulResults}</span>
                      <Badge className="bg-verde-claro text-verde-folha border-0">
                        {((successfulResults / totalProducts) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Sem Resultado
                    </CardTitle>
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{failedResults}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabela de resultados */}
            <Card className="bg-branco-puro border-borda-sutil shadow-sm">
              <CardHeader>
                <CardTitle className="text-cinza-texto">Resultados da Busca</CardTitle>
                <CardDescription className="text-cinza-secundario">
                  {isLoading 
                    ? "Carregando dados..."
                    : `Detalhes dos ${totalProducts} produtos pesquisados`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-verde-folha" />
                      <p className="text-sm text-cinza-secundario">Carregando dados do relatório...</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-borda-sutil">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cinza-claro/50">
                          <TableHead className="text-cinza-texto font-medium">Nome do Produto</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Preço</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Fornecedor</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Endereço</TableHead>
                          <TableHead className="text-cinza-texto font-medium text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productResults.map((product) => (
                          <TableRow 
                            key={product.id} 
                            className={`transition-colors ${
                              product.hasResult 
                                ? "hover:bg-cinza-claro/30" 
                                : "bg-red-50/50 hover:bg-red-50/80"
                            }`}
                          >
                            <TableCell className="font-medium text-cinza-texto">
                              <div className="flex items-center gap-2">
                                {product.hasResult ? (
                                  <CheckCircle className="w-4 h-4 text-verde-folha flex-shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                )}
                                {product.productName}
                              </div>
                            </TableCell>
                            <TableCell className={product.hasResult ? "text-cinza-texto font-medium" : "text-cinza-secundario"}>
                              {product.price}
                            </TableCell>
                            <TableCell className={product.hasResult ? "text-cinza-texto" : "text-cinza-secundario"}>
                              <div className="flex items-center gap-2">
                                {product.hasResult && <Building2 className="w-4 h-4 text-cinza-secundario flex-shrink-0" />}
                                {product.supplier}
                              </div>
                            </TableCell>
                            <TableCell className={product.hasResult ? "text-cinza-secundario" : "text-cinza-secundario"}>
                              <div className="flex items-center gap-2">
                                {product.hasResult && <MapPin className="w-4 h-4 text-cinza-secundario flex-shrink-0" />}
                                <span className="text-sm">{product.address}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {product.hasResult ? (
                                <Badge className="bg-verde-claro text-verde-folha border-0">
                                  Encontrado
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-0">
                                  Sem resultado
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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