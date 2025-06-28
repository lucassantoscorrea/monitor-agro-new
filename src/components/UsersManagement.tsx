"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BarChart3, FileText, Settings, Users, Package, UserPlus, Edit, Trash2, Shield, Mail, CheckCircle, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

interface UsersManagementProps {
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  activeSection: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

export function UsersManagement({ onLogout, onNavigateToSection, activeSection }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "João Silva",
      email: "joao@empresa.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 14:30",
      createdAt: "2023-06-15",
      permissions: ["read", "write", "delete", "admin"]
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@empresa.com",
      role: "user",
      status: "active",
      lastLogin: "2024-01-14 09:15",
      createdAt: "2023-08-22",
      permissions: ["read", "write"]
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@empresa.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "2024-01-10 16:45",
      createdAt: "2023-11-03",
      permissions: ["read"]
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana@empresa.com",
      role: "user",
      status: "pending",
      lastLogin: "Nunca",
      createdAt: "2024-01-12",
      permissions: ["read", "write"]
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user" as const,
    permissions: [] as string[]
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    setIsLoading(true);
    
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "pending",
        lastLogin: "Nunca",
        createdAt: new Date().toISOString().split('T')[0],
        permissions: newUser.permissions
      };
      
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "user", permissions: [] });
      setIsAddUserOpen(false);
      
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      
      setIsEditUserOpen(false);
      setSelectedUser(null);
      
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    setIsLoading(true);
    
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.filter(user => user.id !== userId));
      
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    setIsLoading(true);
    
    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" as const }
          : user
      ));
      
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "user": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "viewer": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const availablePermissions = [
    { id: "read", label: "Visualizar", description: "Pode visualizar dados e relatórios" },
    { id: "write", label: "Editar", description: "Pode criar e editar produtos" },
    { id: "delete", label: "Excluir", description: "Pode excluir produtos e dados" },
    { id: "admin", label: "Administrador", description: "Acesso total ao sistema" }
  ];

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
              <p className="text-sm text-muted-foreground">Gerenciamento de Usuários</p>
            </div>
          </div>
          
          <div className="ml-auto">
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
              variant="default"
              className="w-full justify-start"
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gerenciamento de Usuários</h2>
                <p className="text-muted-foreground">
                  Gerencie usuários, permissões e acessos do sistema
                </p>
              </div>
              
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do novo usuário
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="Nome do usuário"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="email@empresa.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Função</Label>
                      <Select value={newUser.role} onValueChange={(value: "admin" | "user" | "viewer") => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Permissões</Label>
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={newUser.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewUser({
                                    ...newUser,
                                    permissions: [...newUser.permissions, permission.id]
                                  });
                                } else {
                                  setNewUser({
                                    ...newUser,
                                    permissions: newUser.permissions.filter(p => p !== permission.id)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <div>
                              <Label htmlFor={permission.id} className="font-medium">
                                {permission.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddUser} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <Input
                      id="search"
                      placeholder="Nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role-filter">Função</Label>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Lista de todos os usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Login</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === "admin" ? "Administrador" : 
                               user.role === "user" ? "Usuário" : "Visualizador"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === "active" ? "Ativo" : 
                               user.status === "inactive" ? "Inativo" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.lastLogin}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleToggleUserStatus(user.id)}
                                      disabled={isLoading}
                                    >
                                      {user.status === "active" ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {user.status === "active" ? "Desativar" : "Ativar"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditUserOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-700"
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
              </CardContent>
            </Card>

            {/* Dialog de Edição */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Usuário</DialogTitle>
                  <DialogDescription>
                    Altere as informações do usuário
                  </DialogDescription>
                </DialogHeader>
                
                {selectedUser && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nome completo</Label>
                      <Input
                        id="edit-name"
                        value={selectedUser.name}
                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Função</Label>
                      <Select 
                        value={selectedUser.role} 
                        onValueChange={(value: "admin" | "user" | "viewer") => 
                          setSelectedUser({ ...selectedUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Visualizador</SelectItem>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Permissões</Label>
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`edit-${permission.id}`}
                              checked={selectedUser.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUser({
                                    ...selectedUser,
                                    permissions: [...selectedUser.permissions, permission.id]
                                  });
                                } else {
                                  setSelectedUser({
                                    ...selectedUser,
                                    permissions: selectedUser.permissions.filter(p => p !== permission.id)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <div>
                              <Label htmlFor={`edit-${permission.id}`} className="font-medium">
                                {permission.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditUser} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}