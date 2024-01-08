import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const paginationRange = 5;


  useEffect(() => {
    fetch('https://s3.amazonaws.com/open-to-cors/assignment.json')
      .then((res) => res.json())
      .then((data) => {
        const productsArray = Object.values(data.products);
        setProducts(productsArray);
      });
  }, []);


  const categories = [...new Set(products.map((product) => product.subcategory))];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.subcategory === selectedCategory)
    : products;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const totalPageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const startPage = Math.max(1, currentPage - Math.floor(paginationRange / 2));
    const endPage = Math.min(totalPageCount, startPage + paginationRange - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => (
      <button
        key={startPage + index}
        className={`page-button ${currentPage === startPage + index ? 'active' : ''}`}
        onClick={() => paginate(startPage + index)}
      >
        {startPage + index}
      </button>
    ));
  };

  return (
    <div className="App">
      <div className="category-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tag btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="product-container">
        <h1>Products</h1>
        {currentItems.map((product) => (
          <div key={`${product.title}-${product.id}`} className="product-item">
            <div className="product-details">
              <div className="subcategory">{product.subcategory}</div>
              <div className="title">{product.title}</div>
              <div className="price">${product.price}</div>
              <div className="popularity">Popularity: {product.popularity}</div>
            </div>
          </div>
        ))}
        <div className="pagination">
          <button
            className="page-button btn"
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Back
          </button>
          {renderPageNumbers()}
          <button
            className="page-button btn"
            onClick={() => paginate(Math.min(currentPage + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
