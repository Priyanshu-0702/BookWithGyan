import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import EventBookings from "./pages/EventBookings";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AddUser from "./pages/AddUser";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <RoleRoute role="EMPLOYEE">
                <EmployeeDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
<Route
  path="/admin/create"
  element={
    <ProtectedRoute>
      <RoleRoute role="ADMIN">
        <CreateEvent />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/add-user"
  element={
    <ProtectedRoute>
      <RoleRoute role="ADMIN">
        <AddUser />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/edit/:id"
  element={
    <ProtectedRoute>
      <RoleRoute role="ADMIN">
        <EditEvent />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/events/:id/bookings"
  element={
    <ProtectedRoute>
      <RoleRoute role="ADMIN">
        <EventBookings />
      </RoleRoute>
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/bookings"
  element={
    <ProtectedRoute>
      <RoleRoute role="EMPLOYEE">
        <MyBookings />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/employee/bookings"
  element={
    <ProtectedRoute>
      <RoleRoute role="EMPLOYEE">
        <MyBookings />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
{/* Catch All */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}