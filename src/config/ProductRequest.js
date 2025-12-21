import { allBooks } from '../data/content';

// Trả về Promise để async/await vẫn chạy
export const listProduct = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(allBooks);
        }, 100); // mô phỏng delay
    });
};

export const productDetail = async (id) => {
    return new Promise((resolve) => {
        const product = allBooks.find(p => p.id === Number(id));
        setTimeout(() => resolve({ metadata: { product } }), 100);
    });
};
