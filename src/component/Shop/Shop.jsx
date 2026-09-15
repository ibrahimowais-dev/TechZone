import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const FilterContent = ({
    isMobile = false,
    categories,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy,
    handleResetFilters
}) => (
    <div className="card border-0 p-1 bg-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Filters</h5>
            <button 
                onClick={handleResetFilters} 
                className="btn btn-sm btn-link text-decoration-none p-0 text-danger"
            >
                Reset All
            </button>
        </div>

        <hr className="my-2" />

        <div className="mb-3">
            <label htmlFor="categorySelect" className="form-label fw-semibold small text-muted">Category</label>
            <select
                id="categorySelect"
                className="form-select form-select-sm text-capitalize"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Price Range ($)</label>
            <div className="d-flex gap-2">
                <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="align-self-center text-muted">-</span>
                <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
        </div>

        <div className="mb-2">
            <label htmlFor="sortBySelect" className="form-label fw-semibold small text-muted">Sort By</label>
            <select
                id="sortBySelect"
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="default">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
            </select>
        </div>

        {isMobile && (
            <button 
                type="button" 
                className="btn btn-primary w-100 fw-semibold mt-3" 
                data-bs-dismiss="offcanvas"
            >
                Apply Filters
            </button>
        )}
    </div>
);

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('default');

    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch('https://my-json-api-2dca.onrender.com/products')
            .then((res) => {
                if (!res.ok) throw new Error('Connection Failed');
                return res.json();
            })
            .then((data) => {
                setProducts(data);
                
                const uniqueCategories = ['all', ...new Set(data.map(item => item.category).filter(Boolean))];
                setCategories(uniqueCategories);

                setLoading(false);
            })
            .catch((err) => {
                console.error('API Error:', err);
                setError('API Connection Failed');
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchParams(value ? { search: value } : {});
    };

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('default');
        setSearchParams({});
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
        const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);

        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-az') return a.title.localeCompare(b.title);
        if (sortBy === 'name-za') return b.title.localeCompare(a.title);
        return 0;
    });

    const filterProps = {
        categories,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        sortBy,
        setSortBy,
        handleResetFilters
    };

    return (
        <section className="py-4 bg-body-tertiary vh-100 overflow-hidden d-flex flex-column">
            <div className="container-fluid px-3 px-md-4 h-100 d-flex flex-column">
                
                <div className="bg-body p-3 rounded shadow-sm mb-3 flex-shrink-0">
                    <div className="row g-2 align-items-center">
                        <div className="col-12 col-md-4">
                            <h2 className="fw-bold fs-4 mb-0 text-center text-md-start">
                                Shop Products
                            </h2>
                        </div>
                        
                        <div className="col-12 col-md-8">
                            <div className="d-flex gap-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-body-tertiary border-end-0">🔍</span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                <button 
                                    className="btn btn-primary d-lg-none text-nowrap fw-semibold" 
                                    type="button" 
                                    data-bs-toggle="offcanvas" 
                                    data-bs-target="#filterOffcanvas"
                                >
                                    Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="offcanvas offcanvas-start rounded-end" tabIndex="-1" id="filterOffcanvas">
                    <div className="offcanvas-header border-bottom">
                        <h5 className="offcanvas-title fw-bold">Filter Products</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body">
                        <FilterContent isMobile={true} {...filterProps} />
                    </div>
                </div>

                <div className="row g-4 flex-grow-1 overflow-hidden pb-3">
                    
                    <div className="col-lg-3 h-100 d-none d-lg-block">
                        <div className="card border-0 shadow-sm p-3 bg-body rounded h-100 overflow-y-auto">
                            <FilterContent {...filterProps} />
                        </div>
                    </div>

                    <div className="col-12 col-lg-9 h-100 overflow-y-auto px-2 px-md-3">
                        {loading && (
                            <div className="text-center py-5 bg-body rounded shadow-sm">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-body-secondary fw-semibold">Loading Products...</p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger text-center my-4" role="alert">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                    <span className="text-muted small">
                                        Showing <strong>{sortedProducts.length}</strong> products
                                    </span>
                                </div>

                                <div className="row g-3 g-md-4 pb-4">
                                    {sortedProducts.length > 0 ? (
                                        sortedProducts.map((product) => (
                                            <div key={product.id} className="col-6 col-md-4 col-xl-3">
                                                <div className="card h-100 shadow-sm border-0 bg-body">
                                                    <Link to={`/shop-product-details/${product.id}`} className="d-block w-100 p-0 rounded-top overflow-hidden">
                                                        <img
                                                            src={product.thumbnail}
                                                            className="w-100 object-fit-cover"
                                                            alt={product.title}
                                                            style={{ height: '160px' }}
                                                        />
                                                    </Link>
                                                    <div className="card-body d-flex flex-column p-2 p-md-3">
                                                        <Link to={`/shop-product-details/${product.id}`} className="text-decoration-none text-body">
                                                            <h6 className="card-title fw-bold mb-1 text-truncate small fs-md-6" title={product.title}>
                                                                {product.title}
                                                            </h6>
                                                        </Link>

                                                        <p className="card-text mb-2 text-body-secondary small text-truncate d-none d-sm-block">
                                                            {product.description}
                                                        </p>

                                                        <span className="fs-6 fs-md-5 fw-bold text-primary my-1">${product.price}</span>

                                                        <div className="mt-auto">
                                                            <button
                                                                type="button"
                                                                onClick={() => addToCart(product)}
                                                                className="btn btn-primary btn-sm w-100 fw-semibold py-1 py-md-2"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center py-5 bg-body rounded shadow-sm">
                                            <h5 className="text-body-secondary mb-2">No products match your criteria</h5>
                                            <p className="text-muted small">Try adjusting your filters or search term.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}