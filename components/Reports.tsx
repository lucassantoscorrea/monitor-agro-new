"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, Eye, Download, FileSpreadsheet, AlertCircle, CheckCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface Report {
  id: number;
  generatedDate: string;
  generatedTime: string;
  productCount: number;
  status: "completed" | "processing" | "error";
  size: string;
}

interface ReportsProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
  onViewReport?: (reportId: number, reportDate: string) => void;
}

export function Reports({ onLogout, onNavigateToSection, activeSection, onViewReport }: ReportsProps) {
  // Estados
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  // Mock data - simula carregamento de API
  const mockReports: Report[] = [
    {
      id: 1,
      generatedDate: "16/06/2025",
      generatedTime: "08:00",
      productCount: 15,
      status: "completed",
      size: "2.3 MB"
    },
    {
      id: 2,
      generatedDate: "15/06/2025",
      generatedTime: "08:00",
      productCount: 12,
      status: "completed",
      size: "1.8 MB"
    },
    {
      id: 3,
      generatedDate: "14/06/2025",
      generatedTime: "08:00",
      productCount: 10,
      status: "completed",
      size: "1.5 MB"
    },
    {
      id: 4,
      generatedDate: "13/06/2025",
      generatedTime: "08:00",
      productCount: 8,
      status: "error",
      size: "0 MB"
    },
    {
      id: 5,
      generatedDate: "12/06/2025",
      generatedTime: "08:00",
      productCount: 14,
      status: "completed",
      size: "2.1 MB"
    },
  ];

  // Simula carregamento dos dados
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        // Simula delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simula possível erro (5% de chance)
        if (Math.random() < 0.05) {
          throw new Error("Erro ao carregar relatórios");
        }
        
        setReports(mockReports);
      } catch (err) {
        setError("Erro ao carregar relatórios");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleRefresh = () => {
    setReports([]);
    setError("");
    // Recarrega os dados
    const loadReports = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReports(mockReports);
      } catch (err) {
        setError("Erro ao carregar relatórios");
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  };

  const handleViewReport = (report: Report) => {
    if (onViewReport) {
      onViewReport(report.id, report.generatedDate);
    } else {
      // Fallback para navegação manual
      console.log("Visualizando relatório:", report.id, report.generatedDate);
    }
  };

  const handleDownloadExcel = async (reportId: number) => {
    setDownloadingId(reportId);
    try {
      // Simula download
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Download Excel do relatório:", reportId);
      
      // Simula criação e download do arquivo
      const link = document.createElement('a');
      link.download = `relatorio-${reportId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      link.href = '#'; // Em produção seria a URL real do arquivo
      link.click();
      
    } catch (err) {
      console.error("Erro no download:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadPDF = async (reportId: number) => {
    setDownloadingId(reportId);
    try {
      // Simula download
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Download PDF do relatório:", reportId);
      
      // Simula criação e download do arquivo
      const link = document.createElement('a');
      link.download = `relatorio-${reportId}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.href = '#'; // Em produção seria a URL real do arquivo
      link.click();
      
    } catch (err) {
      console.error("Erro no download:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-verde-claro text-verde-folha border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0">
            <Clock className="w-3 h-3 mr-1" />
            Processando
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
      default:
        return null;
    }
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
                  <h1 className="text-cinza-texto">Relatórios</h1>
                  <p className="text-sm text-cinza-secundario">
                    Visualize e baixe todos os relatórios gerados automaticamente
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Mensagem de erro */}
            {error && (
              <div className="mb-6">
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Card principal com a tabela */}
            <Card className="bg-branco-puro border-borda-sutil shadow-sm">
              <CardHeader>
                <CardTitle className="text-cinza-texto">Lista de Relatórios</CardTitle>
                <CardDescription className="text-cinza-secundario">
                  {isLoading 
                    ? "Carregando relatórios..."
                    : reports.length > 0
                      ? `${reports.length} relatório${reports.length !== 1 ? 's' : ''} disponível${reports.length !== 1 ? 'is' : ''}`
                      : "Nenhum relatório encontrado"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Estado de carregamento
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-verde-folha" />
                      <p className="text-sm text-cinza-secundario">Carregando relatórios...</p>
                    </div>
                  </div>
                ) : reports.length > 0 ? (
                  // Lista de relatórios
                  <div className="rounded-lg border border-borda-sutil">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cinza-claro/50">
                          <TableHead className="text-cinza-texto font-medium">Data da Geração</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Quantidade de Produtos</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Status</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Tamanho</TableHead>
                          <TableHead className="text-cinza-texto font-medium text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id} className="hover:bg-cinza-claro/30 transition-colors">
                            <TableCell className="font-medium text-cinza-texto">
                              <div className="space-y-1">
                                <div>{report.generatedDate}</div>
                                <div className="text-xs text-cinza-secundario">{report.generatedTime}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-cinza-secundario">
                              {report.productCount} produto{report.productCount !== 1 ? 's' : ''}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(report.status)}
                            </TableCell>
                            <TableCell className="text-cinza-secundario">
                              {report.size}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewReport(report)}
                                  disabled={report.status !== "completed"}
                                  className="h-8 w-8 p-0 text-cinza-secundario hover:text-verde-folha hover:bg-verde-claro"
                                  title="Visualizar relatório"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadExcel(report.id)}
                                  disabled={report.status !== "completed" || downloadingId === report.id}
                                  className="h-8 w-8 p-0 text-cinza-secundario hover:text-green-600 hover:bg-green-50"
                                  title="Baixar Excel"
                                >
                                  {downloadingId === report.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <FileSpreadsheet className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadPDF(report.id)}
                                  disabled={report.status !== "completed" || downloadingId === report.id}
                                  className="h-8 w-8 p-0 text-cinza-secundario hover:text-red-600 hover:bg-red-50"
                                  title="Baixar PDF"
                                >
                                  {downloadingId === report.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  // Estado vazio
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-cinza-claro rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-cinza-secundario" />
                      </div>
                    </div>
                    <h3 className="text-cinza-texto mb-2">Nenhum relatório gerado ainda</h3>
                    <p className="text-sm text-cinza-secundario mb-6">
                      Os relatórios são gerados automaticamente quando há produtos monitorados.<br />
                      Adicione produtos para começar a receber relatórios diários.
                    </p>
                    <Button 
                      onClick={() => onNavigateToSection("products")}
                      className="bg-verde-folha hover:bg-verde-folha/90 text-[rgba(30,58,46,1)] shadow-sm"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Gerenciar Produtos
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