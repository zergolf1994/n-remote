"use strict";

module.exports = ({ page, count, per_page }) => {
  per_page = parseInt(per_page) || 10;
  const currentPage = parseInt(page) ? parseInt(page) : 1;
  const countPage = Math.ceil(count / parseInt(per_page)) || 1;
  const startRow = currentPage == 1 ? 0 : (currentPage - 1) * per_page;
  const PerPage = parseInt(per_page);

  return {
    total: countPage,
    current: currentPage,
    count,
    startRow,
    endRow: PerPage,
    per_page,
  };
};
