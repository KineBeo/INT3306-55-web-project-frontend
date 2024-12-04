const Articles = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Article Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Article #{item}</h3>
            <p className="text-gray-600">Sample Article information</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
