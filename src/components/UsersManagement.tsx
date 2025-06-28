"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, UserPlus, Edit, Trash2, Shield, Mail, CheckCircle, X, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user" | "viewer";
  status: "active" | "inactive" | "pending";
  joinedDate: string;
  lastActivity: string;
}

interface UsersManagementProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

export function UsersManagement({ onLogout, onNavigateToSection, activeSection }: UsersManagementProps) {
  // Estados
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRole] = useState<string>("admin"); // Simula o papel do usuário atual
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  
  // Estados para modais
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para formulários
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "user"
  });
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: ""
  });

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "products", icon: Package, label: "Produtos Monitorados" },
    { id: "reports", icon: FileText, label: "Relatórios" },
    { id: "users", icon: Users, label: "Usuários" },
    { id: "profile", icon: Settings, label: "Perfil" },
  ];

  // Mock data - simula usuários da organização
  const mockUsers: User[] = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@agronegocios.com.br",
      role: "admin",
      status: "active",
      joinedDate: "10/01/2025",
      lastActivity: "Há 2 horas"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@agronegocios.com.br",
      role: "manager",
      status: "active",
      joinedDate: "15/01/2025",
      lastActivity: "Há 1 dia"
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      email: "pedro.oliveira@agronegocios.com.br",
      role: "user",
      status: "active",
      joinedDate: "20/01/2025",
      lastActivity: "Há 3 horas"
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana.costa@agronegocios.com.br",
      role: "viewer",
      status: "inactive",
      joinedDate: "25/01/2025",
      lastActivity: "Há 1 semana"
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      email: "carlos.ferreira@agronegocios.com.br",
      role: "user",
      status: "pending",
      joinedDate: "15/06/2025",
      lastActivity:  "Nunca acessou"
    }
  ];

  // Simula carregamento dos usuários
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setUsers(mockUsers);
      } catch (err) {
        setError("Erro ao carregar usuários");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const canManageUsers = () => {
    return currentUserRole === "admin" || currentUserRole === "manager";
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
        return "bg-purple-100 text-purple-800 border-0";
      case "manager":
        return "bg-blue-100 text-blue-800 border-0";
      case "user":
        return "bg-verde-claro text-verde-folha border-0";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-verde-claro text-verde-folha border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0">
            <EyeOff className="w-3 h-3 mr-1" />
            Inativo
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-0">
            <Mail className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return null;
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleInviteUser = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
    
    if (!inviteForm.email.includes("@")) {
      setError("E-mail inválido");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: users.length + 1,
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role as User['role'],
        status: "pending",
        joinedDate: new Date().toLocaleDateString("pt-BR"),
        lastActivity: "Nunca acessou"
      };
      
      setUsers(prev => [...prev, newUser]);
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", role: "user" });
      showSuccess("Convite enviado com sucesso");
      
    } catch (err) {
      setError("Erro ao enviar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser?.id 
          ? {
              ...user,
              name: editForm.name,
              email: editForm.email,
              role: editForm.role as User['role'],
              status: editForm.status as User['status']
            }
          : user
      ));
      
      setShowEditModal(false);
      setSelectedUser(null);
      showSuccess("Usuário atualizado com sucesso");
      
    } catch (err) {
      setError("Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!window.confirm(`Tem certeza que deseja remover ${user?.name}?`)) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(prev => prev.filter(user => user.id !== userId));
      showSuccess("Usuário removido com sucesso");
    } catch (err) {
      setError("Erro ao remover usuário");
    }
  };

  const handleToggleStatus = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "active" ? "inactive" : "active";
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus as User['status'] } : u
      ));
      showSuccess(`Usuário ${newStatus === "active" ? "ativado" : "desativado"} com sucesso`);
    } catch (err) {
      setError("Erro ao alterar status do usuário");
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
                  <h1 className="text-cinza-texto">Gerenciar Usuários</h1>
                  <p className="text-sm text-cinza-secundario">
                    Gerencie os usuários da sua organização
                  </p>
                </div>
              </div>
              {canManageUsers() && (
                <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Convidar Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Convidar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Envie um convite para um novo usuário se juntar à organização
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nome completo</Label>
                        <Input
                          value={inviteForm.name}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Digite o nome completo"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                          type="email"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Digite o e-mail"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissão</Label>
                        <Select
                          value={inviteForm.role}
                          onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currentUserRole === "admin" && (
                              <SelectItem value="admin">Administrador</SelectItem>
                            )}
                            <SelectItem value="manager">Gerente</SelectItem>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowInviteModal(false)}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleInviteUser}
                        disabled={isSubmitting}
                        className="bg-verde-folha hover:bg-verde-folha/90 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Enviar Convite"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
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

            {/* Aviso para usuários sem permissão */}
            {!canManageUsers() && (
              <div className="mb-6">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Você não tem permissão para gerenciar usuários. Entre em contato com o administrador.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Cards de resumo */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Total de Usuários
                    </CardTitle>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">{users.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Usuários Ativos
                    </CardTitle>
                    <div className="p-2 bg-verde-claro rounded-lg">
                      <CheckCircle className="h-4 w-4 text-verde-folha" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">
                      {users.filter(u => u.status === "active").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Convites Pendentes
                    </CardTitle>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Mail className="h-4 w-4 text-yellow-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">
                      {users.filter(u => u.status === "pending").length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-branco-puro border-borda-sutil shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm text-cinza-secundario font-medium">
                      Administradores
                    </CardTitle>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-cinza-texto">
                      {users.filter(u => u.role === "admin").length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabela de usuários */}
            <Card className="bg-branco-puro border-borda-sutil shadow-sm">
              <CardHeader>
                <CardTitle className="text-cinza-texto">Lista de Usuários</CardTitle>
                <CardDescription className="text-cinza-secundario">
                  {isLoading 
                    ? "Carregando usuários..."
                    : `${users.length} usuário${users.length !== 1 ? 's' : ''} na organização`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-verde-folha" />
                      <p className="text-sm text-cinza-secundario">Carregando usuários...</p>
                    </div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="rounded-lg border border-borda-sutil">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cinza-claro/50">
                          <TableHead className="text-cinza-texto font-medium">Nome</TableHead>
                          <TableHead className="text-cinza-texto font-medium">E-mail</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Permissão</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Status</TableHead>
                          <TableHead className="text-cinza-texto font-medium">Último Acesso</TableHead>
                          {canManageUsers() && (
                            <TableHead className="text-cinza-texto font-medium text-right">Ações</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-cinza-claro/30 transition-colors">
                            <TableCell className="font-medium text-cinza-texto">
                              <div className="space-y-1">
                                <div>{user.name}</div>
                                <div className="text-xs text-cinza-secundario">
                                  Membro desde {user.joinedDate}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-cinza-secundario">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(user.role)}>
                                <Shield className="w-3 h-3 mr-1" />
                                {getRoleLabel(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(user.status)}
                            </TableCell>
                            <TableCell className="text-cinza-secundario text-sm">
                              {user.lastActivity}
                            </TableCell>
                            {canManageUsers() && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {user.status !== "pending" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleStatus(user.id)}
                                      className="h-8 w-8 p-0 text-cinza-secundario hover:text-verde-folha hover:bg-verde-claro"
                                      title={user.status === "active" ? "Desativar usuário" : "Ativar usuário"}
                                    >
                                      {user.status === "active" ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                    className="h-8 w-8 p-0 text-cinza-secundario hover:text-blue-600 hover:bg-blue-50"
                                    title="Editar usuário"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="h-8 w-8 p-0 text-cinza-secundario hover:text-red-600 hover:bg-red-50"
                                    title="Remover usuário"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-cinza-claro rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-cinza-secundario" />
                      </div>
                    </div>
                    <h3 className="text-cinza-texto mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-sm text-cinza-secundario mb-6">
                      Comece convidando usuários para sua organização
                    </p>
                    {canManageUsers() && (
                      <Button 
                        onClick={() => setShowInviteModal(true)}
                        className="bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Convidar Primeiro Usuário
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere as informações e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissão</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUserRole === "admin" && (
                    <SelectItem value="admin">Administrador</SelectItem>
                  )}
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={isSubmitting}
              className="bg-verde-folha hover:bg-verde-folha/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}