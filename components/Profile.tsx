"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, User, Mail, Building2, Shield, CheckCircle, Loader2, LogOut, AlertCircle, Key, Database, Copy, RefreshCw, Eye, EyeOff, Link, Moon, Sun, Palette } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';
import { useTheme } from "./ThemeContext";

interface Organization {
  id: number;
  name: string;
  role: "admin" | "manager" | "user" | "viewer";
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  currentOrganization: Organization;
  availableOrganizations: Organization[];
  globalRole: "admin" | "manager" | "user" | "viewer";
}

interface MenorPrecoCredentials {
  username: string;
  password: string;
  isConfigured: boolean;
}

interface ProfileProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

export function Profile({ onLogout, onNavigateToSection, activeSection }: ProfileProps) {
  // Hook do tema
  const { theme, toggleTheme, setTheme } = useTheme();

  // Estados
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  // Estados para credenciais do Menor Preço
  const [menorPrecoCredentials, setMenorPrecoCredentials] = useState<MenorPrecoCredentials>({
    username: "",
    password: "",
    isConfigured: false
  });
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para gerador de senha
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Formulário perfil
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationId: "",
    permission: ""
  });

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  // Mock data - simula dados do usuário
  const mockUserProfile: UserProfile = {
    id: 1,
    name: "João Silva",
    email: "joao.silva@agronegocios.com.br",
    currentOrganization: {
      id: 1,
      name: "AgroNegócios MT Ltda",
      role: "manager"
    },
    availableOrganizations: [
      { id: 1, name: "AgroNegócios MT Ltda", role: "manager" },
      { id: 2, name: "Campo Verde Distribuidora", role: "user" },
      { id: 3, name: "Cooperativa Rural Centro-Oeste", role: "viewer" }
    ],
    globalRole: "manager"
  };

  // Mock data para credenciais do Menor Preço
  const mockMenorPrecoCredentials: MenorPrecoCredentials = {
    username: "joao.silva.agro",
    password: "••••••••••••",
    isConfigured: true
  };

  // Simula carregamento dos dados do perfil
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        // Simula delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUserProfile(mockUserProfile);
        setFormData({
          name: mockUserProfile.name,
          email: mockUserProfile.email,
          organizationId: mockUserProfile.currentOrganization.id.toString(),
          permission: mockUserProfile.currentOrganization.role
        });
        
        setMenorPrecoCredentials(mockMenorPrecoCredentials);
        
      } catch (err) {
        setError("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    setSuccessMessage("");
  };

  const handleOrganizationChange = (organizationId: string) => {
    const selectedOrg = userProfile?.availableOrganizations.find(org => org.id.toString() === organizationId);
    if (selectedOrg) {
      setFormData(prev => ({
        ...prev,
        organizationId,
        permission: selectedOrg.role
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    if (!formData.email.trim()) {
      setError("E-mail é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("E-mail inválido");
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setError("");
    setSuccessMessage("");
    
    try {
      // Simula salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Salvando alterações:", formData);
      
      // Atualiza o perfil local
      if (userProfile) {
        const selectedOrg = userProfile.availableOrganizations.find(
          org => org.id.toString() === formData.organizationId
        );
        
        const updatedProfile: UserProfile = {
          ...userProfile,
          name: formData.name,
          email: formData.email,
          currentOrganization: selectedOrg || userProfile.currentOrganization
        };
        
        setUserProfile(updatedProfile);
      }
      
      setSuccessMessage("Alterações salvas com sucesso");
      
      // Remove mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      setError("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMenorPrecoCredentials = async () => {
    if (!menorPrecoCredentials.username.trim()) {
      setError("Nome de usuário é obrigatório");
      return;
    }
    if (!menorPrecoCredentials.password.trim()) {
      setError("Senha é obrigatória");
      return;
    }

    setIsSavingCredentials(true);
    setError("");
    setSuccessMessage("");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Salvando credenciais do Menor Preço:", {
        username: menorPrecoCredentials.username,
        password: "••••••••" // Não loga a senha real
      });

      setMenorPrecoCredentials(prev => ({ ...prev, isConfigured: true }));
      setSuccessMessage("Credenciais do sistema Menor Preço salvas com sucesso");
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {
      setError("Erro ao salvar credenciais. Tente novamente.");
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const generatePassword = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let charset = "";
      if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (includeNumbers) charset += "0123456789";
      if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
      
      if (charset === "") {
        setError("Selecione pelo menos um tipo de caractere");
        return;
      }
      
      let password = "";
      for (let i = 0; i < passwordLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      setGeneratedPassword(password);
      setError("");
      
    } catch (err) {
      setError("Erro ao gerar senha");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage("Senha copiada para a área de transferência");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setError("Erro ao copiar senha");
    }
  };

  const useGeneratedPassword = () => {
    setMenorPrecoCredentials(prev => ({ ...prev, password: generatedPassword }));
    setActiveTab("menor-preco");
    setSuccessMessage("Senha aplicada às credenciais do Menor Preço");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleLogoutAccount = () => {
    // Confirma se deseja sair
    if (window.confirm("Tem certeza que deseja sair da conta?")) {
      onLogout();
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setSuccessMessage(`Tema alterado para ${newTheme === "dark" ? "escuro" : "claro"} com sucesso`);
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "user":
        return "Usuário";
      case "viewer":
        return "Visualizador";
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-verde-claro text-verde-folha";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isFieldDisabled = () => {
    return userProfile?.currentOrganization.role === "viewer";
  };

  const canEditPermissions = () => {
    return userProfile?.currentOrganization.role === "manager" || userProfile?.currentOrganization.role === "admin";
  };

  if (isLoading) {
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

          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-verde-folha" />
              <p className="text-sm text-cinza-secundario">Carregando perfil...</p>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

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
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-cinza-texto">Meu Perfil</h1>
                <p className="text-sm text-cinza-secundario">
                  Gerencie suas informações pessoais, credenciais e configurações
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

              {/* Abas principais */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Aparência
                  </TabsTrigger>
                  <TabsTrigger value="menor-preco" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Sistema Menor Preço
                  </TabsTrigger>
                  <TabsTrigger value="password-generator" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Gerador de Senha
                  </TabsTrigger>
                </TabsList>

                {/* Aba Perfil */}
                <TabsContent value="profile" className="space-y-6">
                  {/* Aviso para visualizadores */}
                  {isFieldDisabled() && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        Suas permissões são somente de visualização. Para editar informações, entre em contato com o administrador.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Card de informações pessoais */}
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informações Pessoais
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Mantenha suas informações sempre atualizadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Campo Nome */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">Nome</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={isFieldDisabled() || isSaving}
                          className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          placeholder="Digite seu nome completo"
                        />
                      </div>

                      {/* Campo E-mail */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">E-mail</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={isFieldDisabled() || isSaving}
                          className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          placeholder="Digite seu e-mail"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card de organização e permissões */}
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Organização e Permissões
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Gerencie sua organização atual e nível de acesso
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Campo Organização */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">Organização atual</Label>
                        <Select
                          value={formData.organizationId}
                          onValueChange={handleOrganizationChange}
                          disabled={isFieldDisabled() || isSaving}
                        >
                          <SelectTrigger className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                            <SelectValue placeholder="Selecione uma organização" />
                          </SelectTrigger>
                          <SelectContent>
                            {userProfile?.availableOrganizations.map((org) => (
                              <SelectItem key={org.id} value={org.id.toString()}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{org.name}</span>
                                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getRoleBadgeColor(org.role)}`}>
                                    {getRoleLabel(org.role)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Campo Permissão (apenas para gerentes) */}
                      {canEditPermissions() && (
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">
                            Permissão 
                            <span className="text-cinza-secundario ml-1">(apenas para gerentes)</span>
                          </Label>
                          <Select
                            value={formData.permission}
                            onValueChange={(value) => handleInputChange("permission", value)}
                            disabled={isFieldDisabled() || isSaving}
                          >
                            <SelectTrigger className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-purple-600" />
                                  Administrador
                                </div>
                              </SelectItem>
                              <SelectItem value="manager">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-blue-600" />
                                  Gerente
                                </div>
                              </SelectItem>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-verde-folha" />
                                  Usuário
                                </div>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-600" />
                                  Visualizador
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-cinza-secundario">
                            Altere as permissões de acesso conforme necessário
                          </p>
                        </div>
                      )}

                      {/* Informação da permissão atual (para não-gerentes) */}
                      {!canEditPermissions() && (
                        <div className="space-y-2">
                          <Label className="text-cinza-texto">Sua permissão atual</Label>
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getRoleBadgeColor(formData.permission)}`}>
                            <Shield className="w-4 h-4" />
                            {getRoleLabel(formData.permission)}
                          </div>
                          <p className="text-xs text-cinza-secundario">
                            Para alterar permissões, entre em contato com o administrador
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Botões de ação */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleSaveChanges}
                      disabled={isFieldDisabled() || isSaving}
                      className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm flex-1"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando alterações...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Salvar alterações
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={handleLogoutAccount}
                      variant="destructive"
                      disabled={isSaving}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair da conta
                    </Button>
                  </div>
                </TabsContent>

                {/* Aba Aparência */}
                <TabsContent value="appearance" className="space-y-6">
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Preferências de Aparência
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Personalize a aparência do sistema conforme sua preferência
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Informativo sobre o tema */}
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Tema do Sistema:</strong> Escolha entre o modo claro (padrão) ou escuro para uma experiência visual mais confortável, especialmente em ambientes com pouca luz.
                        </AlertDescription>
                      </Alert>

                      {/* Seleção de tema */}
                      <div className="space-y-4">
                        <Label className="text-cinza-texto">Tema do sistema</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Modo Claro */}
                          <div 
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              theme === "light" 
                                ? "border-verde-folha bg-verde-claro/30" 
                                : "border-borda-sutil hover:border-verde-folha/50"
                            }`}
                            onClick={() => handleThemeChange("light")}
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
                            onClick={() => handleThemeChange("dark")}
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

                        {/* Alternativa com Switch */}
                        <div className="flex items-center justify-between p-4 bg-cinza-claro rounded-lg">
                          <div className="flex items-center gap-3">
                            {theme === "dark" ? (
                              <Moon className="w-5 h-5 text-cinza-secundario" />
                            ) : (
                              <Sun className="w-5 h-5 text-yellow-600" />
                            )}
                            <div>
                              <Label className="text-cinza-texto">Alternar tema rapidamente</Label>
                              <p className="text-sm text-cinza-secundario">
                                {theme === "dark" ? "Modo escuro ativo" : "Modo claro ativo"}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={theme === "dark"}
                            onCheckedChange={toggleTheme}
                            aria-label="Alternar entre modo claro e escuro"
                          />
                        </div>

                        <p className="text-xs text-cinza-secundario">
                          Sua preferência de tema será salva e aplicada automaticamente nas próximas sessões.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Aba Sistema Menor Preço */}
                <TabsContent value="menor-preco" className="space-y-6">
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Credenciais do Sistema Menor Preço
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Configure suas credenciais para acesso automático ao sistema oficial do Menor Preço
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Informativo */}
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Importante:</strong> Essas credenciais serão usadas pelo robô para acessar automaticamente 
                          o sistema Menor Preço e buscar os preços dos produtos. Use credenciais exclusivas para maior segurança.
                        </AlertDescription>
                      </Alert>

                      {/* Status de configuração */}
                      {menorPrecoCredentials.isConfigured && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-700">
                            Credenciais configuradas e funcionando corretamente
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Campo usuário */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">Nome de usuário</Label>
                        <Input
                          value={menorPrecoCredentials.username}
                          onChange={(e) => setMenorPrecoCredentials(prev => ({ ...prev, username: e.target.value }))}
                          disabled={isSavingCredentials}
                          className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                          placeholder="Digite seu usuário do sistema Menor Preço"
                        />
                      </div>

                      {/* Campo senha */}
                      <div className="space-y-2">
                        <Label className="text-cinza-texto">Senha</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={menorPrecoCredentials.password}
                              onChange={(e) => setMenorPrecoCredentials(prev => ({ ...prev, password: e.target.value }))}
                              disabled={isSavingCredentials}
                              className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro pr-10"
                              placeholder="Digite sua senha do sistema Menor Preço"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-cinza-secundario" />
                              ) : (
                                <Eye className="h-4 w-4 text-cinza-secundario" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-cinza-secundario">
                          Recomendamos usar uma senha exclusiva gerada no "Gerador de Senha"
                        </p>
                      </div>

                      {/* Link para o sistema */}
                      <div className="p-3 bg-cinza-claro rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-cinza-texto">
                          <Link className="w-4 h-4" />
                          <span>Acesse o sistema em:</span>
                          <a 
                            href="https://www.menorpreco.gov.br" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-verde-folha hover:underline"
                          >
                            www.menorpreco.gov.br
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Botão de salvar */}
                  <Button 
                    onClick={handleSaveMenorPrecoCredentials}
                    disabled={isSavingCredentials}
                    className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm w-full"
                  >
                    {isSavingCredentials ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando credenciais...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Salvar credenciais
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Aba Gerador de Senha */}
                <TabsContent value="password-generator" className="space-y-6">
                  <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-cinza-texto flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Gerador de Senha Segura
                      </CardTitle>
                      <CardDescription className="text-cinza-secundario">
                        Gere senhas fortes e exclusivas para proteger sua conta do sistema Menor Preço
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Informativo */}
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          <strong>Recomendação de Segurança:</strong> Use uma senha exclusiva para o sistema Menor Preço. 
                          Evite reutilizar suas senhas habituais para proteger suas contas pessoais.
                        </AlertDescription>
                      </Alert>

                      {/* Configurações da senha */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-cinza-texto">Comprimento da senha: {passwordLength}</Label>
                            <input
                              type="range"
                              min="8"
                              max="32"
                              value={passwordLength}
                              onChange={(e) => setPasswordLength(Number(e.target.value))}
                              className="w-full h-2 bg-cinza-claro rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-cinza-secundario">
                              <span>8</span>
                              <span>32</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-cinza-texto">Incluir caracteres:</Label>
                          
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="rounded border-borda-sutil"
                              />
                              <span className="text-sm text-cinza-texto">Maiúsculas (A-Z)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="rounded border-borda-sutil"
                              />
                              <span className="text-sm text-cinza-texto">Minúsculas (a-z)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="rounded border-borda-sutil"
                              />
                              <span className="text-sm text-cinza-texto">Números (0-9)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="rounded border-borda-sutil"
                              />
                              <span className="text-sm text-cinza-texto">Símbolos (!@#$%)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Botão gerar */}
                      <Button 
                        onClick={generatePassword}
                        disabled={isGenerating}
                        className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gerando senha...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Gerar nova senha
                          </>
                        )}
                      </Button>

                      {/* Senha gerada */}
                      {generatedPassword && (
                        <div className="space-y-3">
                          <Label className="text-cinza-texto">Senha gerada:</Label>
                          <div className="flex gap-2">
                            <Input
                              value={generatedPassword}
                              readOnly
                              className="border-borda-sutil bg-cinza-claro text-cinza-texto font-mono"
                            />
                            <Button
                              onClick={() => copyToClipboard(generatedPassword)}
                              variant="outline"
                              size="sm"
                              className="border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={useGeneratedPassword}
                              variant="outline"
                              className="border-verde-folha text-verde-folha hover:bg-verde-claro flex-1"
                            >
                              Usar no Sistema Menor Preço
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}