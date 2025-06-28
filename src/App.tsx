"use client";

import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { Dashboard } from "./components/Dashboard";
import { ProductsMonitored } from "./components/ProductsMonitored";
import { AddProduct } from "./components/AddProduct";
import { Reports } from "./components/Reports";
import { ReportView } from "./components/ReportView";
import { Profile } from "./components/Profile";
import { UsersManagement } from "./components/UsersManagement";
import { VisualSettings } from "./components/VisualSettings";
import { ThemeProvider } from "./components/ThemeContext";
import { VisualSettingsProvider } from "./components/VisualSettingsContext";

type ViewState = "login" | "register" | "dashboard" | "forgot-password";
type DashboardSection = "dashboard" | "products" | "reports" | "users" | "profile" | "add-product" | "report-view" | "visual-settings";

// Tipo para produto em edição
export interface ProductToEdit {
  id: number;
  name: string;
  category: string;
  type: "mapa" | "custom";
  brand?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard");
  const [selectedReport, setSelectedReport] = useState<{ id: number; date: string } | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductToEdit | null>(null);

  const handleGoToRegister = () => {
    setCurrentView("register");
  };

  const handleGoToForgotPassword = () => {
    setCurrentView("forgot-password");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleLoginSuccess = () => {
    setCurrentView("dashboard");
    setActiveSection("dashboard");
  };

  const handleLogout = () => {
    setCurrentView("login");
    setActiveSection("dashboard");
    setSelectedReport(null);
    setProductToEdit(null);
  };

  const handleNavigateToSection = (section: string) => {
    setActiveSection(section as DashboardSection);
    
    // Limpa o relatório selecionado ao navegar para outras seções
    if (section !== "report-view") {
      setSelectedReport(null);
    }
    
    // Limpa o produto em edição se não estiver indo para add-product
    if (section !== "add-product") {
      setProductToEdit(null);
    }
  };

  const handleProductAdded = (product: { name: string; category: string; type: "mapa" | "custom" }) => {
    console.log("Produto adicionado:", product);
    
    // Log diferenciado baseado no tipo
    if (product.type === "mapa") {
      console.log("✅ Produto do MAPA cadastrado:", {
        name: product.name,
        category: product.category,
        source: "Registro oficial MAPA",
        monitoringAccuracy: "Alta precisão"
      });
    } else {
      console.log("📝 Produto personalizado cadastrado:", {
        name: product.name,
        category: product.category,
        source: "Cadastro manual",
        monitoringAccuracy: "Precisão baseada em dados não oficiais"
      });
    }
    
    // Aqui você pode implementar lógica diferenciada para cada tipo
    // Por exemplo, diferentes APIs de monitoramento ou diferentes intervalos de busca
  };

  const handleProductUpdated = (product: { id: number; name: string; category: string; type: "mapa" | "custom" }) => {
    console.log("Produto atualizado:", product);
    
    // Limpa o produto em edição após atualização
    setProductToEdit(null);
    
    // Log da atualização
    console.log("✏️ Produto editado com sucesso:", {
      id: product.id,
      name: product.name,
      category: product.category,
      type: product.type
    });
  };

  const handleEditProduct = (product: ProductToEdit) => {
    console.log("Editando produto:", product);
    setProductToEdit(product);
    setActiveSection("add-product");
  };

  const handleViewReport = (reportId: number, reportDate: string) => {
    setSelectedReport({ id: reportId, date: reportDate });
    setActiveSection("report-view");
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case "products":
        return (
          <ProductsMonitored 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
            onEditProduct={handleEditProduct}
          />
        );
      case "add-product":
        return (
          <AddProduct 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
            onProductAdded={handleProductAdded}
            onProductUpdated={handleProductUpdated}
            productToEdit={productToEdit}
          />
        );
      case "reports":
        return (
          <Reports 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
            onViewReport={handleViewReport}
          />
        );
      case "report-view":
        if (selectedReport) {
          return (
            <ReportView 
              onLogout={handleLogout} 
              onNavigateToSection={handleNavigateToSection}
              activeSection="reports" // Mantém o menu "reports" ativo
              reportId={selectedReport.id}
              reportDate={selectedReport.date}
            />
          );
        } else {
          // Fallback caso não tenha relatório selecionado
          return (
            <Reports 
              onLogout={handleLogout} 
              onNavigateToSection={handleNavigateToSection}
              activeSection="reports"
              onViewReport={handleViewReport}
            />
          );
        }
      case "profile":
        return (
          <Profile 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
          />
        );
      case "users":
        return (
          <UsersManagement 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
          />
        );
      case "visual-settings":
        return (
          <VisualSettings 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
          />
        );
      default:
        return (
          <Dashboard 
            onLogout={handleLogout} 
            onNavigateToSection={handleNavigateToSection}
            activeSection={activeSection}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <VisualSettingsProvider>
        {currentView === "login" && (
          <LoginForm 
            onGoToRegister={handleGoToRegister}
            onGoToForgotPassword={handleGoToForgotPassword}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {currentView === "register" && (
          <RegisterForm onBackToLogin={handleBackToLogin} />
        )}
        {currentView === "forgot-password" && (
          <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        )}
        {currentView === "dashboard" && renderDashboardContent()}
      </VisualSettingsProvider>
    </ThemeProvider>
  );
}