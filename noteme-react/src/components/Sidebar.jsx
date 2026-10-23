
function Sidebar({ setActivePage }) {
  return (
    <aside className="sidebar">
      <button onClick={() => setActivePage("Home")}>🏠 Home</button>
      <button onClick={() => setActivePage("Important")}>⭐ Important</button>
      <button onClick={() => setActivePage("Trash")}>🗑️ Trash</button>
      <h3>Categories</h3>
      <button onClick={() => setActivePage("Study")}>📚 Study</button>
      <button onClick={() => setActivePage("Work")}>💼 Work</button>
      <button onClick={() => setActivePage("Personal")}>👤 Personal</button>
    </aside>
  );
}
export default Sidebar;
