import { Authenticated } from "@refinedev/core";
import { AntdInferencer } from "@refinedev/inferencer/antd";
import {
  AuthPage,
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

export const AppRoutes = () => {
  return (
    <Routes>
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
        <Route index element={<NavigateToResource resource="profiles" />} />

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

      <Route
        element={
          <Authenticated key="authenticated-outer" fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        }
      >
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/register" element={<AuthPage type="register" />} />
        <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
      </Route>
    </Routes>
  );
};