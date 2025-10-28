import { Authenticated } from "@refinedev/core";
import { AntdInferencer } from "@refinedev/inferencer/antd";
import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
} from "@refinedev/antd";
import {
  CatchAllNavigate,
  NavigateToResource,
} from "@refinedev/react-router";
import { Outlet, Route, Routes } from "react-router";
import { Header } from "../components/header";
import { LoginPage } from "../pages/login";
import { RegisterPage } from "../pages/register";
import { ForgotPasswordPage } from "../pages/forgot-password";
import { Verify2FAPage } from "../pages/verify-2fa";
import { DashboardPage } from "../pages/dashboard";
import { HomePage } from "../pages/home";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home Page */}
      <Route
        index
        element={
          <Authenticated key="home" fallback={<HomePage />}>
            <CatchAllNavigate to="/dashboard" />
          </Authenticated>
        }
      />

      {/* Authenticated Routes */}
      <Route
        element={
          <Authenticated
            key="authenticated-inner"
            fallback={<CatchAllNavigate to="/login" />}
          >
            <ThemedLayoutV2
              Header={Header}
              Sider={(props) => <ThemedSiderV2 {...props} fixed />}
            >
              <Outlet />
            </ThemedLayoutV2>
          </Authenticated>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Profiles routes */}
        <Route path="/profiles">
          <Route index element={<AntdInferencer />} />
          <Route path="create" element={<AntdInferencer />} />
          <Route path="edit/:id" element={<AntdInferencer />} />
          <Route path="show/:id" element={<AntdInferencer />} />
        </Route>

        {/* Profile Audits routes */}
        <Route path="/profile_audits">
          <Route index element={<AntdInferencer />} />
          <Route path="create" element={<AntdInferencer />} />
          <Route path="edit/:id" element={<AntdInferencer />} />
          <Route path="show/:id" element={<AntdInferencer />} />
        </Route>

        {/* Audits routes */}
        <Route path="/audits">
          <Route index element={<AntdInferencer />} />
          <Route path="create" element={<AntdInferencer />} />
          <Route path="edit/:id" element={<AntdInferencer />} />
          <Route path="show/:id" element={<AntdInferencer />} />
        </Route>

        {/* Questions routes */}
        <Route path="/questions">
          <Route index element={<AntdInferencer />} />
          <Route path="create" element={<AntdInferencer />} />
          <Route path="edit/:id" element={<AntdInferencer />} />
          <Route path="show/:id" element={<AntdInferencer />} />
        </Route>

        <Route path="*" element={<ErrorComponent />} />
      </Route>

      {/* Public Routes (Login, Register, etc.) */}
      <Route
        element={
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
            <CatchAllNavigate to="/dashboard" />
          </Authenticated>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-2fa" element={<Verify2FAPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  );
};
