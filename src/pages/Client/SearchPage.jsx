import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { allBooks } from '../../data/content'; // Import toàn bộ sách
import Header from '../../components/Header';
import { ProductCard } from '../../App'; // Tái sử dụng ProductCard từ App

function SearchPage() {
    const location = useLocation();
    // Lấy từ khóa 'q' từ URL (ví dụ: /search?q=harry)
    const query = new URLSearchParams(location.search).get('q') || '';

    const filteredResults = useMemo(() => {
        return allBooks.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);
    const searchResults = useMemo(() => {
        if (!query.trim()) return [];
        return allBooks.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [query]);
    return (
        <div className="app">
            <Header searchQuery={query} /> {/* Truyền query vào để hiện lại ở ô input */}
            
            <section className="py-5 mt-40">
                <div className="container">
                    <div className="section-header align-center mb-5">
                        <h2 className="section-title">Kết quả tìm kiếm cho: "{query}"</h2>
                        <p className="text-muted">{filteredResults.length} sản phẩm được tìm thấy</p>
                    </div>

                    <div className="product-list">
                        <div className="row">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((book) => (
                                    <div className="col-md-3 mb-4" key={book.id}>
                                        <ProductCard {...book} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-20">
                                    <i className="icon icon-search text-5xl opacity-20 block mb-4"></i>
                                    <h3>Rất tiếc, không tìm thấy sản phẩm nào phù hợp.</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SearchPage;