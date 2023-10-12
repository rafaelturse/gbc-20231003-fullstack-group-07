mongoose = require('mongoose');

const MenuItemSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
    description: {
        type: String
    },
    photo: {
        type: String,
		required: true,
    }
});

const OrderItemSchema = mongoose.Schema({
	menu_item: {
		type: String,
		required: true,
	},
    menu_item_id: {
        type: String,
        required: true,
    },
    order_number: {
        type: String,
		required: true,
    },
    order_ref: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        require: true,
    },
    customer_name: {
        type: String,
        require: true,
        default: ""
    },
    order_date: {
        type: String,
        required: true
    },
    order_photo: {
        type: String,
        required: true
    },
    proof_photo: {
        type: String
    },
    order_driver: {
        type: String
    },
    driver_fullname: {
        type: String,
    },
    driver_license_plate: {
        type: String,
    },
    order_price: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        required: true,
        default: new Date()
    }
});


const Menu = mongoose.model('Menu', MenuItemSchema);
const Order = mongoose.model('Order', OrderItemSchema);

module.exports = { Menu, Order };
