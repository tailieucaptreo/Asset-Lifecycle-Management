<input
  placeholder="Tìm kiếm..."
  onChange={e =>
    setFilter({ ...filter, search: e.target.value })
  }
/>