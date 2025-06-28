"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Lock, Building, MapPin, Phone } from "lucide-react";

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    position: "",
    phone: "",
    state: "",
    city: "",
    acceptTerms: false,
    acceptNewsletter: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) {
      newErrors.company = "Empresa é obrigatória";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Cargo é obrigatório";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.state) {
      newErrors.state = "Estado é obrigatório";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simula chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Dados do registro:", formData);
      
      // Aqui você faria a chamada real para a API
      // const response = await registerUser(formData);
      
      alert("Conta criada com sucesso! Verifique seu email para ativar a conta.");
      onBackToLogin();
      
    } catch (error) {
      setErrors({ submit: "Erro ao criar conta. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Muito fraca", "Fraca", "Regular", "Boa", "Muito boa"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-claro via-background to-verde-claro flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-branco-puro/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <img 
                src="/logo.png" 
                alt="MonitorAgro" 
                className="h-12 w-12"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="h-12 w-12 bg-verde-folha rounded-lg flex items-center justify-center text-white font-bold text-lg hidden"
                style={{ display: 'none' }}
              >
                MA
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-cinza-texto">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-cinza-secundario">
                {step === 1 ? "Informações básicas" : "Informações profissionais"}
              </CardDescription>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-verde-folha' : 'bg-gray-300'}`} />
              <div className={`w-8 h-1 ${step >= 2 ? 'bg-verde-folha' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-verde-folha' : 'bg-gray-300'}`} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  {/* Nome e Sobrenome */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-cinza-texto font-medium">
                        Nome *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Seu nome"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-cinza-texto font-medium">
                        Sobrenome *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Seu sobrenome"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cinza-texto font-medium">
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-cinza-texto font-medium">
                      Senha *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-cinza-secundario hover:text-cinza-texto"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Indicador de força da senha */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${
                                level <= passwordStrength
                                  ? strengthColors[passwordStrength - 1]
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-cinza-secundario">
                          Força: {strengthLabels[passwordStrength - 1] || "Muito fraca"}
                        </p>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-cinza-texto font-medium">
                      Confirmar Senha *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-cinza-secundario hover:text-cinza-texto"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-verde-folha hover:bg-verde-folha/90 text-white font-medium"
                  >
                    Próximo
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Empresa */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-cinza-texto font-medium">
                      Empresa *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Nome da empresa"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className={`pl-10 ${errors.company ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.company && (
                      <p className="text-sm text-red-500">{errors.company}</p>
                    )}
                  </div>

                  {/* Cargo */}
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-cinza-texto font-medium">
                      Cargo *
                    </Label>
                    <Input
                      id="position"
                      type="text"
                      placeholder="Seu cargo na empresa"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className={errors.position ? 'border-red-500' : ''}
                    />
                    {errors.position && (
                      <p className="text-sm text-red-500">{errors.position}</p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-cinza-texto font-medium">
                      Telefone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Estado e Cidade */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-cinza-texto font-medium">
                        Estado *
                      </Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {brazilianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-cinza-texto font-medium">
                        Cidade *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-cinza-secundario" />
                        <Input
                          id="city"
                          type="text"
                          placeholder="Sua cidade"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className={`pl-10 ${errors.city ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  {/* Termos e Condições */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                        className={errors.acceptTerms ? 'border-red-500' : ''}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="acceptTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Aceito os{" "}
                          <a href="#" className="text-verde-folha hover:underline">
                            termos de uso
                          </a>{" "}
                          e{" "}
                          <a href="#" className="text-verde-folha hover:underline">
                            política de privacidade
                          </a>
                        </Label>
                      </div>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptNewsletter"
                        checked={formData.acceptNewsletter}
                        onCheckedChange={(checked) => handleInputChange("acceptNewsletter", checked)}
                      />
                      <Label
                        htmlFor="acceptNewsletter"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Quero receber novidades e atualizações por email
                      </Label>
                    </div>
                  </div>

                  {errors.submit && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {errors.submit}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-verde-folha hover:bg-verde-folha/90 text-white font-medium"
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </div>
                </>
              )}
            </form>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={onBackToLogin}
                className="text-cinza-secundario hover:text-cinza-texto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}