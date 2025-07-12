const MainSidebar = () => {
  return (
    <aside className="bg-gray-100 w-96 h-screen fixed top-0 left-0 transition-transform duration-300 transform translate-x-0 z-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sidebar</h1>
        <nav className="mt-4">
          <ul>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-200">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-200">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-200">
                Customers
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-200">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default MainSidebar
