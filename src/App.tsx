import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/Dashboard";
import AppointmentsPage from "./pages/dashboard/Appointments";
import PatientsPage from "./pages/dashboard/Patients";
import InvoicesPage from "./pages/dashboard/Invoices";
import PaymentsPage from "./pages/dashboard/Payments";
import ProductsPage from "./pages/dashboard/Products";
import ExpensesPage from "./pages/dashboard/Expenses";
import ContactsPage from "./pages/dashboard/Contacts";
import CommunicationsPage from "./pages/dashboard/Communications";
import ReportsPage from "./pages/dashboard/Reports";
import SettingsPage from "./pages/dashboard/Settings";
import AccountPage from "./pages/dashboard/Account";

function App() {
  return (
    <div>
      <main className="min-h-screen p-0">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="communications" element={<CommunicationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
