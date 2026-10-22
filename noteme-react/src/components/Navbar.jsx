
function Navbar({ search, setSearch }) {
  return (
    <header className="navbar">
      <h1 className="logo"><span>Note</span><span className="logo-me">Me</span></h1>
      <input className="search-input" type="search" placeholder="Search Notes" value={search} onChange={(event) => setSearch(event.target.value)} />

      <button className="profile-button" title="Profile" onClick={() => alert("Profile feature will be added next.")}>☻</button>
    </header>
  );
}
export default Navbar;
