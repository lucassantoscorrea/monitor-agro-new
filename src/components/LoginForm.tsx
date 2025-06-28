"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface LoginFormProps {
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

export function LoginForm({ onGoToRegister, onGoToForgotPassword, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulação de autenticação - em produção, seria uma chamada real para API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API
      
      // Validação básica para demonstração
      if (email === "admin@monitoragro.com" && password === "123456") {
        console.log("Login realizado com sucesso!");
        onLoginSuccess();
      } else {
        setError("Credenciais inválidas");
      }
    } catch (err) {
      setError("Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-branco-puro shadow-xl border-borda-sutil">
        <CardHeader className="space-y-6 text-center pt-8">
          <div className="flex justify-center">
            <ImageWithFallback
              src={logoImage}
              alt="MonitorAgro Logo"
              className="h-20 w-auto"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-cinza-texto">Entrar no MonitorAgro</CardTitle>
            <CardDescription className="text-cinza-secundario">
              Acesse sua conta para monitorar preços de defensivos agrícolas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cinza-texto">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="flex flex-col items-center space-y-3 pt-2">
              <button 
                type="button"
                onClick={onGoToForgotPassword}
                className="text-sm text-verde-folha hover:text-verde-folha/80 hover:underline transition-colors"
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>
              
              <div className="text-sm text-cinza-secundario">
                Não tem uma conta?{" "}
                <button 
                  type="button"
                  onClick={onGoToRegister}
                  className="text-verde-folha hover:text-verde-folha/80 hover:underline transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cadastre-se aqui
                </button>
              </div>
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