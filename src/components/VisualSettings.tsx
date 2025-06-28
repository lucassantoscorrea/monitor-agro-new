"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, Palette, Type, Eye, Download, Upload, RotateCcw, CheckCircle, AlertCircle, Copy, RefreshCw, Sliders, Layout, Zap, CircleIcon, Square, Triangle, Star, Heart, Smile, Sun, Moon } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';
import { useVisualSettings } from "./VisualSettingsContext";
import { useTheme } from "./ThemeContext";

interface VisualSettingsProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

export function VisualSettings({ onLogout, onNavigateToSection, activeSection }: VisualSettingsProps) {
  const { settings, updateSettings, resetToDefault, exportSettings, importSettings } = useVisualSettings();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("colors");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage("");
    } else {
      setSuccessMessage(message);
      setError("");
    }
    
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 3000);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    const colorScheme = theme === "dark" ? "darkMode" : "lightMode";
    updateSettings({
      [colorScheme]: {
        ...settings[colorScheme],
        [colorKey]: value,
      },
    });
  };

  const handleTypographyChange = (category: string, key: string, value: any) => {
    updateSettings({
      typography: {
        ...settings.typography,
        [category]: {
          ...settings.typography[category as keyof typeof settings.typography],
          [key]: value,
        },
      },
    });
  };

  const handleExportSettings = () => {
    const settingsJson = exportSettings();
    navigator.clipboard.writeText(settingsJson).then(() => {
      showMessage("Configurações copiadas para a área de transferência");
    }).catch(() => {
      showMessage("Erro ao copiar configurações", true);
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importSettings(content)) {
          showMessage("Configurações importadas com sucesso");
        } else {
          showMessage("Erro ao importar configurações", true);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm("Tem certeza que deseja restaurar todas as configurações para o padrão?")) {
      resetToDefault();
      showMessage("Configurações restauradas para o padrão");
    }
  };

  const currentColors = theme === "dark" ? settings.darkMode : settings.lightMode;

  const fontOptions = [
    { value: "Open Sans", label: "Open Sans" },
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Lato", label: "Lato" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Source Sans Pro", label: "Source Sans Pro" },
    { value: "Ubuntu", label: "Ubuntu" },
  ];

  const iconStyleOptions = [
    { value: "outline", label: "Contorno", icon: CircleIcon },
    { value: "filled", label: "Preenchido", icon: Square },
    { value: "duotone", label: "Duotone", icon: Triangle },
  ];

  const colorLabels = {
    primary: "Cor Primária",
    secondary: "Cor Secundária", 
    accent: "Cor de Destaque",
    background: "Fundo",
    foreground: "Texto Principal",
    muted: "Texto Secundário",
    border: "Bordas",
    success: "Sucesso",
    warning: "Aviso",
    error: "Erro",
    info: "Informação"
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
                  <h1 className="text-cinza-texto">Configurações Visuais</h1>
                  <p className="text-sm text-cinza-secundario">
                    Personalize a aparência e identidade visual do sistema
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant="outline"
                  size="sm"
                  className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? "Sair do Preview" : "Preview"}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            <div className="max-w-6xl mx-auto">
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

              {/* Abas principais */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="colors" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Cores
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Tipografia
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="transitions" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Transições
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Gerenciar
                  </TabsTrigger>
                </TabsList>

                {/* Aba Cores */}
                <TabsContent value="colors" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Seletor de Tema */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Tema do Sistema
                        </CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Escolha entre o modo claro ou escuro
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Modo Claro */}
                          <div 
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              theme === "light" 
                                ? "border-verde-folha bg-verde-claro/30" 
                                : "border-borda-sutil hover:border-verde-folha/50"
                            }`}
                            onClick={() => setTheme("light")}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-yellow-100 rounded-lg">
                                <Sun className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-cinza-texto">Modo Claro</h3>
                                <p className="text-sm text-cinza-secundario">Tema padrão com cores claras</p>
                              </div>
                              {theme === "light" && (
                                <CheckCircle className="w-5 h-5 text-verde-folha ml-auto flex-shrink-0" />
                              )}
                            </div>
                            <div className="bg-white border border-gray-200 rounded p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-verde-folha rounded-full"></div>
                                <div className="w-16 h-2 bg-gray-200 rounded"></div>
                              </div>
                              <div className="space-y-1">
                                <div className="w-full h-2 bg-gray-100 rounded"></div>
                                <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                              </div>
                            </div>
                          </div>

                          {/* Modo Escuro */}
                          <div 
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              theme === "dark" 
                                ? "border-verde-folha bg-verde-claro/30" 
                                : "border-borda-sutil hover:border-verde-folha/50"
                            }`}
                            onClick={() => setTheme("dark")}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-slate-800 rounded-lg">
                                <Moon className="w-5 h-5 text-slate-300" />
                              </div>
                              <div>
                                <h3 className="font-medium text-cinza-texto">Modo Escuro</h3>
                                <p className="text-sm text-cinza-secundario">Ideal para ambientes com pouca luz</p>
                              </div>
                              {theme === "dark" && (
                                <CheckCircle className="w-5 h-5 text-verde-folha ml-auto flex-shrink-0" />
                              )}
                            </div>
                            <div className="bg-slate-800 border border-slate-700 rounded p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <div className="w-16 h-2 bg-slate-600 rounded"></div>
                              </div>
                              <div className="space-y-1">
                                <div className="w-full h-2 bg-slate-700 rounded"></div>
                                <div className="w-3/4 h-2 bg-slate-700 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cores Principais */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Cores Principais
                        </CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Configure as cores base do sistema para o tema {theme === "dark" ? "escuro" : "claro"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(currentColors).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label className="text-cinza-texto">
                              {colorLabels[key as keyof typeof colorLabels] || key}
                            </Label>
                            <div className="flex items-center gap-3">
                              <Input
                                type="color"
                                value={value}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="w-12 h-8 p-0 border-0 rounded cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={value}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro font-mono text-sm"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Preview das Cores */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto">Preview das Cores</CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Visualize como as cores ficam aplicadas nos componentes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Botões de exemplo */}
                        <div className="space-y-3">
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              style={{ backgroundColor: currentColors.primary, color: "#ffffff" }}
                              size="sm"
                            >
                              Primário
                            </Button>
                            <Button 
                              variant="outline"
                              style={{ 
                                borderColor: currentColors.border,
                                color: currentColors.foreground,
                                backgroundColor: currentColors.secondary
                              }}
                              size="sm"
                            >
                              Secundário
                            </Button>
                            <Button 
                              style={{ 
                                backgroundColor: currentColors.success,
                                color: "#ffffff"
                              }}
                              size="sm"
                            >
                              Sucesso
                            </Button>
                          </div>
                          
                          {/* Card de exemplo */}
                          <div 
                            className="p-4 rounded-lg border"
                            style={{ 
                              backgroundColor: currentColors.background,
                              borderColor: currentColors.border,
                              color: currentColors.foreground
                            }}
                          >
                            <h3 className="font-semibold mb-2">Card de Exemplo</h3>
                            <p style={{ color: currentColors.muted }}>
                              Este é um exemplo de como as cores ficam aplicadas nos componentes do sistema.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Aba Tipografia */}
                <TabsContent value="typography" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configurações de Fonte */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto flex items-center gap-2">
                          <Type className="w-5 h-5" />
                          Configurações de Fonte
                        </CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Personalize a tipografia do sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Família da Fonte */}
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Família da Fonte</Label>
                          <Select
                            value={settings.typography.fontFamily}
                            onValueChange={(value) => handleTypographyChange("fontFamily", "", value)}
                          >
                            <SelectTrigger className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fontOptions.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tamanhos de Fonte */}
                        <div className="space-y-4">
                          <Label className="text-cinza-texto">Tamanhos de Fonte</Label>
                          {Object.entries(settings.typography.fontSize).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <Label className="w-16 text-sm text-cinza-secundario capitalize">
                                {key}
                              </Label>
                              <Input
                                type="text"
                                value={value}
                                onChange={(e) => handleTypographyChange("fontSize", key, e.target.value)}
                                className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro font-mono text-sm"
                                placeholder="1rem"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Pesos de Fonte */}
                        <div className="space-y-4">
                          <Label className="text-cinza-texto">Pesos de Fonte</Label>
                          {Object.entries(settings.typography.fontWeight).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <Label className="w-16 text-sm text-cinza-secundario capitalize">
                                {key}
                              </Label>
                              <Slider
                                value={[value]}
                                onValueChange={([newValue]) => handleTypographyChange("fontWeight", key, newValue)}
                                min={100}
                                max={900}
                                step={100}
                                className="flex-1"
                              />
                              <span className="w-12 text-sm text-cinza-secundario">{value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Preview Tipografia */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto">Preview Tipografia</CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Visualize como a tipografia fica aplicada
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div 
                          className="space-y-4"
                          style={{ fontFamily: settings.typography.fontFamily }}
                        >
                          <div>
                            <h1 style={{ 
                              fontSize: settings.typography.fontSize.xxl,
                              fontWeight: settings.typography.fontWeight.bold,
                              marginBottom: "0.5rem"
                            }}>
                              Título Principal
                            </h1>
                            <h2 style={{ 
                              fontSize: settings.typography.fontSize.xl,
                              fontWeight: settings.typography.fontWeight.semibold,
                              marginBottom: "0.5rem"
                            }}>
                              Subtítulo
                            </h2>
                            <p style={{ 
                              fontSize: settings.typography.fontSize.base,
                              fontWeight: settings.typography.fontWeight.normal,
                              lineHeight: settings.typography.lineHeight.normal
                            }}>
                              Este é um parágrafo de exemplo usando as configurações de tipografia personalizadas.
                            </p>
                            <small style={{ 
                              fontSize: settings.typography.fontSize.small,
                              fontWeight: settings.typography.fontWeight.normal
                            }}>
                              Texto pequeno para legendas e observações.
                            </small>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Aba Layout */}
                <TabsContent value="layout" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Configurações de Layout */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto flex items-center gap-2">
                          <Layout className="w-5 h-5" />
                          Configurações de Layout
                        </CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Ajuste espaçamentos, bordas e sombras
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Border Radius */}
                        <div className="space-y-4">
                          <Label className="text-cinza-texto">Raio das Bordas</Label>
                          {Object.entries(settings.layout.borderRadius).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <Label className="w-16 text-sm text-cinza-secundario capitalize">
                                {key}
                              </Label>
                              <Input
                                type="text"
                                value={value}
                                onChange={(e) => updateSettings({
                                  layout: {
                                    ...settings.layout,
                                    borderRadius: {
                                      ...settings.layout.borderRadius,
                                      [key]: e.target.value
                                    }
                                  }
                                })}
                                className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro font-mono text-sm"
                                placeholder="0.5rem"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Espaçamentos */}
                        <div className="space-y-4">
                          <Label className="text-cinza-texto">Espaçamentos</Label>
                          {Object.entries(settings.layout.spacing).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                              <Label className="w-16 text-sm text-cinza-secundario uppercase">
                                {key}
                              </Label>
                              <Input
                                type="text"
                                value={value}
                                onChange={(e) => updateSettings({
                                  layout: {
                                    ...settings.layout,
                                    spacing: {
                                      ...settings.layout.spacing,
                                      [key]: e.target.value
                                    }
                                  }
                                })}
                                className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro font-mono text-sm"
                                placeholder="1rem"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Configurações de Ícones */}
                        <div className="space-y-4">
                          <Label className="text-cinza-texto">Ícones</Label>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Label className="w-24 text-sm text-cinza-secundario">Estilo</Label>
                              <Select
                                value={settings.icons.style}
                                onValueChange={(value: 'outline' | 'filled' | 'duotone') => updateSettings({
                                  icons: { ...settings.icons, style: value }
                                })}
                              >
                                <SelectTrigger className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {iconStyleOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">
                                        <option.icon className="w-4 h-4" />
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center gap-3">
                              <Label className="w-24 text-sm text-cinza-secundario">Espessura</Label>
                              <Slider
                                value={[settings.icons.strokeWidth]}
                                onValueChange={([value]) => updateSettings({
                                  icons: { ...settings.icons, strokeWidth: value }
                                })}
                                min={1}
                                max={4}
                                step={0.5}
                                className="flex-1"
                              />
                              <span className="w-12 text-sm text-cinza-secundario">
                                {settings.icons.strokeWidth}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Preview Layout */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto">Preview Layout</CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Visualize as configurações de layout aplicadas
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          {/* Cards com diferentes border radius */}
                          <div className="space-y-2">
                            <Label className="text-cinza-secundario text-sm">Border Radius</Label>
                            <div className="flex gap-2">
                              <div 
                                className="p-3 bg-cinza-claro text-cinza-texto text-xs flex items-center justify-center"
                                style={{ borderRadius: settings.layout.borderRadius.small }}
                              >
                                Small
                              </div>
                              <div 
                                className="p-3 bg-cinza-claro text-cinza-texto text-xs flex items-center justify-center"
                                style={{ borderRadius: settings.layout.borderRadius.medium }}
                              >
                                Medium
                              </div>
                              <div 
                                className="p-3 bg-cinza-claro text-cinza-texto text-xs flex items-center justify-center"
                                style={{ borderRadius: settings.layout.borderRadius.large }}
                              >
                                Large
                              </div>
                            </div>
                          </div>

                          {/* Espaçamentos */}
                          <div className="space-y-2">
                            <Label className="text-cinza-secundario text-sm">Espaçamentos</Label>
                            <div className="space-y-1">
                              {Object.entries(settings.layout.spacing).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-xs text-cinza-secundario w-6 uppercase">{key}</span>
                                  <div 
                                    className="bg-verde-claro"
                                    style={{ width: value, height: "8px", borderRadius: "2px" }}
                                  />
                                  <span className="text-xs text-cinza-secundario">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Preview de ícones */}
                          <div className="space-y-2">
                            <Label className="text-cinza-secundario text-sm">Ícones</Label>
                            <div className="flex gap-2 items-center">
                              <Star 
                                className="text-cinza-texto"
                                style={{ 
                                  width: settings.icons.size.small,
                                  height: settings.icons.size.small,
                                  strokeWidth: settings.icons.strokeWidth
                                }}
                              />
                              <Heart 
                                className="text-cinza-texto"
                                style={{ 
                                  width: settings.icons.size.medium,
                                  height: settings.icons.size.medium,
                                  strokeWidth: settings.icons.strokeWidth
                                }}
                              />
                              <Smile 
                                className="text-cinza-texto"
                                style={{ 
                                  width: settings.icons.size.large,
                                  height: settings.icons.size.large,
                                  strokeWidth: settings.icons.strokeWidth
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Aba Transições */}
                <TabsContent value="transitions" className="space-y-6">
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Configurações de Transições
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Personalize as animações e transições do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Durações */}
                      <div className="space-y-4">
                        <Label className="text-cinza-texto">Durações</Label>
                        {Object.entries(settings.transitions.duration).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            <Label className="w-16 text-sm text-cinza-secundario capitalize">
                              {key}
                            </Label>
                            <Input
                              type="text"
                              value={value}
                              onChange={(e) => updateSettings({
                                transitions: {
                                  ...settings.transitions,
                                  duration: {
                                    ...settings.transitions.duration,
                                    [key]: e.target.value
                                  }
                                }
                              })}
                              className="flex-1 border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro font-mono text-sm"
                              placeholder="300ms"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Timing Function */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">Função de Timing</Label>
                        <Select
                          value={settings.transitions.timing}
                          onValueChange={(value) => updateSettings({
                            transitions: { ...settings.transitions, timing: value }
                          })}
                        >
                          <SelectTrigger className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ease">Ease</SelectItem>
                            <SelectItem value="ease-in">Ease In</SelectItem>
                            <SelectItem value="ease-out">Ease Out</SelectItem>
                            <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="cubic-bezier(0.4, 0, 0.2, 1)">Cubic Bezier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Preview de Transições */}
                      <div className="space-y-4">
                        <Label className="text-cinza-texto">Preview</Label>
                        <div className="flex gap-4">
                          <div 
                            className="w-16 h-16 bg-verde-folha rounded cursor-pointer hover:scale-110 hover:rotate-12"
                            style={{
                              transition: `transform ${settings.transitions.duration.normal} ${settings.transitions.timing}`
                            }}
                          />
                          <div 
                            className="w-16 h-16 bg-laranja-alerta rounded cursor-pointer hover:bg-opacity-70"
                            style={{
                              transition: `background-color ${settings.transitions.duration.normal} ${settings.transitions.timing}`
                            }}
                          />
                          <div 
                            className="w-16 h-16 bg-cinza-claro border-2 border-transparent rounded cursor-pointer hover:border-verde-folha"
                            style={{
                              transition: `border-color ${settings.transitions.duration.normal} ${settings.transitions.timing}`
                            }}
                          />
                        </div>
                        <p className="text-sm text-cinza-secundario">
                          Passe o mouse sobre os elementos para ver as transições
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Aba Gerenciar */}
                <TabsContent value="export" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Exportar/Importar */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Gerenciar Configurações
                        </CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Exporte, importe ou restaure suas configurações
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          onClick={handleExportSettings}
                          className="w-full bg-verde-folha hover:bg-verde-folha/90 text-white"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Exportar Configurações
                        </Button>

                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Importar Configurações</Label>
                          <Input
                            type="file"
                            accept=".json"
                            onChange={handleImportSettings}
                            className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          />
                        </div>

                        <Separator />

                        <Button
                          onClick={handleResetSettings}
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restaurar Padrão
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Informações */}
                    <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-cinza-texto">Informações</CardTitle>
                        <CardDescription className="text-cinza-secundario">
                          Detalhes sobre as configurações visuais
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-cinza-secundario">Tema Atual:</span>
                            <span className="text-cinza-texto capitalize">{theme}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-cinza-secundario">Fonte:</span>
                            <span className="text-cinza-texto">{settings.typography.fontFamily}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-cinza-secundario">Cor Primária:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: currentColors.primary }}
                              />
                              <span className="text-cinza-texto font-mono text-xs">
                                {currentColors.primary}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-cinza-secundario">Transição:</span>
                            <span className="text-cinza-texto">{settings.transitions.duration.normal}</span>
                          </div>
                        </div>

                        <Separator />

                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <strong>Dica:</strong> Use o modo Preview para ver como as alterações ficam aplicadas no sistema antes de salvar.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}