// app/dashboard/unauthorized/page.jsx
export default function UnauthorizedPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4">You don’t have permission to view this page.</p>
    </div>
  );
}
