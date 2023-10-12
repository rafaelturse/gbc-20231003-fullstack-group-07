const express = require('express');
const { Menu , Order } = require('../database/model');
const RestaurantRouter = express.Router();

RestaurantRouter.get('/', async (req, res) => {

	try {

		const menu = await Menu.find().lean().exec();

		if (menu) {

			res.render("index", { layout: "RestaurantLayout", items: menu });

			return;

		}

		res.render("index", { layout: false, items: [], error: "Cannot retrieve menu item" });


	} catch (error) {

		console.log(error);

		res.render("index", { layout: false, items: [], error: "Cannot retrieve menu item" });

	}

});

RestaurantRouter.get('/get-order/:orderId', async (req, res) => {

	try {

		console.log(req.params.orderId);

		const order = await Order.find({ order_ref : req.params.orderId }).lean().exec();

		if (order?.[0]) {

			res.status(200).send({ success: true , order : order?.[0] });

			return;

		}

		res.status(200).send({ success: true , order : undefined, message: "No item found" });

	} catch (error) {

		res.status(400).send({ success: false , order : undefined, message: "No item found" });

	}

});

RestaurantRouter.post('/', async (req, res) => {

	try {

		let latestOrder = await Order.find().sort( [['_id', -1]]).limit(1).lean().exec();

		latestOrder = latestOrder?.[0];

		const orderNumber = latestOrder?.order_number ? Number(latestOrder?.order_number) + 1 : 1;

		const orderDetails = {

			menu_item : req.body.name,

			menu_item_id: req.body.menuItemId,

			order_number: orderNumber,

			order_status: "RECEIVED",

			order_ref: "ORDER-" + String(orderNumber) + Math.floor(new Date().valueOf() * Math.random()),

			order_date: new Date().toISOString(),

			order_photo: req.body.photo,

			order_price: req.body.price,

			order_driver: "",

			address: req.body.orderAddress,

			customer_name: req.body.customerName,

			driver_fullname: "",

			driver_license_plate: ""

		};

		console.log(orderDetails);

		const order = new Order(orderDetails);

		const newOrder = await order.save();
		
		res.status(200).send({ success: true, data: newOrder });

	} catch (e){

		console.log(e);

		res.status(400).send({ success: false, message: 'false' });

	}

});

module.exports = RestaurantRouter;
