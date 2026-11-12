// 1. let/const — Khai báo biến, không dùng var
const products = [
    { id: 1, name: "Laptop Gaming", price: 22000000, category: "Laptop" },
    { id: 2, name: "Chuột Không Dây", price: 450000, category: "Phụ kiện" },
    { id: 3, name: "Bàn Phím Cơ", price: 1200000, category: "Phụ kiện" },
    { id: 4, name: "Màn Hình 24 inch", price: 3500000, category: "Màn hình" },
    { id: 5, name: "Tai Nghe Bluetooth", price: 850000, category: "Âm thanh" },
    { id: 6, name: "Ổ Cứng SSD 512GB", price: 1500000, category: "Linh kiện" }
];

let cartItems = [];

// 4. Default parameter — Hàm định dạng giá tiền (mặc định đơn vị là '₫')
const formatPrice = (amount, currency = "₫") => {
    return `${amount.toLocaleString("vi-VN")} ${currency}`;
};

// 3. Rest parameter — Hàm tính tổng tiền giỏ hàng
const calculateTotal = (...prices) => {
    return prices.reduce((total, currentPrice) => total + currentPrice, 0);
};

// 7. Enhanced object literal — Tạo object giỏ hàng
const createCartObject = (items, totalAmount) => {
    const updatedAt = new Date().toLocaleTimeString("vi-VN");
    return {
        items,          // Shorthand property
        totalAmount,    // Shorthand property
        updatedAt,
        // Shorthand method
        getSummary() {
            return `Giỏ hàng có ${this.items.length} sản phẩm - Tổng: ${formatPrice(this.totalAmount)}`;
        }
    };
};

// 5. Arrow function & 2. Destructuring & 6. Template literal — Render thẻ sản phẩm ra HTML
const renderProducts = () => {
    const productListEl = document.getElementById("product-list");

    const html = products.map((product) => {
        // 2. Destructuring — Lấy dữ liệu từ object sản phẩm
        const { id, name, price, category } = product;

        // 6. Template literal — Render thẻ sản phẩm ra HTML
        return `
            <div class="product-card">
                <h3>${name}</h3>
                <p>Danh mục: ${category}</p>
                <p class="price">${formatPrice(price)}</p>
                <button onclick="addToCart(${id})">Thêm vào giỏ</button>
            </div>
        `;
    }).join("");

    productListEl.innerHTML = html;
};

// 5. Arrow function — Các hàm xử lý sự kiện (thêm/xóa giỏ hàng)
const addToCart = (productId) => {
    const selectedProduct = products.find((item) => item.id === productId);
    if (selectedProduct) {
        cartItems.push(selectedProduct);
        renderCart();
    }
};

const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    renderCart();
};

const renderCart = () => {
    const cartItemsEl = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");

    if (cartItems.length === 0) {
        cartItemsEl.innerHTML = "<p>Chưa có sản phẩm nào.</p>";
        totalPriceEl.innerText = formatPrice(0);
        return;
    }

    cartItemsEl.innerHTML = cartItems.map((item, index) => {
        const { name, price } = item; // Destructuring
        return `
            <div class="cart-item">
                <span>${name} - ${formatPrice(price)}</span>
                <button class="btn-remove" onclick="removeFromCart(${index})">Xóa</button>
            </div>
        `;
    }).join("");

    // Lấy mảng giá tiền và truyền vào hàm dùng Rest Parameter
    const priceList = cartItems.map((item) => item.price);
    const total = calculateTotal(...priceList);

    // Khởi tạo object giỏ hàng bằng Enhanced Object Literal
    const cartObj = createCartObject(cartItems, total);
    console.log(cartObj.getSummary());

    totalPriceEl.innerText = formatPrice(total);
};

// 8. Promise (then/catch) — Mô phỏng gọi API đặt hàng
const simulateOrderAPI = (cartData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (cartData.items.length > 0) {
                resolve(`Đặt hàng thành công ${cartData.items.length} sản phẩm! Tổng thanh toán: ${formatPrice(cartData.totalAmount)}`);
            } else {
                reject("Giỏ hàng đang trống! Vui lòng chọn sản phẩm trước khi đặt hàng.");
            }
        }, 1500);
    });
};

// Sự kiện bấm nút Đặt hàng
document.getElementById("checkout-btn").addEventListener("click", () => {
    const statusEl = document.getElementById("order-status");
    statusEl.style.color = "#1976d2";
    statusEl.innerText = "Đang xử lý đơn hàng...";

    const priceList = cartItems.map((item) => item.price);
    const total = calculateTotal(...priceList);
    const currentCart = createCartObject(cartItems, total);

    simulateOrderAPI(currentCart)
        .then((successMessage) => {
            statusEl.style.color = "#388e3c";
            statusEl.innerText = successMessage;
            cartItems = [];
            renderCart();
        })
        .catch((errorMessage) => {
            statusEl.style.color = "#d32f2f";
            statusEl.innerText = errorMessage;
        });
});

// Khởi chạy hiển thị danh sách sản phẩm ban đầu
renderProducts();
renderCart();