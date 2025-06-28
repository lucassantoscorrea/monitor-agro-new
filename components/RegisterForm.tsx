"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from 'figma:asset/016bce01b94c157583a6707b8d0617fe48e1c973.png';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Limpa erro quando usuário digita
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome completo é obrigatório");
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
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não conferem");
      return false;
    }
    if (!formData.companyName.trim()) {
      setError("Nome da empresa é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay da API
      
      // Simulação de cadastro bem-sucedido
      console.log("Dados do cadastro:", formData);
      setSuccess(true);
      
      // Após 2 segundos, redireciona para login
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
      
    } catch (err) {
      setError("Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md bg-branco-puro shadow-xl border-borda-sutil">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-verde-claro rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-verde-folha" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-cinza-texto">Cadastro realizado com sucesso!</h2>
                <p className="text-cinza-secundario">
                  Sua conta foi criada. Redirecionando para a tela de login...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md bg-branco-puro shadow-xl border-borda-sutil">
        <CardHeader className="space-y-6 text-center pt-8">
          <div className="flex justify-center">
            <ImageWithFallback
              src={logoImage}
              alt="MonitorAgro Logo"
              className="h-12 w-auto"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-cinza-texto">Criar conta no MonitorAgro</CardTitle>
            <CardDescription className="text-cinza-secundario">
              Cadastre-se para começar a monitorar preços de defensivos agrícolas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-cinza-texto">Nome da empresa</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Nome da sua empresa"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                disabled={isLoading}
                className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-cinza-texto">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                disabled={isLoading}
                className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cinza-texto">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
                className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cinza-texto">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-cinza-texto">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                disabled={isLoading}
                className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-verde-folha hover:bg-verde-folha/90 text-white shadow-sm" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-verde-folha hover:text-verde-folha/80 hover:underline transition-colors font-medium"
                disabled={isLoading}
              >
                Já tenho uma conta - Fazer login
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-borda-sutil">
            <p className="text-xs text-center text-cinza-secundario">
              MonitorAgro - Sistema de monitoramento de preços de defensivos agrícolas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}