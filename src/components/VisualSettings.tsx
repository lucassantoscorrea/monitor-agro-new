"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Calendar } from "./ui/calendar";
import { Progress } from "./ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, Palette, Type, Eye, RotateCcw, CheckCircle, AlertCircle, Copy, Layout, Zap, CircleIcon, Square, Triangle, Star, Heart, Smile, Sun, Moon } from "lucide-react";
import { useVisualSettings } from "./VisualSettingsContext";
import { useTheme } from "./ThemeContext";

interface VisualSettingsProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

export function VisualSettings({ onLogout, onNavigateToSection, activeSection }: VisualSettingsProps) {
  const { theme, setTheme } = useTheme();
  const { 
    fontSize, 
    setFontSize, 
    fontFamily, 
    setFontFamily,
    colorScheme,
    setColorScheme,
    animations,
    setAnimations,
    density,
    setDensity,
    contrast,
    setContrast
  } = useVisualSettings();

  const [previewMode, setPreviewMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("button");

  const fontOptions = [
    { value: "system", label: "Sistema", description: "Fonte padrão do sistema" },
    { value: "inter", label: "Inter", description: "Moderna e legível" },
    { value: "roboto", label: "Roboto", description: "Google Fonts" },
    { value: "open-sans", label: "Open Sans", description: "Humanista e amigável" },
    { value: "source-sans", label: "Source Sans Pro", description: "Adobe Fonts" }
  ];

  const colorSchemes = [
    { value: "default", label: "Padrão", color: "#16803D" },
    { value: "blue", label: "Azul", color: "#2563EB" },
    { value: "purple", label: "Roxo", color: "#7C3AED" },
    { value: "orange", label: "Laranja", color: "#EA580C" },
    { value: "red", label: "Vermelho", color: "#DC2626" }
  ];

  const densityOptions = [
    { value: "compact", label: "Compacto", description: "Mais informações em menos espaço" },
    { value: "comfortable", label: "Confortável", description: "Equilíbrio entre espaço e informação" },
    { value: "spacious", label: "Espaçoso", description: "Mais espaço entre elementos" }
  ];

  const componentPreviews = {
    button: (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Pequeno</Button>
          <Button>Médio</Button>
          <Button size="lg">Grande</Button>
        </div>
      </div>
    ),
    card: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
          <CardDescription>Descrição do card com informações adicionais</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Conteúdo do card aqui.</p>
        </CardContent>
      </Card>
    ),
    form: (
      <div className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea id="message" placeholder="Digite sua mensagem..." />
        </div>
        <Button className="w-full">Enviar</Button>
      </div>
    ),
    navigation: (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 rounded-md bg-accent">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm">Dashboard</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
          <Package className="h-4 w-4" />
          <span className="text-sm">Produtos</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
          <FileText className="h-4 w-4" />
          <span className="text-sm">Relatórios</span>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="MonitorAgro" 
              className="h-8 w-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="h-8 w-8 bg-verde-folha rounded-md items-center justify-center text-white font-semibold text-sm hidden"
              style={{ display: 'none' }}
            >
              MA
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">MonitorAgro</h1>
              <p className="text-sm text-muted-foreground">Configurações Visuais</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Sair do Preview" : "Preview"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFontSize(14);
                setFontFamily("system");
                setColorScheme("default");
                setAnimations(true);
                setDensity("comfortable");
                setContrast("normal");
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
            
            <Button onClick={onLogout} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeSection === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigateToSection("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigateToSection("products")}
            >
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </Button>
            <Button
              variant={activeSection === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigateToSection("reports")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
            <Button
              variant={activeSection === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigateToSection("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </Button>
            <Button
              variant={activeSection === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onNavigateToSection("profile")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            <Button
              variant="default"
              className="w-full justify-start"
            >
              <Palette className="mr-2 h-4 w-4" />
              Configurações Visuais
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Configurações Visuais</h2>
              <p className="text-muted-foreground">
                Personalize a aparência e comportamento da interface do MonitorAgro
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configurações */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="appearance" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="appearance">Aparência</TabsTrigger>
                    <TabsTrigger value="typography">Tipografia</TabsTrigger>
                    <TabsTrigger value="behavior">Comportamento</TabsTrigger>
                    <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-6">
                    {/* Tema */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Tema
                        </CardTitle>
                        <CardDescription>
                          Escolha entre tema claro ou escuro
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup value={theme} onValueChange={setTheme}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="flex items-center gap-2">
                              <Sun className="h-4 w-4" />
                              Claro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark" className="flex items-center gap-2">
                              <Moon className="h-4 w-4" />
                              Escuro
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <Label htmlFor="system">Sistema</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Esquema de Cores */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Esquema de Cores
                        </CardTitle>
                        <CardDescription>
                          Personalize as cores principais da interface
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {colorSchemes.map((scheme) => (
                            <div
                              key={scheme.value}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                colorScheme === scheme.value
                                  ? "border-primary bg-accent"
                                  : "border-border hover:border-muted-foreground"
                              }`}
                              onClick={() => setColorScheme(scheme.value)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 rounded-full"
                                  style={{ backgroundColor: scheme.color }}
                                />
                                <span className="font-medium">{scheme.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Densidade */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Layout className="h-5 w-5" />
                          Densidade da Interface
                        </CardTitle>
                        <CardDescription>
                          Ajuste o espaçamento entre elementos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup value={density} onValueChange={setDensity}>
                          {densityOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={option.value} />
                              <div className="flex-1">
                                <Label htmlFor={option.value} className="font-medium">
                                  {option.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-6">
                    {/* Família da Fonte */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Família da Fonte
                        </CardTitle>
                        <CardDescription>
                          Escolha a fonte principal da interface
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                <div>
                                  <div className="font-medium">{font.label}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {font.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Tamanho da Fonte */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tamanho da Fonte</CardTitle>
                        <CardDescription>
                          Ajuste o tamanho base da fonte (atual: {fontSize}px)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Slider
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                            max={20}
                            min={12}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>12px</span>
                            <span>16px</span>
                            <span>20px</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-6">
                    {/* Animações */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Animações
                        </CardTitle>
                        <CardDescription>
                          Controle as animações da interface
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="animations" className="font-medium">
                              Habilitar animações
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Transições suaves e efeitos visuais
                            </p>
                          </div>
                          <Switch
                            id="animations"
                            checked={animations}
                            onCheckedChange={setAnimations}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="accessibility" className="space-y-6">
                    {/* Contraste */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Contraste
                        </CardTitle>
                        <CardDescription>
                          Ajuste o contraste para melhor legibilidade
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup value={contrast} onValueChange={setContrast}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="normal" />
                            <Label htmlFor="normal">Normal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="high" />
                            <Label htmlFor="high">Alto contraste</Label>
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Informações de Acessibilidade */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        O MonitorAgro segue as diretrizes WCAG 2.1 para garantir acessibilidade.
                        Todas as configurações são salvas automaticamente.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Preview
                    </CardTitle>
                    <CardDescription>
                      Visualize as mudanças em tempo real
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="button">Botões</SelectItem>
                          <SelectItem value="card">Cards</SelectItem>
                          <SelectItem value="form">Formulários</SelectItem>
                          <SelectItem value="navigation">Navegação</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="p-4 border rounded-lg bg-background">
                        {componentPreviews[selectedComponent as keyof typeof componentPreviews]}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status das Configurações */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tema</span>
                      <Badge variant="secondary">{theme}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fonte</span>
                      <Badge variant="secondary">{fontSize}px</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Animações</span>
                      <Badge variant={animations ? "default" : "secondary"}>
                        {animations ? "Ativas" : "Desativadas"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Densidade</span>
                      <Badge variant="secondary">{density}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}