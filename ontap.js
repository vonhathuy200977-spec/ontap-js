let bookings = [
  { bookingCode: "CIN-001", customerName: "Nguyễn Văn An",
    movieTitle: "Ánh Trăng Cuối Phố", ticketCount: 2,
    pricePerTicket: 90000, totalAmount: 194400 },
  { bookingCode: "CIN-002", customerName: "Trần Thị Bình",
    movieTitle: "Biệt Đội Sao Băng", ticketCount: 4,
    pricePerTicket: 90000, totalAmount: 349920 },
  { bookingCode: "CIN-003", customerName: "Lê Minh Châu",
    movieTitle: "Mùa Hè Rực Lửa", ticketCount: 6,
    pricePerTicket: 110000, totalAmount: 641520 }
];

function normalizeBookingCode(code) {
    return String(code ?? "").trim().toUpperCase();
}

function validateBookingCode(code) {
    if (code === null) {
        return "Hủy thao tác";
    }

    const trimmedCode = String(code).trim();
    if (trimmedCode === "") {
        return "Mã đơn đặt vé không được để trống.";
    }

    const upperCode = trimmedCode.toUpperCase();
    if (upperCode.length < 6) {
        return "Mã đơn đặt vé phải có ít nhất 6 ký tự.";
    }

    if (!upperCode.startsWith("CIN-")) {
        return "Mã đơn đặt vé phải bắt đầu bằng 'CIN-'.";
    }

    if (findBookingIndex(upperCode) !== -1) {
        return "Mã đơn đặt vé đã tồn tại. Vui lòng nhập mã khác.";
    }

    return "";
}

function findBookingIndex(code) {
    const targetCode = normalizeBookingCode(code);
    if (!targetCode) {
        return -1;
    }

    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].bookingCode === targetCode) {
            return i;
        }
    }

    return -1;
}

function inputInteger(promptMessage, minValue = Number.MIN_SAFE_INTEGER, maxValue = Number.MAX_SAFE_INTEGER) {
    while (true) {
        const input = prompt(promptMessage);

        if (input === null) {
            return null;
        }

        const trimmedInput = input.trim();
        if (trimmedInput === "") {
            alert("Vui lòng nhập một số nguyên.");
            continue;
        }

        const number = Number(trimmedInput);
        if (Number.isInteger(number) && Number.isFinite(number) && number >= minValue && number <= maxValue) {
            return number;
        }

        const rangeMessage = Number.isFinite(minValue) && Number.isFinite(maxValue)
            ? ` trong khoảng từ ${minValue} đến ${maxValue}`
            : "";
        alert(`Giá trị nhập vào không hợp lệ. Vui lòng nhập một số nguyên${rangeMessage}.`);
    }
}

function formatName(name) {
    if (!name) {
        return "";
    }

    const trimmedName = name.trim();
    if (trimmedName === "") {
        return "";
    }

    const words = trimmedName.split(/\s+/).filter(Boolean);
    return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

function displayBookings(bookings) {
    const bookingList = Array.isArray(bookings) ? bookings : [];
    if (bookingList.length === 0) {
        console.log("Danh sách đơn đặt vé trống.");
        return;
    }

    let totalRevenue = 0;
    console.log("Danh sách đơn đặt vé:");
    bookingList.forEach((booking, index) => {
        totalRevenue += Number(booking.totalAmount) || 0;
        console.log(`${index + 1}. Mã đơn đặt vé: ${booking.bookingCode} | Tên khách hàng: ${booking.customerName} | Tên phim: ${booking.movieTitle} | Số lượng vé: ${booking.ticketCount} | Giá vé: ${booking.pricePerTicket} | Tổng tiền: ${booking.totalAmount}`);
    });

    console.log(`Tổng vé: ${bookingList.length}, Tổng doanh thu: ${totalRevenue}`);
}

function createBooking(bookingsList = bookings) {
    const rawCode = prompt("Nhập mã đơn đặt vé:");
    if (rawCode === null) {
        console.log("Hủy thao tác tạo đơn đặt vé.");
        return;
    }

    const error = validateBookingCode(rawCode);
    if (error !== "") {
        console.log(`Lỗi: ${error}`);
        return;
    }

    const rawName = prompt("Nhập tên khách hàng:");
    if (rawName === null) {
        console.log("Hủy thao tác tạo đơn đặt vé.");
        return;
    }
    if (rawName.trim() === "") {
        console.log("Tên khách hàng không được để trống.");
        return;
    }

    const rawMovie = prompt("Nhập tên phim:");
    if (rawMovie === null) {
        console.log("Hủy thao tác tạo đơn đặt vé.");
        return;
    }
    if (rawMovie.trim() === "") {
        console.log("Tên phim không được để trống.");
        return;
    }

    const ticketCount = inputInteger("Nhập số lượng vé:", 1, Number.MAX_SAFE_INTEGER);
    if (ticketCount === null) {
        console.log("Hủy thao tác tạo đơn đặt vé.");
        return;
    }

    const pricePerTicket = inputInteger("Nhập giá vé:", 1, Number.MAX_SAFE_INTEGER);
    if (pricePerTicket === null) {
        console.log("Hủy thao tác tạo đơn đặt vé.");
        return;
    }

    const placePrice = ticketCount * pricePerTicket;
    let discount = 0;
    if (ticketCount > 4) {
        discount = placePrice * 0.1;
    }

    const serviceFee = (placePrice - discount) * 0.08;
    const totalAmount = placePrice - discount + serviceFee;

    const bookingCode = normalizeBookingCode(rawCode);
    const customerName = formatName(rawName);
    const movieTitle = formatName(rawMovie);
    const newBooking = {
        bookingCode,
        customerName,
        movieTitle,
        ticketCount,
        pricePerTicket,
        totalAmount
    };

    bookingsList.push(newBooking);
    console.log("Đơn đặt vé đã được tạo thành công.");
}

function deleteBooking(bookingsList = bookings) {
    const deleteCodeInput = prompt("Nhập vào mã muốn xóa:");
    if (deleteCodeInput === null) {
        console.log("Hủy thao tác xóa đơn đặt vé.");
        return;
    }

    const deleteCode = normalizeBookingCode(deleteCodeInput);
    const index = findBookingIndex(deleteCode);
    if (index === -1) {
        console.log("Không tìm thấy đơn đặt vé có mã: " + deleteCode);
        return;
    }

    const choice = prompt("Xác nhận xóa vé: (Y/N)");
    if (choice === null || (choice.toUpperCase() !== "Y" && choice.toUpperCase() !== "N")) {
        console.log("Hủy thao tác xóa đơn đặt vé.");
        return;
    }

    if (choice.toUpperCase() === "Y") {
        bookingsList.splice(index, 1);
        console.log("Đơn đặt vé đã được xóa thành công.");
        return;
    }

    console.log("Hủy thao tác xóa đơn đặt vé.");
}

function updateBooking(bookingsList = bookings) {
    const updateCodeInput = prompt("Nhập vào mã muốn cập nhập: ");
    if (updateCodeInput === null) {
        console.log("Hủy thao tác cập nhật đơn đặt vé.");
        return;
    }

    const updateCode = normalizeBookingCode(updateCodeInput);
    const index = findBookingIndex(updateCode);
    if (index === -1) {
        console.log("Không tìm thấy đơn đặt vé có mã: " + updateCode);
        return;
    }

    const newTicketCount = inputInteger("Nhập số lượng vé mới:", 1, Number.MAX_SAFE_INTEGER);
    if (newTicketCount === null) {
        console.log("Hủy thao tác cập nhật đơn đặt vé.");
        return;
    }

    const newPricePerTicket = inputInteger("Nhập giá vé mới:", 1, Number.MAX_SAFE_INTEGER);
    if (newPricePerTicket === null) {
        console.log("Hủy thao tác cập nhật đơn đặt vé.");
        return;
    }

    const newPlacePrice = newTicketCount * newPricePerTicket;
    let newDiscount = 0;
    if (newTicketCount > 4) {
        newDiscount = newPlacePrice * 0.1;
    }

    const newServiceFee = (newPlacePrice - newDiscount) * 0.08;
    const newTotalAmount = newPlacePrice - newDiscount + newServiceFee;

    console.log("Đơn giá trước khi cập nhật: " + bookingsList[index].totalAmount);
    bookingsList[index].ticketCount = newTicketCount;
    bookingsList[index].pricePerTicket = newPricePerTicket;
    bookingsList[index].totalAmount = newTotalAmount;
    console.log("Đơn giá sau khi cập nhật: " + bookingsList[index].totalAmount);
    console.log("Đơn đặt vé đã được cập nhật thành công.");
}

function searchBooking() {
    const searchTitle = prompt("Nhập tên phim muốn tìm kiếm: ");
    if (searchTitle === null) {
        console.log("Hủy thao tác tìm kiếm đơn đặt vé.");
        return;
    }

    const searchText = searchTitle.trim().toLowerCase();
    let found = false;
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].movieTitle.toLowerCase().includes(searchText)) {
            console.log("Mã vé tìm thấy: " + bookings[i].bookingCode);
            found = true;
            break;
        }
    }

    if (!found) {
        console.log("Không tìm thấy đơn đặt vé cho phim: " + searchTitle);
    }
}

function main() {
    let choice = "";
    do {
        choice = prompt(`=====================================================
     HỆ THỐNG QUẢN LÝ ĐẶT VÉ MOONLIGHT CINEMA
=====================================================
1. Hiển thị danh sách đơn đặt vé
2. Thêm đơn đặt vé mới
3. Cập nhật đơn đặt vé
4. Xóa đơn đặt vé
5. Tìm kiếm đơn đặt vé theo tên phim
0. Thoát chương trình
=====================================================
Vui lòng nhập lựa chọn của bạn (0 - 5):`);

        if (choice === null) {
            console.log("Hủy thao tác. Chương trình kết thúc.");
            break;
        }

        switch (choice) {
            case "1":
                displayBookings(bookings);
                break;
            case "2":
                createBooking(bookings);
                break;
            case "3":
                updateBooking(bookings);
                break;
            case "4":
                deleteBooking(bookings);
                break;
            case "5":
                searchBooking();
                break;
            case "0":
                console.log("Thoát chương trình.");
                break;
            default:
                alert("Lựa chọn không hợp lệ. Vui lòng nhập lại.");
                break;
        }
    } while (choice !== "0");
}

main();

