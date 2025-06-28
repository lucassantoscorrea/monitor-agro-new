"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, AlertCircle, Loader2, CheckCircle, Check, ChevronDown, ArrowLeft, Info, Database, PlusCircle } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';
import { type ProductToEdit } from "../App";

interface AddProductProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
  onProductAdded?: (product: { name: string; category: string; type: "mapa" | "custom" }) => void;
  onProductUpdated?: (product: { id: number; name: string; category: string; type: "mapa" | "custom" }) => void;
  productToEdit?: ProductToEdit | null;
}

// Produtos cadastrados no MAPA - expandida com mais produtos reais
const mapaProducts = [
  { value: "glifosato-480-roundup", label: "ROUNDUP WG - Glifosato 720g/kg", category: "Herbicida", brand: "Bayer" },
  { value: "glifosato-480-scout", label: "SCOUT - Glifosato 480g/L", category: "Herbicida", brand: "Monsanto" },
  { value: "2-4-d-dow", label: "DMA 806 BR - 2,4-D 670g/L", category: "Herbicida", brand: "Corteva" },
  { value: "atrazina-syngenta", label: "PRIMOLEO - Atrazina 500SC", category: "Herbicida", brand: "Syngenta" },
  { value: "paraquat-syngenta", label: "GRAMOXONE 200 - Paraquat 200g/L", category: "Herbicida", brand: "Syngenta" },
  { value: "azoxistrobina-syngenta", label: "AMISTAR - Azoxistrobina 250g/L", category: "Fungicida", brand: "Syngenta" },
  { value: "tebuconazole-bayer", label: "FOLICUR 200 CE - Tebuconazole 200g/L", category: "Fungicida", brand: "Bayer" },
  { value: "mancozebe-dow", label: "DITHANE NT - Mancozebe 750g/kg", category: "Fungicida", brand: "Corteva" },
  { value: "trifloxistrobina-bayer", label: "NATIVO - Trifloxistrobina 100g/L + Tebuconazole 200g/L", category: "Fungicida", brand: "Bayer" },
  { value: "propiconazole-syngenta", label: "TILT - Propiconazole 250g/L", category: "Fungicida", brand: "Syngenta" },
  { value: "imidacloprido-bayer", label: "CONFIDOR 700 WG - Imidacloprido 700g/kg", category: "Inseticida", brand: "Bayer" },
  { value: "bifentrina-fmc", label: "TALSTAR 100 EC - Bifentrina 100g/L", category: "Inseticida", brand: "FMC" },
  { value: "tiametoxam-syngenta", label: "ACTARA 250 WG - Tiametoxam 250g/kg", category: "Inseticida", brand: "Syngenta" },
  { value: "clorpirifos-dow", label: "LORSBAN 480 BR - Clorpirifós 480g/L", category: "Inseticida", brand: "Corteva" },
  { value: "lambda-syngenta", label: "KARATE ZEON 50 CS - Lambda-cialotrina 50g/L", category: "Inseticida", brand: "Syngenta" },
  { value: "abamectina-syngenta", label: "VERTIMEC 18 EC - Abamectina 18g/L", category: "Acaricida", brand: "Syngenta" },
  { value: "propargite-ihara", label: "OMITE 720 CE - Propargite 720g/L", category: "Acaricida", brand: "Ihara" },
  { value: "fenpiroximato-sumitomo", label: "ORTUS 50 SC - Fenpiroximato 50g/L", category: "Acaricida", brand: "Sumitomo" },
  { value: "cadusafos-fmc", label: "RUGBY 200 CS - Cadusafós 200g/L", category: "Nematicida", brand: "FMC" },
  { value: "terbufos-fmc", label: "COUNTER 150 G - Terbufós 150g/kg", category: "Nematicida", brand: "FMC" },
  { value: "fluopyram-bayer", label: "VELUM PRIME - Fluopyram 500g/L", category: "Nematicida", brand: "Bayer" },
  { value: "bacillus-koppert", label: "RIZOTEC - Bacillus amyloliquefaciens", category: "Biológico", brand: "Koppert" },
  { value: "trichoderma-koppert", label: "TRICHODERMIL SC - Trichoderma harzianum", category: "Biológico", brand: "Koppert" },
];

// Categorias expandidas para produtos não cadastrados no MAPA
const productCategories = [
  "Herbicida",
  "Fungicida", 
  "Inseticida",
  "Acaricida",
  "Nematicida",
  "Formicida",
  "Cupinicida",
  "Bactericida",
  "Biológico",
  "Adjuvante",
  "Regulador de Crescimento",
  "Dessecante",
  "Outros"
];

export function AddProduct({ onLogout, onNavigateToSection, activeSection, onProductAdded, onProductUpdated, productToEdit }: AddProductProps) {
  const [activeTab, setActiveTab] = useState("mapa");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Estados para produtos do MAPA
  const [selectedMapaProduct, setSelectedMapaProduct] = useState("");
  const [mapaProductName, setMapaProductName] = useState("");
  const [mapaCategory, setMapaCategory] = useState("");
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Estados para produtos não cadastrados
  const [customProductName, setCustomProductName] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customBrand, setCustomBrand] = useState("");

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  // Carrega dados do produto em edição
  useEffect(() => {
    if (productToEdit) {
      setIsEditMode(true);
      
      if (productToEdit.type === "mapa") {
        setActiveTab("mapa");
        
        // Tenta encontrar o produto nos dados do MAPA
        const mapaProduct = mapaProducts.find(p => p.label === productToEdit.name);
        if (mapaProduct) {
          setSelectedMapaProduct(mapaProduct.value);
          setMapaProductName(mapaProduct.label);
          setMapaCategory(mapaProduct.category);
        } else {
          // Se não encontrar, preenche com os dados salvos
          setMapaProductName(productToEdit.name);
          setMapaCategory(productToEdit.category);
        }
      } else {
        setActiveTab("custom");
        setCustomProductName(productToEdit.name);
        setCustomCategory(productToEdit.category);
        setCustomBrand(productToEdit.brand || "");
      }
    } else {
      // Limpa o modo de edição quando não há produto para editar
      setIsEditMode(false);
      clearAllFields();
    }
  }, [productToEdit]);

  const clearAllFields = () => {
    setSelectedMapaProduct("");
    setMapaProductName("");
    setMapaCategory("");
    setCustomProductName("");
    setCustomCategory("");
    setCustomBrand("");
    setSearchValue("");
    setError("");
    setSuccessMessage("");
  };

  const filteredMapaProducts = mapaProducts.filter(product =>
    product.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleMapaProductSelect = (product: typeof mapaProducts[0]) => {
    setSelectedMapaProduct(product.value);
    setMapaProductName(product.label);
    setMapaCategory(product.category);
    setOpen(false);
    setError("");
  };

  const validateMapaForm = () => {
    if (!selectedMapaProduct || !mapaProductName.trim()) {
      setError("Selecione um produto cadastrado no MAPA");
      return false;
    }
    return true;
  };

  const validateCustomForm = () => {
    if (!customProductName.trim()) {
      setError("Informe o nome do produto");
      return false;
    }
    if (!customCategory.trim()) {
      setError("Selecione a categoria do produto");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    const isMapaTab = activeTab === "mapa";
    const isValid = isMapaTab ? validateMapaForm() : validateCustomForm();
    
    if (!isValid) return;
    
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const productData = isMapaTab ? {
        name: mapaProductName,
        category: mapaCategory,
        type: "mapa" as const
      } : {
        name: customProductName,
        category: customCategory,
        type: "custom" as const
      };
      
      if (isEditMode && productToEdit) {
        // Modo edição
        const updatedProduct = {
          id: productToEdit.id,
          ...productData
        };
        
        console.log("Produto atualizado:", updatedProduct);
        
        if (onProductUpdated) {
          onProductUpdated(updatedProduct);
        }
        
        setSuccessMessage(`Produto ${isMapaTab ? 'do MAPA' : 'personalizado'} atualizado com sucesso`);
      } else {
        // Modo criação
        console.log("Produto adicionado:", productData);
        
        if (onProductAdded) {
          onProductAdded(productData);
        }
        
        setSuccessMessage(`Produto ${isMapaTab ? 'do MAPA' : 'personalizado'} adicionado com sucesso`);
      }
      
      // Redireciona após sucesso
      setTimeout(() => {
        clearAllFields();
        setSuccessMessage("");
        onNavigateToSection("products");
      }, 2000);
      
    } catch (err) {
      setError("Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clearAllFields();
    onNavigateToSection("products");
  };

  const getPageTitle = () => {
    return isEditMode ? "Editar Produto" : "Adicionar Produto";
  };

  const getPageDescription = () => {
    return isEditMode 
      ? "Modifique as informações do produto selecionado"
      : "Escolha entre produtos cadastrados no MAPA ou produtos personalizados";
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return isEditMode ? "Salvando Alterações..." : "Adicionando Produto...";  
    }
    
    const isMapaTab = activeTab === "mapa";
    const productType = isMapaTab ? "do MAPA" : "Personalizado";
    
    return isEditMode 
      ? `Salvar Produto ${productType}`
      : `Adicionar Produto ${productType}`;
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-cinza-secundario hover:text-cinza-texto hover:bg-cinza-claro p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-cinza-texto">{getPageTitle()}</h1>
                <p className="text-sm text-cinza-secundario">
                  {getPageDescription()}
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            <div className="max-w-4xl mx-auto">
              {/* Mensagens de feedback */}
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

              {error && (
                <div className="mb-6">
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Indicador de modo de edição */}
              {isEditMode && (
                <div className="mb-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Modo de Edição:</strong> Você está editando um produto existente. 
                      Modifique os campos necessários e clique em salvar.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Card principal com abas */}
              <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                <CardHeader>
                  <CardTitle className="text-cinza-texto">
                    {isEditMode ? "Editar Informações" : "Informações do Produto"}
                  </CardTitle>
                  <CardDescription className="text-cinza-secundario">
                    {isEditMode 
                      ? "Modifique as informações do produto conforme necessário"
                      : "Escolha o tipo de produto que deseja monitorar"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="mapa" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Produtos do MAPA
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Produto Personalizado
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="mapa" className="space-y-6">
                      {/* Informativo sobre produtos do MAPA */}
                      <Alert className="bg-[rgba(30,41,59,1)] border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-[rgba(219,234,254,1)]">
                          <strong>Produtos cadastrados no MAPA:</strong> Lista oficial de defensivos agrícolas 
                          registrados no Ministério da Agricultura. Estes produtos têm monitoramento mais preciso 
                          pois possuem dados oficiais completos.
                        </AlertDescription>
                      </Alert>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Seleção de produto do MAPA */}
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Produto Registrado no MAPA</Label>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between text-left font-normal border-borda-sutil hover:bg-cinza-claro"
                                disabled={isLoading}
                              >
                                {mapaProductName || "Busque por nome, marca ou categoria..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput 
                                  placeholder="Digite para buscar..." 
                                  value={searchValue}
                                  onValueChange={setSearchValue}
                                />
                                <CommandList>
                                  <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredMapaProducts.map((product) => (
                                      <CommandItem
                                        key={product.value}
                                        onSelect={() => handleMapaProductSelect(product)}
                                        className="cursor-pointer flex flex-col items-start p-3"
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            selectedMapaProduct === product.value ? "opacity-100" : "opacity-0"
                                          }`}
                                        />
                                        <div className="flex flex-col gap-1">
                                          <span className="font-medium">{product.label}</span>
                                          <div className="flex gap-2 text-xs">
                                            <span className="bg-verde-claro text-verde-folha px-2 py-1 rounded">
                                              {product.category}
                                            </span>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                              {product.brand}
                                            </span>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Categoria automática */}
                        {mapaCategory && (
                          <div className="space-y-2">
                            <Label className="text-cinza-texto">Categoria (automática)</Label>
                            <div className="p-3 bg-verde-claro/50 border border-verde-folha/20 rounded-lg">
                              <span className="text-verde-folha font-medium">{mapaCategory}</span>
                            </div>
                          </div>
                        )}

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button 
                            type="submit" 
                            className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm flex-1" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {getSubmitButtonText()}
                              </>
                            ) : (
                              getSubmitButtonText()
                            )}
                          </Button>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isLoading}
                            className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-6">
                      {/* Informativo sobre produtos personalizados */}
                      <Alert className="bg-orange-50 border-orange-200">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          <strong>Produtos não cadastrados no MAPA:</strong> Produtos importados, formulações 
                          especiais ou defensivos não registrados oficialmente. O monitoramento pode ser menos 
                          preciso por depender de dados não oficiais.
                        </AlertDescription>
                      </Alert>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nome do produto personalizado */}
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Nome do Produto</Label>
                          <Input
                            placeholder="Ex: Herbicida Importado XYZ 500g/L"
                            value={customProductName}
                            onChange={(e) => setCustomProductName(e.target.value)}
                            disabled={isLoading}
                            className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          />
                        </div>

                        {/* Categoria do produto */}
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Categoria *</Label>
                          <Select
                            value={customCategory}
                            onValueChange={setCustomCategory}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                              <SelectValue placeholder="Selecione a categoria do produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {productCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Marca/Fabricante (opcional) */}
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">
                            Marca/Fabricante 
                            <span className="text-cinza-secundario ml-1">(opcional)</span>
                          </Label>
                          <Input
                            placeholder="Ex: Bayer, Syngenta, FMC..."
                            value={customBrand}
                            onChange={(e) => setCustomBrand(e.target.value)}
                            disabled={isLoading}
                            className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          />
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button 
                            type="submit" 
                            className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm flex-1" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {getSubmitButtonText()}
                              </>
                            ) : (
                              getSubmitButtonText()
                            )}
                          </Button>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isLoading}
                            className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}