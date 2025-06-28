"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import logoImage from 'figma:asset/aa6dfb22a361d25713cba631ca17f4edeae6d718.png';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validação básica
    if (!email.trim()) {
      setError("Por favor, digite seu e-mail");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, digite um e-mail válido");
      return;
    }

    setIsLoading(true);

    try {
      // Simula chamada para API de recuperação de senha
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Solicitação de recuperação de senha para:", email);
      
      // Simula sucesso
      setIsSuccess(true);
      
    } catch (err) {
      setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
      console.error("Erro na recuperação de senha:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setEmail("");
    setError("");
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <ImageWithFallback
              src={logoImage}
              alt="MonitorAgro Logo"
              className="h-20 w-auto"
            />
          </div>

          <Card className="bg-branco-puro border-borda-sutil shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-cinza-texto">E-mail enviado com sucesso!</CardTitle>
              <CardDescription className="text-cinza-secundario">
                Instruções para redefinir sua senha foram enviadas para <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Próximos passos:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Verifique sua caixa de entrada</li>
                    <li>• Procure por e-mail do MonitorAgro</li>
                    <li>• Clique no link para redefinir sua senha</li>
                    <li>• O link expira em 30 minutos</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full border-borda-sutil text-cinza-texto hover:bg-cinza-claro"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar para outro e-mail
                </Button>

                <Button
                  onClick={onBackToLogin}
                  className="w-full bg-verde-folha hover:bg-verde-folha/90 text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao login
                </Button>
              </div>

              <div className="text-center text-sm text-cinza-secundario">
                <p>Não recebeu o e-mail?</p>
                <button
                  onClick={handleTryAgain}
                  className="text-verde-folha hover:underline font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <ImageWithFallback
            src={logoImage}
            alt="MonitorAgro Logo"
            className="h-20 w-auto"
          />
        </div>

        <Card className="bg-branco-puro border-borda-sutil shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-cinza-texto">Esqueci minha senha</CardTitle>
            <CardDescription className="text-cinza-secundario">
              Digite seu e-mail para receber instruções de recuperação de senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mensagem de erro */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Campo de e-mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cinza-texto">
                  E-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail cadastrado"
                  disabled={isLoading}
                  className="border-borda-sutil focus:border-verde-folha focus:ring-verde-folha/20 bg-branco-puro"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Informações adicionais */}
              <Alert className="bg-blue-50 border-blue-200">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Como funciona:</strong> Você receberá um e-mail com um link seguro para redefinir sua senha. 
                  O link expira em 30 minutos por questões de segurança.
                </AlertDescription>
              </Alert>

              {/* Botão de envio */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-verde-folha hover:bg-verde-folha/90 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando e-mail...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar link de recuperação
                  </>
                )}
              </Button>

              {/* Link para voltar */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  disabled={isLoading}
                  className="inline-flex items-center text-sm text-cinza-secundario hover:text-verde-folha transition-colors"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Voltar ao login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações de suporte */}
        <div className="mt-6 text-center text-xs text-cinza-secundario">
          <p>Ainda com problemas para acessar sua conta?</p>
          <p className="mt-1">
            Entre em contato com nosso suporte:{" "}
            <a 
              href="mailto:suporte@monitoragro.com.br" 
              className="text-verde-folha hover:underline"
            >
              suporte@monitoragro.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}