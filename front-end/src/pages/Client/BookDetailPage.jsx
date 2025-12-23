import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { productDetail, listProduct } from '../../config/ProductRequest';
import { 
    Button, Tag, Breadcrumb, Image, Spin, Descriptions, 
    Divider, message, Rate, Form, Input, List, Avatar 
} from 'antd';
import { HomeOutlined, HeartOutlined } from '@ant-design/icons';
import "./review.css"
import defaultImg from "../../assets/images/default.png";
import { useCart } from "../../context/CartContext";

function DetailProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    const formatCurrency = useMemo(
        () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await productDetail(id);
                if (res.metadata.product) {
                    setProduct(res.metadata.product);
                    const all = await listProduct();
                    setRelatedProducts(all.filter(item => String(item.id) !== String(id)).slice(0, 4));
                } else {
                    message.error('Không tìm thấy sản phẩm');
                }
            } catch (error) {
                message.error('Lỗi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f2ee]"><Spin size="large" /></div>;
    if (!product) return <div className="pt-40 text-center bg-[#f4f2ee] h-screen"><h2>Sản phẩm không tồn tại</h2></div>;

    return (
        <div className="bg-[#f4f2ee] min-h-screen pb-20 pt-40"> {/* Tông màu Beige sang trọng */}
            <Header />
            
            <div className="container mx-auto px-4 pt-32" >
                <Breadcrumb
                className="mb-6 opacity-40 uppercase tracking-[0.2em]"
                items={[
                    {
                        title: (
                            <Link to="/" className="breadcrumb-item">
                                <HomeOutlined />
                            </Link>
                        ),
                    },
                    {
                        title: (
                            <Link to="/books" className="breadcrumb-item">
                                Sách
                            </Link>
                        ),
                    },
                    {
                        title: <span className="breadcrumb-item">{product.title}</span>,
                    },
                ]}
            />


                
                <div className="bg-white rounded-[40px] shadow-sm overflow-hidden mb-12 border border-white">
                    <div style={{ display: "flex", gap: 60 }}>
                        
                        {/* BÊN TRÁI: Ảnh sách chiếm 5/12 cột */}
                        <div className="col-md-3 text-center bg-[#f4f2ee]" tyle={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
                            <Image style={{
                                        width: "100%",
                                        maxHeight: 450,
                                        objectFit: "contain",
                                        background: "#fff",
                                        padding: 20,
                                        borderRadius: 12,
                                        marginTop: 40
                                        }}
                                src={product.imagesProduct?.[selectedImage] || product.image || defaultImg} 
                                fallback={defaultImg}
                                className="img-fluid rounded transition-all duration-500" 
                                preview={false} 
                            />
                        </div>

                        {/* BÊN PHẢI: Thông tin chi tiết chiếm 7/12 cột theo đúng thứ tự bản vẽ */}
                        <div className="md:col-span-7 p-10 lg:p-16 flex flex-col gap-6" style={{ flex: 1 }}>
                            
                            {/* 1. Tên Sách */}
                            <h1 className="text-4xl lg:text-5xl font-serif text-gray-800 leading-tight mb-5" style={{ marginBottom: 10 }}>
                                {product.title}
                            </h1>

                            {/* 2. Tác giả */}
                            <p className="text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-0 text-left">
                                Tác giả: <span className="text-blue-500 font-medium">{product.author}</span>
                            </p>
                            
                            {/* 3. Giá tiền (Đã tính giảm giá nếu có) */}
                            <div className="flex items-center mt-2" style={{ gap: "12px" }} >
                                {product.prevPrice && Number(product.prevPrice) > Number(product.price) && (
                                    <span
                                        style={{
                                            textDecoration: "line-through",
                                            color: "#888",
                                            fontSize: 16,
                                        }}
                                    >
                                        {formatCurrency.format(product.prevPrice)}
                                    </span>
                                )}
                                <span className="text-lg" style={{ fontSize: 24, color: "red", fontWeight: 700 }}>
                                    {formatCurrency.format(product.price)}
                                </span>
                            </div>

                            {/* 4. Đánh giá sao */}
                            <div className="flex items-center gap-3">
                                <Rate disabled defaultValue={4.5} className="text-sm text-yellow-400" />
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">(12 nhận xét)</span>
                            </div>

                            {/* 5. Khối Nhận xét (NX) / Mô tả ngắn */}
                            <div className="bg-gray-50/80 p-6 lg:p-8 rounded-3xl relative mt-2 text-left">
                                <span className="absolute -top-3 left-6 bg-white px-3 text-gray-300 font-serif text-lg italic uppercase tracking-tighter">Mô tả sách</span>
                                <p className="text-gray-500 leading-relaxed text-sm lg:text-base italic mb-0 text-left">
                                    "{product.description || product.descriptionProduct || "Chưa có mô tả."}"
                                </p>
                            </div>

                            {/* 6. Cụm nút Mua ngay & Yêu thích (Tim) */}
                            <div className="flex w-full max-w-sm h-14 lg:h-16 mt-4" style={{ display: "flex", gap: 12, marginTop: 12 }}>
                              {/*nút mua ngay */}
                              <button
                                onClick={() => {
                                  const item = {
                                    id: product.id,
                                    title: product.title,
                                    author: product.author,
                                    price: product.price,
                                    image: product.imagesProduct?.[0] || product.image || defaultImg,
                                  };
                                  addToCart(item);
                                  message.success("Đã thêm vào giỏ hàng");
                                  navigate("/cart");
                                }}
                                className="flex-1 bg-[#b19173] hover:bg-[#9d7b5b] text-white font-bold text-sm lg:text-base uppercase tracking-widest transition-all disabled:bg-gray-300 rounded-2xl shadow-lg shadow-amber-100"
                              >
                                Mua ngay
                              </button>
                              {/* Nút Thêm vào giỏ */}
                              <button 
                                onClick={() => {
                                  const item = {
                                    id: product.id,
                                    title: product.title,
                                    author: product.author,
                                    price: product.price,
                                    image: product.imagesProduct?.[0] || product.image || defaultImg,
                                  };
                                  addToCart(item);
                                  message.success('Đã thêm vào giỏ hàng');
                                }}
                                disabled={product.stockProduct === 0}
                                className="flex-[3] bg-[#0066ff] hover:bg-blue-700 text-white font-bold text-sm lg:text-base uppercase tracking-widest transition-all disabled:bg-gray-300 rounded-2xl shadow-lg shadow-blue-100"
                              >
                                Thêm vào giỏ hàng
                              </button>

                              {/* Nút Trái tim - Sửa lại để hiển thị rõ ràng */}
                              <button className="flex-1  hover:bg-red-50 text-red-400 flex items-center justify-center transition-all text-xl lg:text-2xl rounded-2xl border border-gray-100 shadow-sm"
                                onClick={() => message.success('Đã thêm vào danh sách yêu thích')}>
                                <HeartOutlined />
                              </button>
                            </div>
                        </div>
                    </div>
                </div>

                
            
        

                {/* Nhận xét tối giản */}
                <div className="bg-white rounded-[40px] p-16 shadow-sm mb-12">
    <h2 className="text-3xl font-serif mb-12 text-gray-800 text-center uppercase tracking-widest opacity-80">
        Đánh giá của người mua
    </h2>
    <div className="max-w-3xl mx-auto">
        <div className="rating-summary">
    {/* LEFT */}
    <div className="rating-overview">
        <h3>Đánh giá sản phẩm</h3>

        <div className="rating-score">
            <span className="score">4.0</span>
            <span className="total">/5</span>
        </div>

        <Rate disabled defaultValue={4} />

        <span className="rating-count">4 lượt đánh giá</span>
    </div>

    {/* RIGHT */}
    <div className="rating-bars">
        {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="rating-bar">
                <span className="star-label">{star} sao</span>
                <div className="bar">
                    <div
                        className="bar-fill"
                        style={{
                            width:
                                star === 5
                                    ? "75%"
                                    : star === 1
                                    ? "25%"
                                    : "0%",
                        }}
                    />
                </div>
                <span className="star-count">
                    {star === 5 ? 3 : star === 1 ? 1 : 0}
                </span>
            </div>
        ))}
    </div>
</div>

        <List
            dataSource={[
                { user: 'Hoàng Nam', content: 'Giao hàng nhanh, sách đẹp đúng mô tả. Rất đáng mua!', rate: 5 },
                { user: 'Minh Thư', content: 'Nội dung sách rất hay và ý nghĩa, mình học được nhiều điều mới.', rate: 5 },
                { user: 'Quốc Bảo', content: 'Bìa sách thiết kế sang trọng, giấy in chất lượng cao, rất hài lòng.', rate: 4 },
                { user: 'Thu Thảo', content: 'Đóng gói cẩn thận, nhân viên hỗ trợ nhiệt tình. Sẽ ủng hộ shop dài dài.', rate: 5 },
                { user: 'Anh Tuấn', content: 'Sách hay nhưng giao hàng hơi chậm một chút do đơn vị vận chuyển.', rate: 4 },
                { user: 'Ngọc Ánh', content: 'Kiến thức trong sách rất thực tế, trình bày dễ hiểu và lôi cuốn.', rate: 5 }
            ]}
            renderItem={item => (
                <div className="mb-10 pb-10 border-b border-gray-50 last:border-none" style={{margin: 20}}>
                    <div className="flex justify-between items-center mb-4" >
                        <div className="flex items-center gap-4">
                            <Avatar size="large" className="bg-blue-50 text-blue-400 font-bold">
                                {item.user[0]}
                            </Avatar>
                            <span className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                                {item.user}
                            </span>
                        </div>
                        <Rate disabled defaultValue={item.rate} className="text-[10px]" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed pl-14 italic">
                        "{item.content}"
                    </p>
                </div>
            )}
        />
    </div>
</div>

            </div>
        </div>
        
    );
}

export default DetailProduct;

