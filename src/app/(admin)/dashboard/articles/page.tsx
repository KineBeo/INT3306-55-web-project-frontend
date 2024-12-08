import Articles from "@/components/admin/articles";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const ArticlesPage = () => {
  return (
    <AdminProtectedRoute>
      <Articles />
    </AdminProtectedRoute>
  );
};

export default ArticlesPage;
